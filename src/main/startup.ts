/**
 * Zoom Kiosk - Windows Startup Integration
 * 
 * Manages auto-start on Windows boot via registry
 */

import { app } from 'electron';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const APP_NAME = 'ZoomKiosk';
const REGISTRY_KEY = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run';

/**
 * Check if the app is configured to start on boot
 */
export async function isAutoStartEnabled(): Promise<boolean> {
  try {
    const { stdout } = await execAsync(
      `reg query "${REGISTRY_KEY}" /v "${APP_NAME}"`,
      { windowsHide: true }
    );
    return stdout.includes(APP_NAME);
  } catch {
    // Key doesn't exist
    return false;
  }
}

/**
 * Enable auto-start on Windows boot
 */
export async function enableAutoStart(): Promise<void> {
  const exePath = getExecutablePath();
  
  try {
    await execAsync(
      `reg add "${REGISTRY_KEY}" /v "${APP_NAME}" /t REG_SZ /d "${exePath}" /f`,
      { windowsHide: true }
    );
    console.log('[Startup] Auto-start enabled');
  } catch (error) {
    console.error('[Startup] Failed to enable auto-start:', error);
    throw error;
  }
}

/**
 * Disable auto-start on Windows boot
 */
export async function disableAutoStart(): Promise<void> {
  try {
    await execAsync(
      `reg delete "${REGISTRY_KEY}" /v "${APP_NAME}" /f`,
      { windowsHide: true }
    );
    console.log('[Startup] Auto-start disabled');
  } catch (error) {
    // Ignore if key doesn't exist
    if (!String(error).includes('unable to find')) {
      console.error('[Startup] Failed to disable auto-start:', error);
    }
  }
}

/**
 * Get the path to the executable
 */
function getExecutablePath(): string {
  if (app.isPackaged) {
    // In production, use the installed executable
    return `"${process.execPath}"`;
  } else {
    // In development, use electron with the app path
    const electronPath = path.join(process.cwd(), 'node_modules', '.bin', 'electron.cmd');
    return `"${electronPath}" "${app.getAppPath()}"`;
  }
}

/**
 * Toggle auto-start based on configuration
 */
export async function configureAutoStart(enable: boolean): Promise<void> {
  const isEnabled = await isAutoStartEnabled();
  
  if (enable && !isEnabled) {
    await enableAutoStart();
  } else if (!enable && isEnabled) {
    await disableAutoStart();
  }
}
