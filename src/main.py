"""
Zoom Kiosk - Main Entry Point

Console-based Python application for automated Zoom Kiosk mode.
"""

import asyncio
import sys
from typing import Optional
from pynput import keyboard
from .config import load_config, KioskConfig
from .zoom_service import ZoomService
from .recovery import RecoveryWatchdog
from .action_recorder import ActionRecorder
from .action_player import ActionPlayer

# Import Windows message loop (only on Windows)
if sys.platform == 'win32':
    from .windows_message_loop import start_message_loop, stop_message_loop
else:
    # Dummy functions for non-Windows platforms
    def start_message_loop():
        pass
    def stop_message_loop():
        pass

# Global state
zoom_service: Optional[ZoomService] = None
recovery_watchdog: Optional[RecoveryWatchdog] = None
action_recorder: Optional[ActionRecorder] = None
action_player: Optional[ActionPlayer] = None
config: Optional[KioskConfig] = None
other_participant_poll_task: Optional[asyncio.Task] = None
keyboard_listener: Optional[keyboard.Listener] = None


def print_status(message: str) -> None:
    """Print status message"""
    print(f'[Status] {message}')


async def replay_remote_control_setup() -> None:
    """Replay recorded mouse actions to apply preferences"""
    if not action_recorder or not action_player:
        return

    actions = action_recorder.load_recording()
    if not actions:
        print_status('No preferences recorded')
        return

    print_status('Applying preferences...')
    try:
        await action_player.play_actions(actions)
        print_status('Preferences applied successfully')
    except Exception as e:
        print(f'[Error] Failed to apply preferences: {e}')


async def start_meeting() -> None:
    """Start the meeting"""
    if not zoom_service:
        return

    try:
        await zoom_service.start_meeting()
    except Exception as e:
        print(f'[Error] Failed to start meeting: {e}')
        print_status(f'Error: {e}')


async def reconnect_meeting() -> None:
    """Reconnect to meeting"""
    global zoom_service

    print_status('Reconnecting...')
    if zoom_service:
        try:
            await zoom_service.leave_meeting()
            await asyncio.sleep(1)
        except Exception:
            pass

    # Reinitialize
    await initialize_zoom(force_reload=True)


async def initialize_zoom(force_reload: bool = False) -> None:
    """Initialize Zoom SDK and start meeting"""
    global zoom_service, recovery_watchdog, action_recorder, action_player, config

    if not config:
        print('[Error] Config not loaded')
        return

    try:
        print_status('Initializing Zoom SDK...')

        zoom_service = ZoomService(config)

        # Set up event handlers
        zoom_service.on('initialized', lambda: asyncio.create_task(start_meeting()))

        zoom_service.on('meetingJoined', on_meeting_joined)

        zoom_service.on('sharingStarted', on_sharing_started)

        zoom_service.on('disconnected', on_disconnected)

        zoom_service.on('error', lambda error: print_status(f'Error: {error}'))

        # Initialize SDK
        await zoom_service.initialize(force_reload)

    except Exception as e:
        print(f'[Error] Failed to initialize Zoom: {e}')
        print_status(f'Error: {e}')


def on_meeting_joined() -> None:
    """Handle meeting joined event"""
    global other_participant_poll_task

    print_status('Meeting joined, setting up remote control...')
    if recovery_watchdog:
        recovery_watchdog.on_connected()

    if not action_recorder or not action_player:
        return

    if action_recorder.has_recording():
        other_count = zoom_service.get_other_participant_count() if zoom_service else 0
        if other_count > 0:
            print_status('Applying preferences...')
            asyncio.create_task(replay_remote_control_setup())
        else:
            print_status('Waiting for another participant to apply preferences...')
            applied = False

            async def do_apply() -> None:
                nonlocal applied
                global other_participant_poll_task
                if applied:
                    return
                applied = True
                if other_participant_poll_task:
                    other_participant_poll_task.cancel()
                    other_participant_poll_task = None
                print_status('Applying preferences...')
                await replay_remote_control_setup()

            if zoom_service:
                zoom_service.once('otherParticipantPresent', lambda: asyncio.create_task(do_apply()))

            # Fallback: poll in case join callback is not fired
            async def poll_participants() -> None:
                nonlocal applied
                while not applied:
                    await asyncio.sleep(2)
                    if applied:
                        break
                    if zoom_service:
                        n = zoom_service.get_other_participant_count()
                        if n > 0:
                            await do_apply()
                            break

            other_participant_poll_task = asyncio.create_task(poll_participants())
    else:
        print('\n========================================')
        print('  KEYBOARD SHORTCUTS')
        print('========================================')
        print('  F9  - Start/Stop capturing')
        print('  F10 - Force stop capturing')
        print('')
        print('To capture preferences:')
        print('  1. Press F9 to start capturing')
        print('  2. Navigate to menu and configure settings')
        print('  3. Press F9 again to stop capturing')
        print('========================================\n')


def on_sharing_started() -> None:
    """Handle sharing started event"""
    print_status('Screen sharing active')


