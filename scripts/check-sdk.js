/**
 * Check SDK Script
 * Verifies if Zoom Electron SDK is properly installed
 */

const fs = require('fs');
const path = require('path');

const SDK_DIR = path.join(process.cwd(), 'sdk', 'zoom-sdk-electron-6.7.2.72402');
const SDK_LIB = path.join(SDK_DIR, 'lib');
const SDK_WIN64 = path.join(SDK_DIR, 'sdk', 'win64');

// Required files for the SDK to work
const REQUIRED_LIB_FILES = [
  'zoom_sdk.js',
  'zoom_auth.js',
  'zoom_meeting.js',
  'zoom_meeting_share.js',
  'settings.js'
];

const REQUIRED_NATIVE_FILES = [
  'zoomsdk.node',
  'sdk.dll'
];

function checkSDK() {
  console.log('Checking Zoom Electron SDK installation...\n');

  let hasAllFiles = true;
  const missing = [];

  // Check SDK directory
  if (!fs.existsSync(SDK_DIR)) {
    console.log('❌ Zoom Electron SDK not found');
    console.log('   Expected at: sdk/zoom-sdk-electron-6.7.2.72402/');
    console.log('');
    console.log('To install:');
    console.log('1. Download Zoom Electron SDK from Zoom Marketplace');
    console.log('2. Extract to: sdk/zoom-sdk-electron-6.7.2.72402/');
    return false;
  }

  console.log('✓ SDK directory found');

  // Check lib directory
  if (!fs.existsSync(SDK_LIB)) {
    console.log('❌ SDK lib directory not found');
    hasAllFiles = false;
  } else {
    console.log('✓ SDK lib directory exists');
    
    // Check required JS files
    for (const file of REQUIRED_LIB_FILES) {
      const filePath = path.join(SDK_LIB, file);
      if (!fs.existsSync(filePath)) {
        console.log(`  ❌ Missing: ${file}`);
        missing.push(`lib/${file}`);
        hasAllFiles = false;
      } else {
        console.log(`  ✓ Found: ${file}`);
      }
    }
  }

  // Check win64 native binaries
  if (!fs.existsSync(SDK_WIN64)) {
    console.log('❌ SDK win64 directory not found');
    hasAllFiles = false;
  } else {
    console.log('✓ SDK win64 directory exists');
    
    // Check required native files
    for (const file of REQUIRED_NATIVE_FILES) {
      const filePath = path.join(SDK_WIN64, file);
      if (!fs.existsSync(filePath)) {
        console.log(`  ❌ Missing: ${file}`);
        missing.push(`sdk/win64/${file}`);
        hasAllFiles = false;
      } else {
        console.log(`  ✓ Found: ${file}`);
      }
    }
  }

  console.log('');

  if (hasAllFiles) {
    console.log('✅ Zoom Electron SDK is properly installed!');
    console.log('');
    console.log('You can now run the app:');
    console.log('  npm run build');
    console.log('  npm start');
    return true;
  } else {
    console.log('⚠️  Some SDK files are missing.');
    console.log('');
    console.log('The app will run in MOCK MODE without the actual Zoom SDK.');
    console.log('This is useful for development and testing the UI.');
    console.log('');
    console.log('Missing files:');
    missing.forEach(f => console.log(`  - ${f}`));
    console.log('');
    return false;
  }
}

// Run check
const result = checkSDK();
process.exit(result ? 0 : 1);
