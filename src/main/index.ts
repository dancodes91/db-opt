/**
 * Zoom Kiosk - Electron Main Process
 * 
 * Entry point for the Zoom Kiosk application.
 * Handles window management, tray icon, and orchestrates the Zoom SDK.
 */

import { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, NativeImage, globalShortcut } from 'electron';
import * as path from 'path';
import { ZoomService } from './zoom-service';
import { loadConfig, KioskConfig } from './config';
import { RecoveryWatchdog } from './recovery';
import { configureAutoStart } from './startup';
import { ActionRecorder } from './action-recorder';
import { ActionPlayer } from './action-player';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let zoomService: ZoomService | null = null;
let recoveryWatchdog: RecoveryWatchdog | null = null;
let config: KioskConfig;
let actionRecorder: ActionRecorder;
let actionPlayer: ActionPlayer;
let globalClickHook: any = null;
let otherParticipantPollInterval: NodeJS.Timeout | null = null;

/**
 * Create the main application window
 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false,
    frame: true,
    show: !config.kiosk.minimizeToTray,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.on('close', (event) => {
    if (config.kiosk.minimizeToTray && tray) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Create system tray icon with context menu
 */
function createTray(): void {
  if (!config.kiosk.showTrayIcon) return;

  // Create a simple tray icon (in production, use a proper icon file)
  const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
  
  // Create a simple colored icon if file doesn't exist
  let trayIcon: NativeImage;
  try {
    trayIcon = nativeImage.createFromPath(iconPath);
    if (trayIcon.isEmpty()) {
      // Create a simple 16x16 icon programmatically
      trayIcon = nativeImage.createEmpty();
    }
  } catch {
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);
  tray.setToolTip('Zoom Kiosk');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Status',
      click: () => {
        mainWindow?.show();
        mainWindow?.focus();
      }
    },
    {
      label: 'Reconnect',
      click: async () => {
        await reconnectMeeting();
      }
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        cleanup();
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow?.show();
    mainWindow?.focus();
  });
}

/**
 * Initialize the Zoom SDK and start the meeting
 */
async function initializeZoom(forceReload: boolean = false): Promise<void> {
  try {
    sendStatusToRenderer('Initializing Zoom SDK...');

    zoomService = new ZoomService(config);
    
    // Set up event handlers
    zoomService.on('initialized', () => {
      sendStatusToRenderer('SDK initialized, starting meeting...');
      startMeeting();
    });

    zoomService.on('meetingJoined', async () => {
      sendStatusToRenderer('Meeting joined, setting up remote control...');
      recoveryWatchdog?.onConnected();

      if (actionRecorder.hasRecording()) {
        const otherCount = zoomService?.getOtherParticipantCount() ?? 0;
        if (otherCount > 0) {
          sendStatusToRenderer('Applying preferences...');
          await replayRemoteControlSetup();
        } else {
          sendStatusToRenderer('Waiting for another participant to apply preferences...');
          let applied = false;
          const doApply = async () => {
            if (applied) return;
            applied = true;
            if (otherParticipantPollInterval) {
              clearInterval(otherParticipantPollInterval);
              otherParticipantPollInterval = null;
            }
            sendStatusToRenderer('Applying preferences...');
            await replayRemoteControlSetup();
          };
          zoomService?.once('otherParticipantPresent', doApply);
          // Fallback: poll in case join callback is not fired (e.g. after reconnect)
          if (otherParticipantPollInterval) clearInterval(otherParticipantPollInterval);
          otherParticipantPollInterval = setInterval(() => {
            if (applied) return;
            const n = zoomService?.getOtherParticipantCount() ?? 0;
            if (n > 0) doApply();
          }, 2000);
        }
      } else {
        console.log('\n========================================');
        console.log('  KEYBOARD SHORTCUTS');
        console.log('========================================');
        console.log('  F9  - Start/Stop capturing');
        console.log('  F10 - Force stop capturing');
        console.log('');
        console.log('To capture preferences:');
        console.log('  1. Press F9 to start capturing');
        console.log('  2. Navigate to menu and configure settings');
        console.log('  3. Press F9 again to stop capturing');
        console.log('========================================\n');
      }
    });

    zoomService.on('sharingStarted', () => {
      sendStatusToRenderer('Screen sharing active');
      enableRemoteControl();
    });

    zoomService.on('remoteControlEnabled', () => {
      sendStatusToRenderer('Ready - Sharing with remote control enabled');
    });

    zoomService.on('disconnected', (reason: string) => {
      if (otherParticipantPollInterval) {
        clearInterval(otherParticipantPollInterval);
        otherParticipantPollInterval = null;
      }
      actionPlayer?.stop();
      sendStatusToRenderer(`Disconnected: ${reason}`);
      recoveryWatchdog?.onDisconnected();
    });

    zoomService.on('error', (error: string) => {
      sendStatusToRenderer(`Error: ${error}`);
    });

    // Initialize the SDK (force reload if reconnecting)
    await zoomService.initialize(forceReload || false);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    sendStatusToRenderer(`Failed to initialize: ${errorMessage}`);
    console.error('Zoom initialization failed:', error);
  }
}

