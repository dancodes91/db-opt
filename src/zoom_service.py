"""
Zoom Kiosk - Zoom Service

Orchestrates the Zoom Meeting SDK operations using Python bindings for Windows SDK.
Handles:
- SDK initialization and authentication
- Meeting start/join
- Screen sharing with audio
- Remote control management
"""

import asyncio
import time
import base64
import hmac
import hashlib
import json
import os
import sys
from pathlib import Path
from typing import Optional, Callable, List, Dict, Any
import jwt
from .config import KioskConfig

# Setup SDK paths before importing bindings
def _setup_sdk_paths() -> None:
    """Configure Python import path and DLL search path for SDK bindings"""
    # Get the directory containing this file (src/); project root is parent
    current_file = Path(__file__).resolve()
    project_root = current_file.parent.parent

    # Add bindings directory to Python path
    bindings_dir = project_root / "bindings"
    if bindings_dir.exists() and str(bindings_dir) not in sys.path:
        sys.path.insert(0, str(bindings_dir))
        print(f'[ZoomService] Added bindings directory to Python path: {bindings_dir}')

    # Add SDK bin directory to DLL search path (Windows)
    if sys.platform == 'win32':
        sdk_bin_dir = project_root / "sdk" / "zoom-sdk-windows-6.7.2.26830" / "x64" / "bin"
        if sdk_bin_dir.exists():
            try:
                # Python 3.8+ supports os.add_dll_directory
                os.add_dll_directory(str(sdk_bin_dir))
                print(f'[ZoomService] Added SDK bin directory to DLL search path: {sdk_bin_dir}')
            except AttributeError:
                # Fallback for Python < 3.8: use ctypes to call SetDllDirectory
                try:
                    import ctypes
                    kernel32 = ctypes.windll.kernel32
                    kernel32.SetDllDirectoryW(str(sdk_bin_dir))
                    print(f'[ZoomService] Set DLL directory via SetDllDirectory: {sdk_bin_dir}')
                except Exception as e:
                    print(f'[ZoomService] Warning: Could not set DLL directory: {e}')
        else:
            print(f'[ZoomService] Warning: SDK bin directory not found: {sdk_bin_dir}')

# Setup paths before importing
_setup_sdk_paths()

# Import SDK bindings (will be available after building)
try:
    import zoom_sdk_bindings as sdk
    print('[ZoomService] SDK bindings imported successfully')
except ImportError as e:
    print(f'[ZoomService] Warning: SDK bindings not available: {e}')
    print('[ZoomService] Install with: pip install -e bindings/')
    sdk = None


