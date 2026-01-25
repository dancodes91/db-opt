/**
 * Zoom Kiosk - Preload Script
 * 
 * Exposes safe IPC methods to the renderer process
 */

import { contextBridge, ipcRenderer } from 'electron';

/**
 * API exposed to renderer process
 */
const api = {
  /**
   * Get current status
   */
  getStatus: (): Promise<string> => {
    return ipcRenderer.invoke('get-status');
  },

  /**
   * Get configuration summary
   */
  getConfig: (): Promise<{
    displayName: string;
    pmi: string;
    monitorIndex: number;
  }> => {
    return ipcRenderer.invoke('get-config');
  },

  /**
   * Request reconnection
   */
  reconnect: (): Promise<void> => {
    return ipcRenderer.invoke('reconnect');
  },

  /**
   * Subscribe to status updates
   */
  onStatusUpdate: (callback: (status: string) => void): void => {
    ipcRenderer.on('status-update', (_event, status: string) => {
      callback(status);
    });
  },

  /**
   * Remove status update listener
   */
  removeStatusListener: (): void => {
    ipcRenderer.removeAllListeners('status-update');
  },

  /**
   * Recording dialog IPC methods
   */
  recording: {
    start: (): void => {
      ipcRenderer.send('recording-start');
    },
    stop: (): void => {
      ipcRenderer.send('recording-stop');
    },
    recordClick: (data: { x: number; y: number; button: string; type: string }): void => {
      ipcRenderer.send('record-click', data);
    },
    onStarted: (callback: () => void): void => {
      ipcRenderer.on('recording-started', callback);
    },
    onStopped: (callback: (saved: boolean) => void): void => {
      ipcRenderer.on('recording-stopped', (_event, saved: boolean) => callback(saved));
    },
    onStatus: (callback: (status: { isRecording: boolean; actionCount: number }) => void): void => {
      ipcRenderer.on('recording-status', (_event, status) => callback(status));
    },
    removeAllListeners: (): void => {
      ipcRenderer.removeAllListeners('recording-started');
      ipcRenderer.removeAllListeners('recording-stopped');
      ipcRenderer.removeAllListeners('recording-status');
    }
  }
};

// Expose API to renderer
contextBridge.exposeInMainWorld('zoomKiosk', api);

// Type declaration for renderer
declare global {
  interface Window {
    zoomKiosk: typeof api;
  }
}