/**
 * Start/host the meeting with PMI
 */
async function startMeeting(): Promise<void> {
  try {
    await zoomService?.startMeeting();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    sendStatusToRenderer(`Failed to start meeting: ${errorMessage}`);
  }
}

/**
 * Start screen sharing with configured options
 */
async function startScreenShare(): Promise<void> {
  try {
    await zoomService?.startScreenShare();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    sendStatusToRenderer(`Failed to start screen share: ${errorMessage}`);
  }
}

/**
 * Enable remote control auto-accept
 */
async function enableRemoteControl(): Promise<void> {
  try {
    await zoomService?.enableRemoteControl();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    sendStatusToRenderer(`Failed to enable remote control: ${errorMessage}`);
  }
}

/**
 * Set up global click monitoring using global-mouse-events in main process
 * This is the correct way - hooks must be in main process, not renderer
 */
function setupGlobalClickHook(): void {
  if (process.platform !== 'win32') {
    return;
  }

  let mouseEvents: any = null;
  let isListening = false;

  try {
    mouseEvents = require('global-mouse-events');
  } catch (error) {
    return;
  }

  // IPC handler to start click monitoring
  ipcMain.on('start-click-monitoring', () => {
    if (isListening || !mouseEvents) {
      return;
    }

    isListening = true;

    // Set up click event listener
    // global-mouse-events uses 'mousedown' event (not 'mouseleftdown')
    const mousedownHandler = (e: any) => {
      if (!actionRecorder || !actionRecorder.getStatus().isRecording) {
        return;
      }

      // Map button numbers to button names
      // Button values may vary - try common mappings
      let button: 'left' | 'right' | 'middle' = 'left';
      if (e.button === 1 || e.button === 0 || e.button === 'left') {
        button = 'left';
      } else if (e.button === 2 || e.button === 'right') {
        button = 'right';
      } else if (e.button === 3 || e.button === 4 || e.button === 'middle') {
        button = 'middle';
      }

      actionRecorder.recordClick(e.x, e.y, button, 'click');
    };

    mouseEvents.on('mousedown', mousedownHandler);

    // Also listen for mouseup to detect double-clicks (optional)
    let lastClickTime = 0;
    let lastClickPos = { x: 0, y: 0 };
    
    const mouseupHandler = (e: any) => {
      if (!actionRecorder || !actionRecorder.getStatus().isRecording) {
        return;
      }

      const now = Date.now();
      const timeSinceLastClick = now - lastClickTime;
      const distSinceLastClick = Math.sqrt(
        Math.pow(e.x - lastClickPos.x, 2) + Math.pow(e.y - lastClickPos.y, 2)
      );

      // Detect double-click: same position, within 500ms
      if (timeSinceLastClick < 500 && distSinceLastClick < 5 && lastClickTime > 0) {
        actionRecorder.recordClick(e.x, e.y, 'left', 'doubleclick');
        lastClickTime = 0;
      } else {
        lastClickTime = now;
        lastClickPos = { x: e.x, y: e.y };
      }
    };

    mouseEvents.on('mouseup', mouseupHandler);

    // Store handlers for cleanup
    (globalClickHook as any) = {
      mousedown: mousedownHandler,
      mouseup: mouseupHandler,
      stop: () => {
        if (mouseEvents) {
          mouseEvents.removeListener('mousedown', mousedownHandler);
          mouseEvents.removeListener('mouseup', mouseupHandler);
        }
      }
    };

  });

  // IPC handler to stop click monitoring
  ipcMain.on('stop-click-monitoring', () => {
    isListening = false;
    
    if (globalClickHook && typeof globalClickHook.stop === 'function') {
      globalClickHook.stop();
    } else if (mouseEvents) {
      mouseEvents.removeAllListeners('mousedown');
      mouseEvents.removeAllListeners('mouseup');
    }
  });
}

/**
 * Set up global keyboard shortcuts for input capture
 */
