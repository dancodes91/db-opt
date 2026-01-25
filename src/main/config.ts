/**
 * Zoom Kiosk - Configuration Module
 * 
 * Handles loading and validation of configuration from config.json
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Zoom SDK configuration
 */
export interface ZoomConfig {
  sdkKey: string;
  sdkSecret: string;
  pmi: string;
  passcode: string;
  displayName: string;
}

/**
 * Screen sharing configuration
 */
export interface ScreenConfig {
  monitorIndex: number;
  shareComputerSound: boolean;
  stereoAudio: boolean;
  optimizeForVideo: boolean;
}

/**
 * Remote control configuration
 */
export interface RemoteControlConfig {
  autoAccept: boolean;
  enableClipboard: boolean;
}

/**
 * Recovery/reconnection configuration
 */
export interface RecoveryConfig {
  maxRetries: number;
  initialBackoffMs: number;
  maxBackoffMs: number;
}

/**
 * Kiosk mode configuration
 */
export interface KioskModeConfig {
  autoStartOnBoot: boolean;
  showTrayIcon: boolean;
  minimizeToTray: boolean;
}

/**
 * Complete application configuration
 */
export interface KioskConfig {
  zoom: ZoomConfig;
  screen: ScreenConfig;
  remoteControl: RemoteControlConfig;
  recovery: RecoveryConfig;
  kiosk: KioskModeConfig;
}

/**
 * Default configuration values (minimal defaults - actual values should come from config.json)
 * These are only used as fallback if config.json doesn't exist or is missing fields
 */
const defaultConfig: KioskConfig = {
  zoom: {
    sdkKey: '',
    sdkSecret: '',
    pmi: '',
    passcode: '',
    displayName: 'REMOTE-PC-01'
  },
  screen: {
    monitorIndex: 0,
    shareComputerSound: true,
    stereoAudio: true,
    optimizeForVideo: false
  },
  remoteControl: {
    autoAccept: true,
    enableClipboard: true
  },
  recovery: {
    maxRetries: 10,
    initialBackoffMs: 1000,
    maxBackoffMs: 30000
  },
  kiosk: {
    autoStartOnBoot: true,
    showTrayIcon: true,
    minimizeToTray: true
  }
};

/**
 * Find the config file path
 * Looks in multiple locations for flexibility
 */
function findConfigPath(): string {
  const possiblePaths = [
    path.join(process.cwd(), 'config.json'),
    path.join(__dirname, '../../config.json'),
    path.join(__dirname, '../../../config.json'),
    path.join(process.env.APPDATA || '', 'zoom-kiosk', 'config.json')
  ];

  for (const configPath of possiblePaths) {
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  }

  // Return default path if none found
  return possiblePaths[0];
}

/**
 * Load configuration from file
 * Merges with defaults for any missing values
 */
export function loadConfig(): KioskConfig {
  const configPath = findConfigPath();
  
  try {
    if (fs.existsSync(configPath)) {
      const fileContent = fs.readFileSync(configPath, 'utf-8');
      const userConfig = JSON.parse(fileContent) as Partial<KioskConfig>;
      
      // Deep merge with defaults
      const config: KioskConfig = {
        zoom: { ...defaultConfig.zoom, ...userConfig.zoom },
        screen: { ...defaultConfig.screen, ...userConfig.screen },
        remoteControl: { ...defaultConfig.remoteControl, ...userConfig.remoteControl },
        recovery: { ...defaultConfig.recovery, ...userConfig.recovery },
        kiosk: { ...defaultConfig.kiosk, ...userConfig.kiosk }
      };

      validateConfig(config);
      return config;
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }

  console.warn('Using default configuration. Please edit config.json with your Zoom SDK credentials.');
  return defaultConfig;
}

/**
 * Validate configuration values
 * Throws an error if critical values are missing
 */
function validateConfig(config: KioskConfig): void {
  const warnings: string[] = [];

  if (!config.zoom.sdkKey || config.zoom.sdkKey === 'YOUR_CLIENT_ID') {
    warnings.push('Zoom SDK Key is not configured');
  }

  if (!config.zoom.sdkSecret || config.zoom.sdkSecret === 'YOUR_CLIENT_SECRET') {
    warnings.push('Zoom SDK Secret is not configured');
  }

  if (!config.zoom.pmi || config.zoom.pmi === '1234567890') {
    warnings.push('Zoom PMI is not configured');
  }

  if (config.screen.monitorIndex < 0) {
    config.screen.monitorIndex = 0;
    warnings.push('Invalid monitor index, defaulting to 0');
  }

  if (config.recovery.maxRetries < 1) {
    config.recovery.maxRetries = 1;
    warnings.push('Invalid max retries, defaulting to 1');
  }

  if (warnings.length > 0) {
    console.warn('Configuration warnings:');
    warnings.forEach(w => console.warn(`  - ${w}`));
  }
}

/**
 * Save configuration to file
 */
export function saveConfig(config: KioskConfig): void {
  const configPath = findConfigPath();
  
  try {
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log('Configuration saved to:', configPath);
  } catch (error) {
    console.error('Failed to save config:', error);
  }
}