class ZoomService:
    """Zoom SDK service wrapper"""

    def __init__(self, config: KioskConfig):
        self.config = config
        self.is_initialized = False
        self.is_authenticated = False
        self.is_in_meeting = False
        self.is_sharing = False
        self.current_status = 'Not initialized'
        # Mock mode: no real Zoom connection; simulates join/meeting for testing when SDK/auth unavailable
        self.use_mock_mode = False

        # SDK instances
        self.zoom_sdk = None
        self.auth_service: Optional[Any] = None
        self.meeting_service: Optional[Any] = None
        self.participants_ctrl: Optional[Any] = None
        self.share_ctrl: Optional[Any] = None
        self.meeting_config: Optional[Any] = None

        # Event callbacks
        self._callbacks: Dict[str, List[Callable]] = {
            'initialized': [],
            'authenticated': [],
            'meetingJoined': [],
            'disconnected': [],
            'sharingStarted': [],
            'sharingStopped': [],
            'otherParticipantPresent': [],
            'error': []
        }

        # Callback wrappers
        self.auth_event_callbacks: Optional[Any] = None
        self.meeting_event_callbacks: Optional[Any] = None
        self.participants_event_callbacks: Optional[Any] = None
        self.sharing_event_callbacks: Optional[Any] = None

        # Timeout tracking
        self.auth_timeout_task: Optional[asyncio.Task] = None
        # Auth retry (rejoin real meeting instead of mock)
        self.auth_retry_count: int = 0
        self.max_auth_retries: int = 5

    def on(self, event: str, callback: Callable) -> None:
        """Register event callback"""
        if event in self._callbacks:
            self._callbacks[event].append(callback)

    def once(self, event: str, callback: Callable) -> None:
        """Register one-time event callback"""
        def wrapper(*args, **kwargs):
            callback(*args, **kwargs)
            self.off(event, wrapper)
        self.on(event, wrapper)

    def off(self, event: str, callback: Callable) -> None:
        """Unregister event callback"""
        if event in self._callbacks:
            if callback in self._callbacks[event]:
                self._callbacks[event].remove(callback)

    def emit(self, event: str, *args, **kwargs) -> None:
        """Emit event to all registered callbacks"""
        if event in self._callbacks:
            for callback in self._callbacks[event]:
                try:
                    callback(*args, **kwargs)
                except Exception as e:
                    print(f'[ZoomService] Error in callback for {event}: {e}')

    async def initialize(self, force_reload: bool = False) -> None:
        """Initialize SDK. If force_reload and SDK was already in use, clean up and re-init for real-meeting retry."""
        if sdk is None:
            print('[ZoomService] SDK not available, using mock mode')
            self.use_mock_mode = True
            await self._initialize_mock()
            return

        try:
            # Retry path: clean up and re-init so we can rejoin the real meeting
            if force_reload and (self.auth_service or self.meeting_service):
                if self.auth_timeout_task and not self.auth_timeout_task.done():
                    self.auth_timeout_task.cancel()
                    self.auth_timeout_task = None
                print('[ZoomService] Cleaning up SDK for retry...')
                sdk.CleanUPSDK()
                self.auth_service = None
                self.meeting_service = None
                self.participants_ctrl = None
                self.share_ctrl = None
                self.meeting_config = None
                self.auth_event_callbacks = None
                self.meeting_event_callbacks = None
                self.participants_event_callbacks = None
                self.sharing_event_callbacks = None
                self.is_initialized = False
                self.is_authenticated = False
                self.is_in_meeting = False
                self.is_sharing = False
                await asyncio.sleep(1.0)
                print('[ZoomService] Retrying SDK init and auth...')

            # Initialize SDK
            init_param = sdk.InitParam()
            init_param.strWebDomain = 'https://www.zoom.us'
            init_param.emLanguageID = sdk.SDK_LANGUAGE_ID.LANGUAGE_English
            init_param.enableLogByDefault = True


            result = sdk.InitSDK(init_param)
            if result != sdk.SDKError.SDKERR_SUCCESS:
                raise Exception(f'SDK initialization failed: {result}')

            print('[ZoomService] SDK initialized')

            # Wait a bit after InitSDK to ensure SDK is fully ready
            await asyncio.sleep(0.5)

            # Create services
            self.auth_service = sdk.CreateAuthService()
            self.meeting_service = sdk.CreateMeetingService()

            if not self.auth_service or not self.meeting_service:
                raise Exception('Failed to create SDK services')

            # Set up auth callbacks
            self.auth_event_callbacks = sdk.AuthServiceEventCallbacks()
            self.auth_event_callbacks.onAuthCallback = self._on_auth_result
            self.auth_event_callbacks.onIdentityExpiredCallback = self._on_identity_expired
            self.auth_service.SetEvent(self.auth_event_callbacks)

            # Set up timeout for auth callback (in case it doesn't fire)
            self.auth_timeout_task = asyncio.create_task(self._auth_timeout_handler())

            # Authenticate with JWT
            jwt_token = self._generate_jwt()
            auth_context = sdk.AuthContext()
            auth_context.jwt_token = jwt_token

            print('[ZoomService] Calling SDKAuth...')
            result = self.auth_service.SDKAuth(auth_context)
            if result != sdk.SDKError.SDKERR_SUCCESS:
                # Cancel timeout if auth call failed
                if self.auth_timeout_task:
                    self.auth_timeout_task.cancel()
                    self.auth_timeout_task = None
                raise Exception(f'SDK authentication failed: {result}')

            self.current_status = 'Authenticating...'
            print('[ZoomService] SDKAuth called successfully, waiting for callback...')

        except Exception as e:
            # Cancel timeout if initialization failed
            if self.auth_timeout_task:
                self.auth_timeout_task.cancel()
                self.auth_timeout_task = None
            print(f'[ZoomService] Initialization error: {e}')
            print('[ZoomService] Falling back to mock mode')
            self.use_mock_mode = True
            await self._initialize_mock()

    async def _auth_timeout_handler(self) -> None:
        """Handle auth callback timeout; retry real-meeting join instead of mock."""
        await asyncio.sleep(10.0)  # Wait 10 seconds
        if not self.is_authenticated:
            self.auth_timeout_task = None
            print('[ZoomService] Auth callback timeout - auth callback did not fire within 10 seconds')
            self.emit('error', 'Authentication timeout - SDK may not be ready for reconnection')
            self.auth_retry_count += 1
            if self.auth_retry_count <= self.max_auth_retries:
                delay = 5
                print(f'[ZoomService] Will retry real-meeting join in {delay}s (attempt {self.auth_retry_count}/{self.max_auth_retries})')
                await self._retry_initialize_after_delay(delay)
            else:
                print(f'[ZoomService] Max auth retries ({self.max_auth_retries}) reached. Check config and SDK.')

    async def _retry_initialize_after_delay(self, seconds: float) -> None:
        """Wait then re-initialize SDK and auth so the app retries joining the real meeting."""
        await asyncio.sleep(seconds)
        await self.initialize(force_reload=True)

    def _on_auth_result(self, result: int) -> None:
        """Handle authentication result"""
        # Cancel timeout if auth callback fired
        if self.auth_timeout_task:
            self.auth_timeout_task.cancel()
            self.auth_timeout_task = None

        print(f'[ZoomService] Auth result: {result}')

        if result == sdk.AuthResult.AUTHRET_SUCCESS:
            self.is_authenticated = True
            self.is_initialized = True
            self.current_status = 'Authenticated'

            # Set up meeting callbacks
            self.meeting_event_callbacks = sdk.MeetingServiceEventCallbacks()
            self.meeting_event_callbacks.onStatusChangedCallback = lambda status, result: self._on_meeting_status_changed(status, result)
            self.meeting_service.SetEvent(self.meeting_event_callbacks)

            # Get controllers
            self.participants_ctrl = self.meeting_service.GetMeetingParticipantsController()
            self.share_ctrl = self.meeting_service.GetMeetingShareController()
            self.meeting_config = self.meeting_service.GetMeetingConfiguration()

            # Configure meeting settings - disable all dialogs for automatic join
            if self.meeting_config:
                try:
                    # Disable password and screen name dialogs
                    self.meeting_config.EnableInputMeetingPasswordDlg(False)
                    self.meeting_config.EnableInputMeetingScreenNameDlg(False)

                    # Disable join audio dialog - auto-join with configured settings
                    self.meeting_config.DisableAutoShowSelectJoinAudioDlgWhenJoinMeeting(True)

                    # Disable join meeting window dialog (the Zoom meeting UI window)
                    self.meeting_config.DisableShowJoinMeetingWnd(True)

                    # Disable waiting for host dialog
                    self.meeting_config.DisableWaitingForHostDialog(True)

                    # Disable wrong password popup dialog
                    self.meeting_config.DisablePopupMeetingWrongPSWDlg(True)

                    # Disable remote control approval dialogs (auto-accept remote control requests)
                    # But keep the button visible so users can enable remote control
                    # self.meeting_config.EnableApproveRemoteControlDlg(False)
                    self.meeting_config.EnableDeclineRemoteControlResponseDlg(False)

                    # Keep remote control UI button visible (set to False to show it)
                    self.meeting_config.HideRemoteControlOnMeetingUI(False)

                    print('[ZoomService] Meeting dialogs disabled for automatic join')
                except Exception as e:
                    print(f'[ZoomService] Warning: Could not disable some dialogs: {e}')

            # Set up participants callbacks
            if self.participants_ctrl:
                self.participants_event_callbacks = sdk.ParticipantsCtrlEventCallbacks()
                self.participants_event_callbacks.onUserJoinCallback = lambda lst, s: self._on_user_join(lst, s)
                self.participants_event_callbacks.onUserLeftCallback = lambda lst, s: self._on_user_left(lst, s)
                self.participants_ctrl.SetEvent(self.participants_event_callbacks)

            # Set up sharing callbacks
            if self.share_ctrl:
                self.sharing_event_callbacks = sdk.SharingCtrlEventCallbacks()
                self.sharing_event_callbacks.onSharingStatusChangedCallback = lambda share_info: self._on_sharing_status_changed(share_info)
                self.share_ctrl.SetEvent(self.sharing_event_callbacks)

            self.auth_retry_count = 0  # reset on success
            self.emit('initialized')
        else:
            self.current_status = f'Authentication failed: {result}'
            self.emit('error', f'Authentication failed with code: {result}')
            self.auth_retry_count += 1
            if self.auth_retry_count <= self.max_auth_retries:
                delay = 5
                print(f'[ZoomService] Will retry real-meeting join in {delay}s (attempt {self.auth_retry_count}/{self.max_auth_retries})')
                try:
                    loop = asyncio.get_event_loop()
                    asyncio.run_coroutine_threadsafe(self._retry_initialize_after_delay(delay), loop)
                except Exception as e:
                    print(f'[ZoomService] Could not schedule retry: {e}')
            else:
                print(f'[ZoomService] Max auth retries ({self.max_auth_retries}) reached. Check config and SDK.')

    def _on_identity_expired(self) -> None:
        """Handle identity expired"""
        print('[ZoomService] Identity expired, need to re-authenticate')
        self.emit('error', 'Zoom identity expired')

    def _on_meeting_status_changed(self, status: int, result: int) -> None:
        """Handle meeting status changes"""
        print(f'[ZoomService] Meeting status: {status}, result: {result}')

        if status == sdk.MeetingStatus.MEETING_STATUS_INMEETING:
            self.is_in_meeting = True
            self.current_status = 'In meeting'

            # Ensure meeting window/dialog is disabled/hidden after joining
            if self.meeting_config:
                try:
                    # Call again to ensure it's still disabled
                    self.meeting_config.DisableShowJoinMeetingWnd(True)
                    self.meeting_config.DisableWaitingForHostDialog(True)
                    self.meeting_config.DisablePopupMeetingWrongPSWDlg(True)
                    print('[ZoomService] Meeting window/dialog disabled after joining')
                except Exception as e:
                    print(f'[ZoomService] Warning: Could not disable meeting window: {e}')

            # Hide Zoom meeting window using SDK API (more precise)
            self._hide_zoom_meeting_window()
            # Also hide window after a delay in case it appears later
            asyncio.create_task(self._hide_zoom_meeting_window_delayed())

            self.emit('meetingJoined')

            # Check for other participants
            other_count = self.get_other_participant_count()
            if other_count > 0:
                print(f'[ZoomService] Other participants already in meeting (count={other_count}), starting screen share...')
                self.emit('otherParticipantPresent')
                asyncio.create_task(self._start_screen_share_delayed())

        elif status == sdk.MeetingStatus.MEETING_STATUS_DISCONNECTING:
            self.current_status = 'Disconnecting...'
            if self.is_in_meeting:
                self.is_in_meeting = False
                self.is_sharing = False

        elif status == sdk.MeetingStatus.MEETING_STATUS_ENDED or status == sdk.MeetingStatus.MEETING_STATUS_FAILED:
            if self.is_in_meeting:
                self.is_in_meeting = False
                self.is_sharing = False
            self.current_status = 'Disconnected'
            status_name = 'ended' if status == sdk.MeetingStatus.MEETING_STATUS_ENDED else 'failed'
            print(f'[ZoomService] Meeting {status_name} - emitting disconnected event')
            self.emit('disconnected', f'Meeting {status_name}')

    def _on_user_join(self, lst_user_id: Any, str_user_list: Optional[str] = None) -> None:
        """Handle user join callback"""
        ids = self._to_participant_ids(lst_user_id)
        print(f'[ZoomService] meetinguserjoincb lstUserID={lst_user_id}, parsed ids={ids}')

        if self.is_in_meeting and ids:
            others = [id for id in ids if self._is_other_participant(id)]
            print(f'[ZoomService] meetinguserjoincb othersByIsMySelf(count)={len(others)}, ids={others}')

            # If we have any IDs and at least one is identified as other participant, start sharing
            # Also start sharing if we can't determine (safer - assume someone joined)
            if others or (ids and len(ids) > 0):
                self.emit('otherParticipantPresent')
                if not self.is_sharing:
                    print('[ZoomService] Participant detected, starting screen share...')
                    asyncio.create_task(self.start_screen_share())

    def _on_user_left(self, lst_user_id: Any, str_user_list: Optional[str] = None) -> None:
        """Handle user left callback"""
        print(f'[ZoomService] Participant left: {str_user_list}')

    def _on_participant_join(self, user_id: int) -> None:
        """Handle participant join callback"""
        if self._is_other_participant(user_id):
            self.emit('otherParticipantPresent')
            if not self.is_sharing:
                asyncio.create_task(self.start_screen_share())

    def _on_participant_left(self, user_id: int) -> None:
        """Handle participant left callback"""
        print(f'[ZoomService] Participant {user_id} left')

    def _on_sharing_status_changed(self, share_info: Any) -> None:
        """Handle sharing status changes"""
        try:
            status = share_info.status if hasattr(share_info, 'status') else 0
            user_id = share_info.userid if hasattr(share_info, 'userid') else 0
            print(f'[ZoomService] Share status: {status}, userId: {user_id}')

            if status == sdk.SharingStatus.Sharing_Self_Send_Begin:
                self.is_sharing = True
                self.current_status = 'Screen sharing active'
                self.emit('sharingStarted')
            elif status in (sdk.SharingStatus.Sharing_Self_Send_End, sdk.SharingStatus.Sharing_None):
                if self.is_sharing and self.is_in_meeting:
                    self.emit('sharingStopped')
                self.is_sharing = False
        except Exception as e:
            print(f'[ZoomService] Error handling sharing status: {e}')

    def _to_participant_ids(self, lst: Any) -> List[int]:
        """Convert participant ID list to integers"""
        if not lst:
            return []
        # Handle IList from SDK
        try:
            if hasattr(lst, 'GetCount') and hasattr(lst, 'GetItem'):
                result = []
                count = lst.GetCount()
                for i in range(count):
                    result.append(int(lst.GetItem(i)))
                return result
        except:
            pass
        # Handle Python list
        if isinstance(lst, list):
            result = []
            for item in lst:
                if isinstance(item, dict) and 'userid' in item:
                    result.append(int(item['userid']))
                elif isinstance(item, (int, str)):
                    result.append(int(item))
            return result
        return []

    def _is_other_participant(self, user_id: int) -> bool:
        """Check if user_id is another participant (not self)"""
        try:
            if not self.participants_ctrl:
                return False

            # Get myself user ID for comparison
            myself = self.participants_ctrl.GetMySelfUser()
            if myself and myself.GetUserID() == user_id:
                return False

            # Also check using GetUserByUserID (correct method name from bindings)
            info = self.participants_ctrl.GetUserByUserID(user_id)
            if info:
                return not info.IsMySelf()

            # If we can't get info, assume it's another participant (safer for screen sharing)
            return True
        except Exception as e:
            # If we can't determine, assume it's another participant to enable screen sharing
            print(f'[ZoomService] Warning: Could not check if user {user_id} is other participant: {e}')
            return True

    def get_other_participant_count(self) -> int:
        """Get count of other participants (excluding self)"""
        try:
            if not self.participants_ctrl:
                return 0
            ids = self.participants_ctrl.GetParticipantsList()
            if not ids:
                return 0

            # GetParticipantsList returns a Python list (converted in bindings)
            if isinstance(ids, list):
                return sum(1 for user_id in ids if self._is_other_participant(user_id))
            # Fallback for IListUInt (shouldn't happen but handle it)
            elif hasattr(ids, 'GetCount') and hasattr(ids, 'GetItem'):
                return sum(1 for i in range(ids.GetCount()) if self._is_other_participant(ids.GetItem(i)))
            else:
                return 0
        except Exception as e:
            print(f'[ZoomService] Error getting participant count: {e}')
            return 0

    def _generate_jwt(self) -> str:
        """Generate JWT for SDK authentication"""
        sdk_key = self.config['zoom']['sdkKey']
        sdk_secret = self.config['zoom']['sdkSecret']

        iat = int(time.time())
        exp = iat + 60 * 60 * 24  # 24 hours

        payload = {
            'appKey': sdk_key,
            'sdkKey': sdk_key,
            'mn': self.config['zoom']['pmi'],
            'role': 1,  # Host role
            'iat': iat,
            'exp': exp,
            'tokenExp': exp
        }

        token = jwt.encode(payload, sdk_secret, algorithm='HS256')
        return token

    async def start_meeting(self) -> None:
        """Start/host a meeting with PMI"""
        if self.use_mock_mode:
            await self._start_meeting_mock()
            return

        if not self.is_initialized or not self.meeting_service:
            raise Exception('SDK not initialized')

        self.current_status = 'Starting meeting...'

        # Ensure meeting window is disabled before joining
        if self.meeting_config:
            try:
                self.meeting_config.DisableShowJoinMeetingWnd(True)
                print('[ZoomService] Meeting window disabled before joining')
            except Exception as e:
                print(f'[ZoomService] Warning: Could not disable meeting window before join: {e}')

        # Join meeting without login (using JWT auth)
        join_param = sdk.JoinParam()
        join_param.userType = sdk.SDKUserType.SDK_UT_WITHOUT_LOGIN

        # Use the property accessor for the union member
        without_login = join_param.withoutloginuserJoin
        without_login.meetingNumber = int(self.config['zoom']['pmi'])
        without_login.userName = self.config['zoom']['displayName']
        without_login.psw = self.config['zoom']['passcode'] or ''
        without_login.isVideoOff = False
        without_login.isAudioOff = False
        # Enable direct desktop sharing (similar to isdirectsharedesktop in TypeScript SDK)
        without_login.isDirectShareDesktop = True

        result = self.meeting_service.Join(join_param)
        if result != sdk.SDKError.SDKERR_SUCCESS:
            raise Exception(f'Failed to join meeting: {result}')

        print('[ZoomService] Meeting join initiated')

    async def start_screen_share(self) -> None:
        """Start screen sharing"""
        if not self.is_in_meeting or not self.share_ctrl:
            return

        if self.is_sharing:
            return

        # Start sharing primary monitor (pass None/nullptr for primary)
        result = self.share_ctrl.StartMonitorShare(None)
        if result != sdk.SDKError.SDKERR_SUCCESS:
            print(f'[ZoomService] Failed to start screen share: {result}')
        else:
            print('[ZoomService] Screen share started')

    def _hide_zoom_meeting_window(self) -> None:
        """Hide Zoom meeting window using SDK API if it appears"""
        try:
            # Try to get the meeting UI controller to access the window handle
            # This is a fallback - DisableShowJoinMeetingWnd should prevent it from appearing
            if self.meeting_service and hasattr(self.meeting_service, 'GetUIController'):
                ui_ctrl = self.meeting_service.GetUIController()
                if ui_ctrl and hasattr(ui_ctrl, 'GetMeetingUIWnd'):
                    import ctypes
                    from ctypes import wintypes

                    hFirstView = wintypes.HWND()
                    hSecondView = wintypes.HWND()

                    result = ui_ctrl.GetMeetingUIWnd(hFirstView, hSecondView)
                    if result == sdk.SDKError.SDKERR_SUCCESS:
                        user32 = ctypes.windll.user32
                        SW_HIDE = 0

                        # Hide both views if they exist
                        if hFirstView.value:
                            user32.ShowWindow(hFirstView.value, SW_HIDE)
                            print('[ZoomService] Hid Zoom meeting window (first view)')
                        if hSecondView.value:
                            user32.ShowWindow(hSecondView.value, SW_HIDE)
                            print('[ZoomService] Hid Zoom meeting window (second view)')
        except Exception as e:
            # Silently ignore - window hiding is optional, DisableShowJoinMeetingWnd should prevent it
            pass

    async def _hide_zoom_meeting_window_delayed(self) -> None:
        """Hide Zoom meeting window after a delay (fallback)"""
        # Try a couple times as window might appear with delay
        # But DisableShowJoinMeetingWnd should prevent it from appearing
        for delay in [0.5, 1.0]:
            await asyncio.sleep(delay)
            self._hide_zoom_meeting_window()

    async def _start_screen_share_delayed(self) -> None:
        """Start screen share with delay"""
        await asyncio.sleep(1.0)
        if not self.is_sharing:
            await self.start_screen_share()

    async def leave_meeting(self) -> None:
        """Leave meeting"""
        if not self.meeting_service:
            return

        self.meeting_service.Leave(sdk.LeaveMeetingCmd.LEAVE_MEETING)
        self.is_in_meeting = False
        self.is_sharing = False

    async def _initialize_mock(self) -> None:
        """Initialize mock mode"""
        self.is_initialized = True
        self.is_authenticated = True
        self.current_status = 'Mock mode'
        self.emit('initialized')

    async def _start_meeting_mock(self) -> None:
        """Start meeting in mock mode"""
        await asyncio.sleep(1)
        self.is_in_meeting = True
        self.current_status = 'In meeting (mock)'
        self.emit('meetingJoined')
