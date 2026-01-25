/**
 * User preferences handler
 */

import * as fs from 'fs';
import * as path from 'path';

export interface MouseAction {
  x: number;
  y: number;
  time: number;
  type: 'move' | 'click' | 'doubleclick';
  button?: 'left' | 'right' | 'middle';
}

export class ActionRecorder {
  private recording: MouseAction[] = [];
  private startTime: number = 0;
  private isRecording: boolean = false;
  private clickListeners: Array<() => void> = [];
  private recordingPath: string;

  constructor() {
    const rootDir = process.cwd();
    this.recordingPath = path.join(rootDir, 'user-prefs.json');
  }

  /**
   * Start capturing input
   */
  startRecording(): void {
    if (this.isRecording) {
      return;
    }

    this.recording = [];
    this.startTime = Date.now();
    this.isRecording = true;

    // Trigger IPC handler to start click monitoring
    try {
      const { ipcMain } = require('electron');
      ipcMain.emit('start-click-monitoring');
    } catch (e) {
      // Ignore
    }
    
    this.setupClickDetection();
  }

  /**
   * Stop capturing and save preferences
   */
  stopRecording(): boolean {
    if (!this.isRecording) {
      return false;
    }

    this.isRecording = false;

    try {
      const { ipcMain } = require('electron');
      ipcMain.emit('stop-click-monitoring');
    } catch (e) {
      // Ignore
    }

    this.cleanupClickDetection();

    // Only clicks are recorded, no optimization needed
    // Filter out any move actions from old recordings for consistency
    this.recording = this.recording.filter(action => action.type === 'click' || action.type === 'doubleclick');

    try {
      fs.writeFileSync(this.recordingPath, JSON.stringify(this.recording, null, 2), 'utf-8');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if preferences exist
   */
  hasRecording(): boolean {
    return fs.existsSync(this.recordingPath);
  }

  /**
   * Load preferences from file
   */
  loadRecording(): MouseAction[] | null {
    try {
      if (!this.hasRecording()) {
        return null;
      }

      const data = fs.readFileSync(this.recordingPath, 'utf-8');
      const actions = JSON.parse(data) as MouseAction[];
      return actions;
    } catch (error) {
      return null;
    }
  }

  /**
   * Delete preferences file
   */
  deleteRecording(): void {
    try {
      if (fs.existsSync(this.recordingPath)) {
        fs.unlinkSync(this.recordingPath);
      }
    } catch (error) {
      // Ignore
    }
  }

  /**
   * Get current status
   */
  getStatus(): { isRecording: boolean; actionCount: number } {
    return {
      isRecording: this.isRecording,
      actionCount: this.recording.length
    };
  }

  /**
   * Set up click detection
   */
  private setupClickDetection(): void {
    try {
      const { ipcRenderer } = require('electron');
      
      ipcRenderer.on('global-mouse-click', (_event: any, data: any) => {
        if (!this.isRecording) {
          return;
        }

        const button = data.button === 1 || data.button === 0 ? 'left' :
                      data.button === 2 ? 'right' :
                      data.button === 3 || data.button === 4 ? 'middle' : 'left';

        this.recordClick(data.x, data.y, button, data.type || 'click');
      });

      this.clickListeners.push(() => {
        try {
          ipcRenderer.removeAllListeners('global-mouse-click');
        } catch (e) {
          // Ignore
        }
      });
    } catch (e) {
      // Main process - clicks handled directly
    }
  }

  /**
   * Capture click event
   */
  recordClick(x: number, y: number, button: 'left' | 'right' | 'middle' = 'left', type: 'click' | 'doubleclick' = 'click'): void {
    if (!this.isRecording) {
      return;
    }

    const clickAction: MouseAction = {
      x,
      y,
      time: Date.now() - this.startTime,
      type,
      button
    };

    this.recording.push(clickAction);
  }

  /**
   * Clean up click detection listeners
   */
  private cleanupClickDetection(): void {
    this.clickListeners.forEach(cleanup => cleanup());
    this.clickListeners = [];
  }

}
