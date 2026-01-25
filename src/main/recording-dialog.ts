/**
 * Zoom Kiosk - Recording Dialog
 * 
 * Dialog window for controlling action recording
 */

import { BrowserWindow, ipcMain, globalShortcut } from 'electron';
import * as path from 'path';
import { ActionRecorder } from './action-recorder';

export class RecordingDialog {
  private window: BrowserWindow | null = null;
  private recorder: ActionRecorder;
  private onStopCallback?: (saved: boolean) => void;

  constructor(recorder: ActionRecorder) {
    this.recorder = recorder;
    this.setupIPC();
  }

  /**
   * Show the recording dialog
   */
  show(onStop?: (saved: boolean) => void): void {
    if (this.window) {
      this.window.focus();
      return;
    }

    this.onStopCallback = onStop;

    // Get screen dimensions
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    // Create window
    this.window = new BrowserWindow({
      width: 400,
      height: 150,
      x: Math.floor((width - 400) / 2),
      y: Math.floor((height - 150) / 2),
      frame: false,
      alwaysOnTop: true,
      resizable: false,
      movable: true,
      transparent: false,
      backgroundColor: '#2e2e2e',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    // Load HTML content
    const htmlPath = path.join(__dirname, '../renderer/recording-dialog.html');
    console.log('[RecordingDialog] Loading HTML from:', htmlPath);
    this.window.loadFile(htmlPath);

    // Ensure window stays on top and focused
    this.window.setAlwaysOnTop(true, 'screen-saver');
    this.window.focus();
    this.window.show();

    // Set up global keyboard shortcuts (F9 to toggle recording)
    this.setupGlobalShortcuts();

    // Handle window close
    this.window.on('closed', () => {
      this.cleanupGlobalShortcuts();
      this.window = null;
    });

    // Update status periodically
    const statusInterval = setInterval(() => {
      if (!this.window || this.window.isDestroyed()) {
        clearInterval(statusInterval);
        return;
      }

      const status = this.recorder.getStatus();
      this.window.webContents.send('recording-status', status);
    }, 100);

    this.window.on('closed', () => {
      clearInterval(statusInterval);
    });
  }

  /**
   * Close the dialog
   */
  close(): void {
    if (this.window) {
      this.window.close();
      this.window = null;
    }
  }

  /**
   * Set up IPC handlers
   */
  private setupIPC(): void {
    // Handle start recording
    ipcMain.on('recording-start', () => {
      console.log('[RecordingDialog] IPC: recording-start received');
      this.handleStartRecording();
    });

    // Handle stop recording
    ipcMain.on('recording-stop', () => {
      console.log('[RecordingDialog] IPC: recording-stop received');
      this.handleStopRecording();
    });

    // Handle click recording (from renderer)
    ipcMain.on('record-click', (event, data: { x: number; y: number; button: string; type: string }) => {
      this.recorder.recordClick(
        data.x,
        data.y,
        data.button as 'left' | 'right' | 'middle',
        data.type as 'click' | 'doubleclick'
      );
    });
  }

  /**
   * Set up global keyboard shortcuts
   */
  private setupGlobalShortcuts(): void {
    // F9 to toggle recording (start/stop)
    const ret = globalShortcut.register('F9', () => {
      const status = this.recorder.getStatus();
      if (status.isRecording) {
        console.log('[RecordingDialog] F9 pressed - stopping recording');
        this.handleStopRecording();
      } else {
        console.log('[RecordingDialog] F9 pressed - starting recording');
        this.handleStartRecording();
      }
    });

    if (ret) {
      console.log('[RecordingDialog] Global shortcut F9 registered successfully');
    } else {
      console.warn('[RecordingDialog] Failed to register global shortcut F9');
    }

    // F10 to force stop (if recording)
    globalShortcut.register('F10', () => {
      if (this.recorder.getStatus().isRecording) {
        console.log('[RecordingDialog] F10 pressed - force stopping recording');
        this.handleStopRecording();
      }
    });
  }

  /**
   * Clean up global shortcuts
   */
  private cleanupGlobalShortcuts(): void {
    globalShortcut.unregister('F9');
    globalShortcut.unregister('F10');
    globalShortcut.unregisterAll();
  }

  /**
   * Handle start recording
   */
  private handleStartRecording(): void {
    this.recorder.startRecording();
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('recording-started');
    }
  }

  /**
   * Handle stop recording
   */
  private handleStopRecording(): void {
    const saved = this.recorder.stopRecording();
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('recording-stopped', saved);
    }
    if (this.onStopCallback) {
      this.onStopCallback(saved);
    }
  }

  /**
   * Clean up IPC handlers
   */
  cleanup(): void {
    this.cleanupGlobalShortcuts();
    ipcMain.removeAllListeners('recording-start');
    ipcMain.removeAllListeners('recording-stop');
    ipcMain.removeAllListeners('record-click');
    this.close();
  }
}
