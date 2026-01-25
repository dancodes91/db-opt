/**
 * Postbuild script - copies renderer files to dist
 */

const fs = require('fs');
const path = require('path');

const srcRenderer = path.join(process.cwd(), 'src', 'renderer');
const distRenderer = path.join(process.cwd(), 'dist', 'renderer');

// Ensure dist/renderer exists
if (!fs.existsSync(distRenderer)) {
  fs.mkdirSync(distRenderer, { recursive: true });
}

// Copy HTML files
const htmlSrc = path.join(srcRenderer, 'index.html');
const htmlDest = path.join(distRenderer, 'index.html');
fs.copyFileSync(htmlSrc, htmlDest);
console.log('Copied index.html');

const recordingDialogSrc = path.join(srcRenderer, 'recording-dialog.html');
const recordingDialogDest = path.join(distRenderer, 'recording-dialog.html');
if (fs.existsSync(recordingDialogSrc)) {
  fs.copyFileSync(recordingDialogSrc, recordingDialogDest);
  console.log('Copied recording-dialog.html');
}

// Copy JS file
const jsSrc = path.join(srcRenderer, 'renderer.js');
const jsDest = path.join(distRenderer, 'renderer.js');
fs.copyFileSync(jsSrc, jsDest);
console.log('Copied renderer.js');

console.log('Postbuild complete');