def on_disconnected(reason: str) -> None:
    """Handle disconnected event"""
    global other_participant_poll_task

    print(f'[Diagnostic] on_disconnected called: reason={reason}')

    if other_participant_poll_task:
        other_participant_poll_task.cancel()
        other_participant_poll_task = None

    if action_player:
        action_player.stop()

    print_status(f'Disconnected: {reason}')
    if recovery_watchdog:
        recovery_watchdog.on_disconnected()


def on_key_press(key: keyboard.Key) -> None:
    """Handle keyboard shortcuts"""
    try:
        if key == keyboard.Key.f9:
            if action_recorder:
                if action_recorder.is_recording:
                    print_status('Stopping capture...')
                    if action_recorder.stop_recording():
                        print_status('Preferences saved')
                    else:
                        print_status('Failed to save preferences')
                else:
                    print_status('Starting capture...')
                    action_recorder.start_recording()
                    print_status('Capture active - click to record preferences')

        elif key == keyboard.Key.f10:
            if action_recorder and action_recorder.is_recording:
                print_status('Force stopping capture...')
                action_recorder.stop_recording()
    except AttributeError:
        pass


def setup_keyboard_shortcuts() -> None:
    """Set up global keyboard shortcuts"""
    global keyboard_listener

    keyboard_listener = keyboard.Listener(on_press=on_key_press)
    keyboard_listener.start()
    print('[Keyboard] Shortcuts registered (F9/F10)')


def _log_exception(exc_type, exc_val, exc_tb):
    """Log unhandled exceptions for diagnostics"""
    if exc_type is not None:
        print(f'[Diagnostic] Unhandled exception: {exc_type.__name__}: {exc_val}')
        import traceback
        traceback.print_exception(exc_type, exc_val, exc_tb)


async def main() -> None:
    """Main entry point"""
    global config, recovery_watchdog, action_recorder, action_player

    # Install exception hook for diagnostics (catches main-thread exceptions)
    sys.excepthook = _log_exception

    # Log asyncio task exceptions (e.g. from callbacks that use create_task)
    def _task_exception_handler(loop, context):
        exc = context.get('exception')
        if exc:
            print(f'[Diagnostic] Async task exception: {type(exc).__name__}: {exc}')
            import traceback
            traceback.print_exception(type(exc), exc, exc.__traceback__)
        else:
            print(f'[Diagnostic] Async context: {context}')
    asyncio.get_running_loop().set_exception_handler(_task_exception_handler)

    print('Zoom Kiosk - Python Edition')
    print('=' * 40)

    # Start Windows message loop (required for SDK callbacks)
    if sys.platform == 'win32':
        start_message_loop()

    # Load configuration
    try:
        config = load_config()
        print('[Config] Configuration loaded')
    except Exception as e:
        print(f'[Error] Failed to load config: {e}')
        sys.exit(1)

    # Initialize components
    action_recorder = ActionRecorder()
    action_player = ActionPlayer()

    recovery_watchdog = RecoveryWatchdog(
        config['recovery'],
        reconnect_meeting
    )

    # Set up keyboard shortcuts
    setup_keyboard_shortcuts()

    # Start recovery watchdog
    recovery_watchdog.start()

    # Initialize Zoom
    await initialize_zoom()

    # Keep running
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        print('\n[Shutdown] Interrupted by user (Ctrl+C)')
    except SystemExit as e:
        print(f'\n[Diagnostic] SystemExit in main loop: code={e.code}')
        print('[Diagnostic] May indicate external process termination (e.g. SentinelOne, script)')
    except Exception as e:
        print(f'\n[Diagnostic] Exception in main loop: {type(e).__name__}: {e}')
        import traceback
        traceback.print_exc()
    finally:
        print('[Diagnostic] Entering cleanup (finally block)')
        await cleanup()


async def cleanup() -> None:
    """Cleanup resources"""
    global keyboard_listener, zoom_service, recovery_watchdog, other_participant_poll_task

    print('[Shutdown] Cleaning up...')

    # Cancel any pending async tasks first
    if other_participant_poll_task and not other_participant_poll_task.done():
        other_participant_poll_task.cancel()
        try:
            await other_participant_poll_task
        except asyncio.CancelledError:
            pass

    # Stop keyboard listener
    if keyboard_listener:
        keyboard_listener.stop()

    # Stop recovery watchdog
    if recovery_watchdog:
        recovery_watchdog.stop()

    # Leave meeting if in one
    if zoom_service:
        try:
            await zoom_service.leave_meeting()
        except Exception as e:
            print(f'[Shutdown] Error leaving meeting: {e}')

    # Stop Windows message loop (this cancels its task)
    if sys.platform == 'win32':
        stop_message_loop()
        # Give the message loop task time to cancel
        await asyncio.sleep(0.1)

    # Cancel all remaining tasks (except the current one)
    loop = asyncio.get_event_loop()
    current_task = asyncio.current_task(loop)
    pending_tasks = [task for task in asyncio.all_tasks(loop)
                     if not task.done() and task is not current_task]
    if pending_tasks:
        print(f'[Shutdown] Cancelling {len(pending_tasks)} pending tasks...')
        for task in pending_tasks:
            task.cancel()

        # Wait for tasks to complete cancellation
        if pending_tasks:
            try:
                await asyncio.gather(*pending_tasks, return_exceptions=True)
            except Exception:
                pass

    print('[Shutdown] Cleanup complete')