function setupRecordingShortcuts(): void {
  // F9 to toggle capturing (start/stop)
  const retF9 = globalShortcut.register('F9', () => {
    const status = actionRecorder.getStatus();
    if (status.isRecording) {
      ipcMain.emit('stop-click-monitoring');
      const saved = actionRecorder.stopRecording();
      if (saved) {
        sendStatusToRenderer('Preferences saved - will apply automatically on next join');
      } else {
        sendStatusToRenderer('Failed to save preferences');
      }
    } else {
      actionRecorder.startRecording();
      ipcMain.emit('start-click-monitoring');
      sendStatusToRenderer('Capturing started - Press F9 to stop');
    }
  });

  if (!retF9) {
    console.warn('[Main] Failed to register F9 shortcut');
  }

  // F10 to force stop capturing
  const retF10 = globalShortcut.register('F10', () => {
    if (actionRecorder.getStatus().isRecording) {
      const saved = actionRecorder.stopRecording();
      if (saved) {
        sendStatusToRenderer('Capturing stopped');
      }
    }
  });

  if (!retF10) {
    // Ignore
  }
}

/**
 * Apply user preferences
 */
async function replayRemoteControlSetup(): Promise<void> {
  try {
    if (!actionPlayer) {
      sendStatusToRenderer('Preferences unavailable - input handler needs to be rebuilt');
      return;
    }

    const actions = actionRecorder.loadRecording();
    if (!actions || actions.length === 0) {
      return;
    }

    sendStatusToRenderer(`Applying ${actions.length} preferences...`);
    
    // Wait for the meeting UI to be ready
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await actionPlayer.playActions(actions);
    
    sendStatusToRenderer('Preferences applied');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    sendStatusToRenderer(`Failed to apply preferences: ${errorMsg}`);
    
    if (errorMsg.includes('NODE_MODULE_VERSION') || errorMsg.includes('rebuild')) {
      // Silent error handling
    }
  }
}

/**
 * Reconnect to the meeting (used for recovery)
 */
async function reconnectMeeting(): Promise<void> {
  sendStatusToRenderer('Reconnecting...');
  
  try {
    await zoomService?.cleanup();
    // Wait a bit longer before reinitializing to ensure SDK is fully cleaned up
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Force reload SDK modules by passing true
    await initializeZoom(true);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    sendStatusToRenderer(`Reconnection failed: ${errorMessage}`);
  }
}

/**
 * Send status message to renderer process
 */
function sendStatusToRenderer(status: string): void {
  console.log(`[Status] ${status}`);
  mainWindow?.webContents.send('status-update', status);
}

/**
 * Cleanup resources before exit
 */
async function cleanup(): Promise<void> {
  // Unregister global shortcuts
  globalShortcut.unregisterAll();
  
  recoveryWatchdog?.stop();
  await zoomService?.cleanup();
  tray?.destroy();
  
  // Clean up global click hook
  if (globalClickHook) {
    try {
      globalClickHook.removeAllListeners();
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Set up IPC handlers for renderer communication
 */
function setupIPC(): void {
  ipcMain.handle('get-status', () => {
    return zoomService?.getStatus() ?? 'Not initialized';
  });

  ipcMain.handle('get-config', () => {
    return {
      displayName: config.zoom.displayName,
      pmi: config.zoom.pmi,
      monitorIndex: config.screen.monitorIndex
    };
  });

  ipcMain.handle('reconnect', async () => {
    await reconnectMeeting();
  });
}

/**
 * Application startup
 */
app.whenReady().then(async () => {
  try {
    // Load configuration
    config = loadConfig();
    console.log('Configuration loaded:', config.zoom.displayName);

    // Set up IPC handlers
    setupIPC();

    // Initialize input handlers
    actionRecorder = new ActionRecorder();
    try {
      actionPlayer = new ActionPlayer();
    } catch (error) {
      // Input handler unavailable - will fail gracefully when trying to use it
      // Create a dummy instance that will throw a helpful error when used
      actionPlayer = {
        playActions: async () => {
          throw new Error('Input handler module not available. Please rebuild native modules using: npm run rebuild:native');
        },
        stop: () => {},
        isCurrentlyPlaying: () => false,
        setPlaybackSpeed: () => {}
      } as any;
    }
    // Set up global click hook for recording
    setupGlobalClickHook();
    
    // Set up global keyboard shortcuts for recording (no dialog needed)
    setupRecordingShortcuts();

    // Create window and tray
    createWindow();
    createTray();

    // Initialize recovery watchdog
    recoveryWatchdog = new RecoveryWatchdog(config.recovery, async () => {
      await reconnectMeeting();
    });
    // Start monitoring for disconnections
    recoveryWatchdog.start();

    // Configure auto-start on boot if enabled
    if (config.kiosk.autoStartOnBoot) {
      await configureAutoStart(true);
    }

    // Initialize Zoom and start meeting
    await initializeZoom();

  } catch (error) {
    console.error('Startup error:', error);
  }
});

app.on('window-all-closed', () => {
  // On Windows, keep running in tray if configured
  if (!config?.kiosk?.minimizeToTray) {
    cleanup();
    app.quit();
  }
});

app.on('before-quit', async () => {
  await cleanup();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
