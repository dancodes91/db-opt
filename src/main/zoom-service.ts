/**
 * Zoom Kiosk - Zoom Service
 * 
 * Orchestrates the Zoom Meeting SDK operations using the official Zoom Electron SDK.
 * Handles:
 * - SDK initialization and authentication
 * - Meeting start/join
 * - Screen sharing with audio
 * - Remote control management
 */

import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import * as path from 'path';
import { KioskConfig } from './config';

// SDK path - points to the extracted Zoom Electron SDK
const SDK_PATH = path.join(__dirname, '../../sdk/zoom-sdk-electron-6.7.2.72402');

// These will be loaded dynamically from the Zoom SDK
let ZoomSDK: any = null;
let ZoomSDKError: any = null;
let ZoomMeetingStatus: any = null;
let ZoomAuthResult: any = null;
let AudioShareMode: any = null;

/**
 * Clear SDK module cache (for reinitialization)
 */
function clearSDKCache(): void {
  try {
    const modulePaths = [
      path.join(SDK_PATH, 'lib/settings.js'),
      path.join(SDK_PATH, 'lib/zoom_sdk.js'),
      path.join(SDK_PATH, 'lib/zoom_auth.js'),
      path.join(SDK_PATH, 'lib/zoom_meeting.js'),
    ];
    
    // Clear from require cache
    for (const modulePath of modulePaths) {
      const resolvedPath = require.resolve(modulePath);
      if (require.cache[resolvedPath]) {
        delete require.cache[resolvedPath];
        console.log('[ZoomService] Cleared cache for:', modulePath);
      }
    }
  } catch (error) {
    // Ignore errors - modules might not be cached yet
    console.log('[ZoomService] Could not clear SDK cache (this is OK on first load):', error);
  }
}

/**
 * Load the Zoom SDK modules
 */
