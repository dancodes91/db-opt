/**
 * Setup SDK Script
 * Provides instructions and optionally opens the Zoom SDK download page
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const SDK_DIR = path.join(process.cwd(), 'sdk');
const SDK_BIN = path.join(SDK_DIR, 'bin');
const SDK_HEADERS = path.join(SDK_DIR, 'h');

const ZOOM_SDK_URL = 'https://marketplace.zoom.us/docs/sdk/native-sdks/windows/getting-started/install-sdk';
const ZOOM_MARKETPLACE_URL = 'https://marketplace.zoom.us/';

function printInstructions() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║           ZOOM WINDOWS MEETING SDK SETUP                         ║');
  console.log('╠══════════════════════════════════════════════════════════════════╣');
  console.log('║                                                                  ║');
  console.log('║  The Zoom SDK requires manual download due to licensing.         ║');
  console.log('║                                                                  ║');
  console.log('║  STEP 1: Get SDK Credentials                                     ║');
  console.log('║  ─────────────────────────────────────────────────────────────── ║');
  console.log('║  1. Go to: https://marketplace.zoom.us/                          ║');
  console.log('║  2. Sign in with your Zoom account                               ║');
  console.log('║  3. Click Develop > Build App                                    ║');
  console.log('║  4. Select "Meeting SDK" app type                                ║');
  console.log('║  5. Fill in Basic Information                                    ║');
  console.log('║  6. Copy your Client ID and Client Secret                        ║');
  console.log('║                                                                  ║');
  console.log('║  STEP 2: Download the SDK                                        ║');
  console.log('║  ─────────────────────────────────────────────────────────────── ║');
  console.log('║  1. Go to: Docs > Meeting SDK > Windows                          ║');
  console.log('║  2. Download "Windows Meeting SDK" (v6.3.5 or higher)            ║');
  console.log('║  3. Extract the ZIP file                                         ║');
  console.log('║                                                                  ║');
  console.log('║  STEP 3: Copy SDK Files                                          ║');
  console.log('║  ─────────────────────────────────────────────────────────────── ║');
  console.log('║  Copy from extracted SDK:                                        ║');
  console.log('║    - bin/*.dll, bin/*.lib  →  sdk/bin/                           ║');
  console.log('║    - h/*.h                 →  sdk/h/                             ║');
  console.log('║                                                                  ║');
  console.log('║  STEP 4: Configure the App                                       ║');
  console.log('║  ─────────────────────────────────────────────────────────────── ║');
  console.log('║  Edit config.json with your credentials:                         ║');
  console.log('║    - sdkKey: Your Client ID                                      ║');
  console.log('║    - sdkSecret: Your Client Secret                               ║');
  console.log('║    - pmi: Your Personal Meeting ID                               ║');
  console.log('║                                                                  ║');
  console.log('║  STEP 5: Build Native Addon                                      ║');
  console.log('║  ─────────────────────────────────────────────────────────────── ║');
  console.log('║  Run: npm run build:native                                       ║');
  console.log('║                                                                  ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  console.log('');
}

function ensureDirectories() {
  // Create SDK directories if they don't exist
  if (!fs.existsSync(SDK_DIR)) {
    fs.mkdirSync(SDK_DIR, { recursive: true });
  }
  if (!fs.existsSync(SDK_BIN)) {
    fs.mkdirSync(SDK_BIN, { recursive: true });
  }
  if (!fs.existsSync(SDK_HEADERS)) {
    fs.mkdirSync(SDK_HEADERS, { recursive: true });
  }
  console.log('✓ SDK directories created');
}

function openBrowser(url) {
  const command = process.platform === 'win32' 
    ? `start "" "${url}"`
    : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;
  
  exec(command, (error) => {
    if (error) {
      console.log(`Could not open browser. Please visit: ${url}`);
    }
  });
}

async function main() {
  printInstructions();
  ensureDirectories();

  // Check if running interactively
  const args = process.argv.slice(2);
  
  if (args.includes('--open') || args.includes('-o')) {
    console.log('Opening Zoom Marketplace in browser...');
    openBrowser(ZOOM_MARKETPLACE_URL);
  } else {
    console.log('Tip: Run with --open flag to open Zoom Marketplace in browser:');
    console.log('  npm run setup:sdk -- --open');
  }

  console.log('');
  console.log('After installing SDK files, verify with:');
  console.log('  npm run check:sdk');
  console.log('');
}

main();
