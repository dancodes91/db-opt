/**
 * Prebuild script - creates necessary directories
 */

const fs = require('fs');
const path = require('path');

const dirs = [
  'dist',
  'dist/main',
  'dist/renderer'
];

dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

console.log('Prebuild complete');