function loadZoomSDK(forceReload: boolean = false): boolean {
  try {
    // Clear cache if forcing reload (for reinitialization)
    if (forceReload) {
      console.log('[ZoomService] Force reloading SDK modules...');
      clearSDKCache();
    }
    
    // Load settings first for constants
    const settings = require(path.join(SDK_PATH, 'lib/settings.js'));
    ZoomSDKError = settings.ZoomSDKError;
    ZoomMeetingStatus = settings.ZoomMeetingStatus;
    ZoomAuthResult = settings.ZoomAuthResult;
    AudioShareMode = settings.AudioShareMode;

    // Pre-load native modules to ensure they're available
    // The SDK's zoom_sdk.js will try to load these using relative paths
    const platform = process.platform;
    const arch = process.arch;
    let nativeSdkPath: string;
    
    if (platform === 'win32') {
      if (arch === 'x64') {
        nativeSdkPath = path.join(SDK_PATH, 'sdk', 'win64');
      } else {
        nativeSdkPath = path.join(SDK_PATH, 'sdk', 'win32');
      }
    } else if (platform === 'darwin') {
      nativeSdkPath = path.join(SDK_PATH, 'sdk', 'mac');
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    // Try to pre-load native modules to catch loading errors early
    try {
      const napiUtilPath = path.join(nativeSdkPath, 'zoomsdk_napi_util.node');
      const sdkNodePath = path.join(nativeSdkPath, 'zoomsdk.node');
      
      console.log('[ZoomService] Pre-loading native modules...');
      console.log('[ZoomService] NAPI util:', napiUtilPath);
      console.log('[ZoomService] SDK node:', sdkNodePath);
      console.log('[ZoomService] Files exist:', {
        napiUtil: require('fs').existsSync(napiUtilPath),
        sdkNode: require('fs').existsSync(sdkNodePath),
        sdkDll: require('fs').existsSync(path.join(nativeSdkPath, 'sdk.dll'))
      });
      
      require(napiUtilPath);
      const sdkModule = require(sdkNodePath);
      console.log('[ZoomService] Native modules pre-loaded successfully');
      console.log('[ZoomService] SDK module exports:', Object.keys(sdkModule));
    } catch (nativeError) {
      console.error('[ZoomService] Failed to pre-load native modules:');
      console.error('[ZoomService] Error type:', nativeError?.constructor?.name);
      console.error('[ZoomService] Error message:', nativeError instanceof Error ? nativeError.message : String(nativeError));
      console.error('[ZoomService] Error stack:', nativeError instanceof Error ? nativeError.stack : 'No stack trace');
      // Continue anyway - the SDK might still work
    }

    // Load main SDK (it will also try to load native modules)
    // If forceReload, clear cache first to get fresh instance
    if (forceReload) {
      const zoomSdkModulePath = require.resolve(path.join(SDK_PATH, 'lib/zoom_sdk.js'));
      if (require.cache[zoomSdkModulePath]) {
        delete require.cache[zoomSdkModulePath];
        console.log('[ZoomService] Cleared zoom_sdk.js from cache');
      }
    }
    
    const zoomSdkModule = require(path.join(SDK_PATH, 'lib/zoom_sdk.js'));
    ZoomSDK = zoomSdkModule.ZoomSDK;

    console.log('[ZoomService] SDK modules loaded successfully');
    return true;
  } catch (error) {
    console.error('[ZoomService] Failed to load SDK:', error);
    if (error instanceof Error) {
      console.error('[ZoomService] Error details:', error.message);
      console.error('[ZoomService] Stack:', error.stack);
    }
    return false;
  }
}

/**
 * Zoom Service class - manages all Zoom SDK interactions
 */
export class ZoomService extends EventEmitter {
  private config: KioskConfig;
  private zoomSdk: any = null;
  private zoomAuth: any = null;
  private zoomMeeting: any = null;
  private zoomShare: any = null;
  private zoomMeetingConfig: any = null;
  private zoomParticipantsCtrl: any = null;
  private isInitialized: boolean = false;
  private isAuthenticated: boolean = false;
  private isInMeeting: boolean = false;
  private isSharing: boolean = false;
  private currentStatus: string = 'Not initialized';
  private useMockMode: boolean = false;
  private authTimeoutId: NodeJS.Timeout | null = null;

  constructor(config: KioskConfig) {
    super();
    this.config = config;
  }

  /**
   * Normalize participant list item to numeric user ID.
   * SDK may return array of numbers or array of objects like [{ userid: 16783360 }].
   */
  private toParticipantIds(list: any): number[] {
    if (!list || !Array.isArray(list)) return [];
    return list.map((item: any) => {
      if (typeof item === 'number') return item;
      if (item != null && typeof (item as any).userid !== 'undefined') return Number((item as any).userid);
      return null;
    }).filter((id: number | null): id is number => id != null && !isNaN(id));
  }

  /**
   * Return count of other participants (excluding self). Uses GetUserInfoByUserID(isMySelf).
   */
  getOtherParticipantCount(): number {
    if (!this.zoomParticipantsCtrl || !this.isInMeeting) return 0;
    try {
      const raw = this.zoomParticipantsCtrl.GetParticipantsList();
      const ids = this.toParticipantIds(raw);
      return ids.filter((userId: number) => {
        try {
          const info = this.zoomParticipantsCtrl.GetUserInfoByUserID(userId);
          return info && (info as any).isMySelf === false;
        } catch {
          return false;
        }
      }).length;
    } catch {
      return 0;
    }
  }

  /**
   * Initialize the Zoom SDK
   */
  async initialize(forceReload: boolean = false): Promise<void> {
    try {
      // Try to load the SDK (force reload if reinitializing)
      if (!loadZoomSDK(forceReload)) {
        console.warn('[ZoomService] SDK not available, using mock mode');
        this.useMockMode = true;
        await this.initializeMock();
        return;
      }

      // Determine the native SDK path based on platform and architecture
      const platform = process.platform;
      const arch = process.arch;
      let nativeSdkPath: string;
      
      if (platform === 'win32') {
        if (arch === 'x64') {
          nativeSdkPath = path.join(SDK_PATH, 'sdk', 'win64');
        } else {
          nativeSdkPath = path.join(SDK_PATH, 'sdk', 'win32');
        }
      } else if (platform === 'darwin') {
        nativeSdkPath = path.join(SDK_PATH, 'sdk', 'mac');
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }

      console.log('[ZoomService] Using SDK path:', nativeSdkPath);

      // Get SDK instance (path parameter is not used by getInstance, but we pass it anyway)
      this.zoomSdk = ZoomSDK.getInstance({
        path: nativeSdkPath,
      });

      if (!this.zoomSdk) {
        throw new Error('Failed to get SDK instance - native modules may not be loaded');
      }

      // Initialize SDK
      // Note: The SDK demo doesn't pass 'path' - it's auto-detected from where native modules are loaded
      // Try without path first, then with path if that fails
      console.log('[ZoomService] Initializing SDK (trying without explicit path first)...');
      let initResult = this.zoomSdk.InitSDK({
        domain: 'https://zoom.us',
        enable_log: true,
        useCustomUI: false,  // Keep Zoom UI but we'll disable dialogs
      });
      
      // If that fails, try with explicit path
      if (initResult !== ZoomSDKError.SDKERR_SUCCESS) {
        console.log('[ZoomService] InitSDK failed without path, trying with explicit path:', nativeSdkPath);
        initResult = this.zoomSdk.InitSDK({
          path: nativeSdkPath,
          domain: 'https://zoom.us',
          enable_log: true,
          useCustomUI: false,  // Keep Zoom UI but we'll disable dialogs
        });
      }
      
      // If still failing, try with relative path from lib/
      if (initResult !== ZoomSDKError.SDKERR_SUCCESS) {
        const relativePath = platform === 'win32' ? (arch === 'x64' ? 'sdk/win64' : 'sdk/win32') : 'sdk/mac';
        console.log('[ZoomService] InitSDK failed with absolute path, trying relative path:', relativePath);
        initResult = this.zoomSdk.InitSDK({
          path: relativePath,
          domain: 'https://zoom.us',
          enable_log: true,
          useCustomUI: false,  // Keep Zoom UI but we'll disable dialogs
        });
      }

      if (initResult !== ZoomSDKError.SDKERR_SUCCESS) {
        const errorName = Object.keys(ZoomSDKError).find(key => ZoomSDKError[key] === initResult) || 'UNKNOWN';
        throw new Error(`SDK initialization failed with error code: ${initResult} (${errorName})`);
      }

      console.log('[ZoomService] SDK initialized, version:', this.zoomSdk.GetZoomSDKVersion());

      // Wait a bit after InitSDK to ensure SDK is fully ready
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get auth service and set callback
      this.zoomAuth = this.zoomSdk.GetAuth({
        authcb: (result: number) => this.onAuthResult(result),
        onZoomIdentityExpired: () => this.onIdentityExpired(),
      });

      if (!this.zoomAuth) {
        throw new Error('Failed to get auth service');
      }

      // Set up timeout for auth callback (in case it doesn't fire)
      const authTimeout = setTimeout(() => {
        if (!this.isAuthenticated) {
          console.error('[ZoomService] Auth callback timeout - auth callback did not fire within 10 seconds');
          this.emit('error', 'Authentication timeout - SDK may not be ready for reconnection');
        }
      }, 10000);

      // Store timeout ID to clear it when auth succeeds
      this.authTimeoutId = authTimeout;

      // Authenticate with JWT
      const jwt = this.generateJWT();
      console.log('[ZoomService] Calling AuthWithJwtToken...');
      const authResult = this.zoomAuth.AuthWithJwtToken(jwt);

      if (authResult !== ZoomSDKError.SDKERR_SUCCESS) {
        clearTimeout(authTimeout);
        throw new Error(`SDK authentication failed with error code: ${authResult}`);
      }

      // Auth is async, will complete in callback
      this.currentStatus = 'Authenticating...';
      console.log('[ZoomService] AuthWithJwtToken called successfully, waiting for callback...');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ZoomService] Initialization error:', errorMessage);
      
      // Fall back to mock mode
      console.warn('[ZoomService] Falling back to mock mode');
      this.useMockMode = true;
      await this.initializeMock();
    }
  }

  /**
   * Handle authentication result callback
   */
  private onAuthResult(result: number): void {
    console.log('[ZoomService] Auth result:', result);

    // Clear auth timeout if it exists
    if (this.authTimeoutId) {
      clearTimeout(this.authTimeoutId);
      this.authTimeoutId = null;
    }

    if (result === ZoomAuthResult.AUTHRET_SUCCESS) {
      this.isAuthenticated = true;
      this.isInitialized = true;
      this.currentStatus = 'Authenticated';

      // Get meeting service
      this.zoomMeeting = this.zoomSdk.GetMeeting({
        meetingstatuscb: (status: number, result: number) => this.onMeetingStatusChanged(status, result),
      });

      if (this.zoomMeeting) {
        // Get sub-controllers
        this.zoomShare = this.zoomMeeting.GetMeetingShare({
          onSharingStatus: (shareInfo: any) => this.onSharingStatusChanged(shareInfo),
        });

        // Get meeting configuration with passcode handler
        this.zoomMeetingConfig = this.zoomMeeting.GetMeetingConfiguration({
          onInputMeetingPasswordAndScreenNameNotification: () => {
            // Auto-provide passcode when prompted (empty string if no passcode)
            console.log('[ZoomService] Meeting requires passcode/screen name, providing automatically...');
            if (this.zoomMeetingConfig) {
              const result = this.zoomMeetingConfig.MeetingConfig_InputMeetingPasswordAndScreenName({
                meeting_Password: this.config.zoom.passcode || '',
                screenName: this.config.zoom.displayName
              });
              // Note: This function returns Boolean (true = success, false = error)
              if (result === true) {
                console.log('[ZoomService] Passcode provided successfully');
              } else {
                console.warn('[ZoomService] Failed to provide passcode - returned false');
              }
            }
          }
        });

        // Disable all dialogs BEFORE joining meeting
        if (this.zoomMeetingConfig) {
          try {
            // Disable password dialog - we'll handle it via callback
            this.zoomMeetingConfig.MeetingConfig_EnableInputMeetingPasswordDlg({
              bEnable: false
            });
            console.log('[ZoomService] Password dialog disabled, using programmatic handling');
            
            // Disable join audio dialog - auto-join with configured audio/video settings
            this.zoomMeetingConfig.MeetingConfig_EnableAutoHideJoinAudioDialog({
              bEnable: true  // Hide the dialog, auto-join with settings from JoinMeetingWithoutLogin
            });
            console.log('[ZoomService] Join audio dialog disabled, auto-joining with audio and video enabled');
            
            // Disable waiting for host dialog - hide "Host has joined" notification
            this.zoomMeetingConfig.MeetingConfig_DisableWaitingForHostDialog({
              bDisable: true  // Hide the "Host has joined" dialog
            });
            console.log('[ZoomService] Waiting for host dialog disabled');
            
            // Disable remote control dialogs (already done but ensure it's set)
            this.zoomMeetingConfig.MeetingConfig_EnableApproveRemoteControlDlg({
              bEnable: false  // Disable remote control approval dialog
            });
            this.zoomMeetingConfig.MeetingConfig_EnableDeclineRemoteControlResponseDlg({
              bEnable: false  // Disable remote control decline dialog
            });
            console.log('[ZoomService] Remote control dialogs disabled');
          } catch (e) {
            console.warn('[ZoomService] Could not disable dialogs:', e);
          }
        }

        // Get participants controller to detect when someone joins
        this.zoomParticipantsCtrl = this.zoomMeeting.GetMeetingParticipantsCtrl({
          meetinguserjoincb: (lstUserID: any, strUserList: string[]) => {
            const ids = this.toParticipantIds(lstUserID);
            console.log('[ZoomService] meetinguserjoincb lstUserID=', JSON.stringify(lstUserID), 'parsed ids=', ids);
            try {
              const selfInfo = this.zoomParticipantsCtrl.GetUserInfoByUserID(0);
              const selfSummary = selfInfo && typeof (selfInfo as any).userID !== 'undefined'
                ? { userID: (selfInfo as any).userID, userName: (selfInfo as any).userName, isMySelf: (selfInfo as any).isMySelf }
                : selfInfo;
              console.log('[ZoomService] meetinguserjoincb self (userID=0):', JSON.stringify(selfSummary, null, 2));
              if (ids.length > 0) {
                for (const id of ids) {
                  const info = this.zoomParticipantsCtrl.GetUserInfoByUserID(id);
                  const summary = info && typeof (info as any).userID !== 'undefined'
                    ? {
                        userID: (info as any).userID,
                        userName: (info as any).userName,
                        isMySelf: (info as any).isMySelf,
                        isHost: (info as any).isHost,
                        userRole: (info as any).userRole,
                      }
                    : info;
                  console.log('[ZoomService] meetinguserjoincb participant id=' + id + ':', JSON.stringify(summary, null, 2));
                }
              }
            } catch (e) {
              console.warn('[ZoomService] meetinguserjoincb log error:', e);
            }
            // When another user joined: emit so preferences can apply; start share only if not already sharing
            if (this.isInMeeting && ids.length > 0) {
              try {
                const othersByIsMySelf = ids.filter((id: number) => {
                  try {
                    const info = this.zoomParticipantsCtrl.GetUserInfoByUserID(id);
                    return info && (info as any).isMySelf === false;
                  } catch {
                    return false;
                  }
                });
                const myInfo = this.zoomParticipantsCtrl.GetUserInfoByUserID(0);
                const myUserID = myInfo && typeof (myInfo as any).userID !== 'undefined' ? (myInfo as any).userID : null;
                console.log('[ZoomService] meetinguserjoincb myUserID=', myUserID, 'othersByIsMySelf(count)=', othersByIsMySelf.length, 'ids=', othersByIsMySelf);
                if (othersByIsMySelf.length > 0) {
                  this.emit('otherParticipantPresent');
                  if (!this.isSharing) {
                    console.log('[ZoomService] Other participant detected, starting screen share...');
                    this.startScreenShare().catch(err => {
                      console.error('[ZoomService] Failed to start screen share after participant joined:', err);
                    });
                  }
                }
              } catch (e) {
                console.warn('[ZoomService] Could not resolve self for join callback:', e);
              }
            }
          },
          meetinguserleftcb: (lstUserID: number[], strUserList: string[]) => {
            console.log('[ZoomService] Participant left:', strUserList);
          }
        });
      }

      this.emit('initialized');
    } else {
      this.currentStatus = `Authentication failed: ${result}`;
      this.emit('error', `Authentication failed with code: ${result}`);
    }
  }

  /**
   * Handle identity expired
   */
  private onIdentityExpired(): void {
    console.warn('[ZoomService] Identity expired, need to re-authenticate');
    this.emit('error', 'Zoom identity expired');
  }

  /**
   * Handle meeting status changes
   */
  private onMeetingStatusChanged(status: number, result: number): void {
    console.log('[ZoomService] Meeting status:', status, 'result:', result);

    switch (status) {
      case ZoomMeetingStatus.MEETING_STATUS_CONNECTING:
        this.currentStatus = 'Connecting to meeting...';
        break;
      case ZoomMeetingStatus.MEETING_STATUS_WAITINGFORHOST:
        this.currentStatus = 'Waiting for host...';
        break;
      case ZoomMeetingStatus.MEETING_STATUS_INMEETING:
        this.isInMeeting = true;
        this.currentStatus = 'In meeting';
        this.emit('meetingJoined');
        
        // Close any Zoom notification dialogs that might appear
        this.closeZoomNotificationDialogs();
        
        // Start sharing only if there is at least one other participant (exclude self)
        if (this.zoomParticipantsCtrl) {
          try {
            const rawList = this.zoomParticipantsCtrl.GetParticipantsList();
            const ids = this.toParticipantIds(rawList);
            const otherCount = ids.filter((userId: number) => {
              try {
                const info = this.zoomParticipantsCtrl.GetUserInfoByUserID(userId);
                return info && (info as any).isMySelf === false;
              } catch {
                return false;
              }
            }).length;
            console.log('[ZoomService] MEETING_STATUS_INMEETING participant ids=', ids, 'otherCount=', otherCount);
            if (otherCount > 0) {
              console.log('[ZoomService] Other participants already in meeting, starting screen share...');
              this.emit('otherParticipantPresent');
              setTimeout(() => {
                if (!this.isSharing) {
                  this.startScreenShare().catch(err => {
                    console.error('[ZoomService] Failed to start screen share:', err);
                  });
                }
              }, 1000);
            }
          } catch (e) {
            console.warn('[ZoomService] Could not check participants list:', e);
          }
        }
        break;
      case ZoomMeetingStatus.MEETING_STATUS_DISCONNECTING:
        this.currentStatus = 'Disconnecting...';
        // If we were in meeting, mark as disconnected
        if (this.isInMeeting) {
          this.isInMeeting = false;
          this.isSharing = false;
        }
        break;
      case ZoomMeetingStatus.MEETING_STATUS_RECONNECTING:
        this.currentStatus = 'Reconnecting...';
        break;
      case ZoomMeetingStatus.MEETING_STATUS_IN_WAITING_ROOM:
        this.currentStatus = 'In waiting room...';
        // Don't set isInMeeting yet - we're still waiting
        console.log('[ZoomService] In waiting room - if dialog is closed, meeting will end');
        break;
      case ZoomMeetingStatus.MEETING_STATUS_ENDED:
      case ZoomMeetingStatus.MEETING_STATUS_FAILED:
        // Always emit disconnected event, even if we never successfully joined
        // This handles cases where the user closes waiting room dialog or meeting fails to start
        if (this.isInMeeting) {
          this.isInMeeting = false;
          this.isSharing = false;
        }
        this.currentStatus = 'Disconnected';
        const statusName = status === ZoomMeetingStatus.MEETING_STATUS_ENDED ? 'ended' : 'failed';
        console.log(`[ZoomService] Meeting ${statusName} - emitting disconnected event`);
        this.emit('disconnected', `Meeting ${statusName} with status: ${status}`);
        break;
      case ZoomMeetingStatus.MEETING_STATUS_IDLE:
        // IDLE status - meeting never started or was cancelled
        if (this.isInMeeting) {
          this.isInMeeting = false;
          this.isSharing = false;
          this.emit('disconnected', `Meeting idle/cancelled`);
        }
        this.currentStatus = 'Disconnected';
        break;
    }
  }

  /**
   * Handle sharing status changes
   */
  private onSharingStatusChanged(shareInfo: any): void {
    console.log('[ZoomService] Share status:', shareInfo);

    // Check if we are the one sharing
    if (shareInfo.status === 1) { // Sharing started
      this.isSharing = true;
      this.currentStatus = 'Screen sharing active';
      this.emit('sharingStarted');
    } else if (shareInfo.status === 0 || shareInfo.status === 3) { // Stopped
      if (this.isSharing && this.isInMeeting) {
        this.emit('sharingStopped');
      }
      this.isSharing = false;
    }
  }

  /**
   * Generate JWT for SDK authentication
   */
  private generateJWT(): string {
    const { sdkKey, sdkSecret } = this.config.zoom;

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24; // 24 hours

    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      appKey: sdkKey,
      sdkKey: sdkKey,
      mn: this.config.zoom.pmi,
      role: 1, // Host role
      iat: iat,
      exp: exp,
      tokenExp: exp
    };

    const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');

    const signature = crypto
      .createHmac('sha256', sdkSecret)
      .update(`${base64Header}.${base64Payload}`)
      .digest('base64url');

    return `${base64Header}.${base64Payload}.${signature}`;
  }

  /**
   * Start/host a meeting with PMI
   */
  async startMeeting(): Promise<void> {
    if (this.useMockMode) {
      await this.startMeetingMock();
      return;
    }

    if (!this.isInitialized || !this.zoomMeeting) {
      throw new Error('SDK not initialized');
    }

    this.currentStatus = 'Starting meeting...';

    // Use JoinMeetingWithoutLogin since we're using JWT auth
    const result = this.zoomMeeting.JoinMeetingWithoutLogin({
      meetingnum: parseInt(this.config.zoom.pmi.replace(/\D/g, '')),
      username: this.config.zoom.displayName,
      psw: this.config.zoom.passcode || '',
      isdirectsharedesktop: true, // We'll share automatically
      isvideooff: false,  // Enable video
      isaudiooff: false,  // Enable audio
    });

    if (result !== ZoomSDKError.SDKERR_SUCCESS) {
      throw new Error(`Failed to start meeting, error code: ${result}`);
    }
  }

  /**
   * Start screen sharing with configured options
   */
  async startScreenShare(): Promise<void> {
    if (this.useMockMode) {
      await this.startScreenShareMock();
      return;
    }

    if (!this.zoomShare || !this.isInMeeting) {
      throw new Error('Not in meeting or share controller not available');
    }

    this.currentStatus = 'Starting screen share...';

    // Set audio share mode (stereo if configured)
    if (this.config.screen.stereoAudio && AudioShareMode) {
      this.zoomShare.MeetingShare_SetAudioShareMode({
        mode: AudioShareMode.AudioShareMode_Stereo || 1
      });
    }

    // Start monitor share (null = primary monitor)
    const monitorId = this.config.screen.monitorIndex === 0 ? null : 
      `\\\\?\\DISPLAY${this.config.screen.monitorIndex + 1}`;

    const result = this.zoomShare.MeetingShare_StartMonitorShare({
      zn_monitorID: monitorId
    });

    if (result !== ZoomSDKError.SDKERR_SUCCESS) {
      throw new Error(`Failed to start screen share, error code: ${result}`);
    }
  }

  /**
   * Enable remote control features
   */
  async enableRemoteControl(): Promise<void> {
    if (this.useMockMode) {
      await this.enableRemoteControlMock();
      return;
    }

    if (!this.isSharing) {
      throw new Error('Not sharing');
    }

    this.currentStatus = 'Enabling remote control...';

    // Configure remote control settings
    if (this.zoomMeetingConfig) {
      try {
        // Disable the approval dialog for remote control (auto-accept)
        // When false, remote control requests are handled via callback events
        if (typeof this.zoomMeetingConfig.MeetingConfig_EnableApproveRemoteControlDlg === 'function') {
          const result = this.zoomMeetingConfig.MeetingConfig_EnableApproveRemoteControlDlg({
            bEnable: false  // Disable dialog = auto-accept
          });
          if (result !== ZoomSDKError.SDKERR_SUCCESS) {
            console.warn('[ZoomService] Failed to disable remote control dialog:', result);
          }
        }
        
        // Also disable the decline response dialog
        if (typeof this.zoomMeetingConfig.MeetingConfig_EnableDeclineRemoteControlResponseDlg === 'function') {
          this.zoomMeetingConfig.MeetingConfig_EnableDeclineRemoteControlResponseDlg({
            bEnable: false
          });
        }
      } catch (e) {
        console.warn('[ZoomService] Could not configure remote control:', e);
      }
    }

    this.currentStatus = 'Ready - Remote control enabled';
    this.emit('remoteControlEnabled');
  }

  /**
   * Close Zoom notification dialogs using Windows APIs
   * Uses PowerShell to find and close Zoom notification windows
   */
  private closeZoomNotificationDialogs(): void {
    if (process.platform !== 'win32') {
      return; // Only works on Windows
    }

    try {
      const { exec } = require('child_process');
      
      // Function to close dialogs with specific title patterns
      const closeDialogs = () => {
        // Try to close windows with notification-like titles
        const command = `Get-Process | Where-Object { $_.MainWindowTitle -ne '' -and ($_.MainWindowTitle -match 'Host has joined' -or $_.MainWindowTitle -match 'We.*ve let them know' -or $_.MainWindowTitle -match 'joined.*here') } | ForEach-Object { $_.CloseMainWindow() }`;
        exec(`powershell -Command "${command}"`, (error: any) => {
          // Silently handle - dialog might not exist
        });
      };

      // Try immediately
      closeDialogs();
      
      // Try again after delays (dialog might appear with delay)
      setTimeout(closeDialogs, 500);
      setTimeout(closeDialogs, 1500);
      setTimeout(closeDialogs, 3000);
      
      console.log('[ZoomService] Attempting to close notification dialogs...');
    } catch (e) {
      console.warn('[ZoomService] Could not close notification dialogs:', e);
    }
  }

  /**
   * Get current status
   */
  getStatus(): string {
    return this.currentStatus;
  }

  /**
   * Check if currently in a meeting
   */
  isInMeetingState(): boolean {
    return this.isInMeeting;
  }

  /**
   * Check if currently sharing
   */
  isSharingState(): boolean {
    return this.isSharing;
  }

  /**
   * Cleanup and release resources
   */
  async cleanup(): Promise<void> {
    if (this.useMockMode) {
      this.isInitialized = false;
      this.isInMeeting = false;
      this.isSharing = false;
      return;
    }

    try {
      // Remove all event listeners to prevent stale callbacks
      this.removeAllListeners();
      
      if (this.isSharing && this.zoomShare) {
        this.zoomShare.MeetingShare_StopShare();
      }
      if (this.isInMeeting && this.zoomMeeting) {
        this.zoomMeeting.LeaveMeeting({ end: false });
      }
      if (this.zoomSdk) {
        // Clear any pending auth timeout
        if (this.authTimeoutId) {
          clearTimeout(this.authTimeoutId);
          this.authTimeoutId = null;
        }
        
        // Cleanup SDK properly
        this.zoomSdk.CleanUPSDK();
        // Wait longer for cleanup to complete before reinitializing
        // SDK needs time to fully release resources
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error('[ZoomService] Cleanup error:', error);
    }

    this.isInitialized = false;
    this.isAuthenticated = false;
    this.isInMeeting = false;
    this.isSharing = false;
    this.zoomSdk = null;
    this.zoomAuth = null;
    this.zoomMeeting = null;
    this.zoomShare = null;
    this.zoomParticipantsCtrl = null;
    this.zoomMeetingConfig = null;
  }

  // ==================== MOCK MODE METHODS ====================

  /**
   * Initialize in mock mode (when SDK is not available)
   */
  private async initializeMock(): Promise<void> {
    console.log('[ZoomService] Running in MOCK MODE');
    
    await this.delay(500);
    console.log('[MOCK] SDK initialized');
    
    await this.delay(500);
    const jwt = this.generateJWT();
    console.log('[MOCK] SDK authenticated with JWT:', jwt.substring(0, 20) + '...');
    
    this.isInitialized = true;
    this.currentStatus = 'Initialized (Mock Mode)';
    this.emit('initialized');
  }

  private async startMeetingMock(): Promise<void> {
    console.log('[MOCK] Starting meeting:', this.config.zoom.pmi);
    this.currentStatus = 'Connecting to meeting...';
    
    await this.delay(1000);
    this.currentStatus = 'In meeting';
    this.isInMeeting = true;
    this.emit('meetingJoined');
  }

  private async startScreenShareMock(): Promise<void> {
    if (this.config.screen.shareComputerSound) {
      console.log('[MOCK] Share computer sound: true');
    }
    if (this.config.screen.stereoAudio) {
      console.log('[MOCK] Stereo audio: true');
    }
    console.log('[MOCK] Starting monitor share:', this.config.screen.monitorIndex);
    
    await this.delay(500);
    this.isSharing = true;
    this.currentStatus = 'Screen sharing active';
    this.emit('sharingStarted');
  }

  private async enableRemoteControlMock(): Promise<void> {
    console.log('[MOCK] Auto accept remote control: true');
    console.log('[MOCK] Disable remote control dialog: true');
    if (this.config.remoteControl.enableClipboard) {
      console.log('[MOCK] Clipboard share: true');
    }
    
    await this.delay(300);
    this.currentStatus = 'Ready - Sharing with remote control enabled';
    this.emit('remoteControlEnabled');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
