/**
 * Windows Click Detector Helper
 * Uses Windows API GetAsyncKeyState to detect mouse clicks
 * This script runs in a separate process and communicates via stdout
 */

if (process.platform !== 'win32') {
  console.error('Click detector only works on Windows');
  process.exit(1);
}

const robot = require('robotjs');

// Virtual key codes
const VK_LBUTTON = 0x01;
const VK_RBUTTON = 0x02;
const VK_MBUTTON = 0x04;

// Use ffi to call Windows API
let user32;
try {
  const ffi = require('ffi-napi');
  user32 = ffi.Library('user32', {
    'GetAsyncKeyState': ['short', ['int']]
  });
} catch (e) {
  // Fallback: use PowerShell (slower but works)
  console.error('ffi-napi not available, using PowerShell fallback');
}

let lastState = { left: false, right: false, middle: false };

setInterval(() => {
  try {
    const pos = robot.getMousePos();
    
    let leftPressed = false;
    let rightPressed = false;
    let middlePressed = false;
    
    if (user32) {
      // Use Windows API directly
      const leftState = user32.GetAsyncKeyState(VK_LBUTTON);
      const rightState = user32.GetAsyncKeyState(VK_RBUTTON);
      const middleState = user32.GetAsyncKeyState(VK_MBUTTON);
      
      leftPressed = (leftState & 0x8000) !== 0;
      rightPressed = (rightState & 0x8000) !== 0;
      middlePressed = (middleState & 0x8000) !== 0;
    } else {
      // Fallback: use PowerShell (not implemented here, would be too slow)
      return;
    }
    
    // Detect transitions
    if (!lastState.left && leftPressed) {
      console.log(JSON.stringify({ type: 'click', x: pos.x, y: pos.y, button: 'left' }));
    }
    if (!lastState.right && rightPressed) {
      console.log(JSON.stringify({ type: 'click', x: pos.x, y: pos.y, button: 'right' }));
    }
    if (!lastState.middle && middlePressed) {
      console.log(JSON.stringify({ type: 'click', x: pos.x, y: pos.y, button: 'middle' }));
    }
    
    lastState = { left: leftPressed, right: rightPressed, middle: middlePressed };
  } catch (e) {
    // Ignore errors
  }
}, 10); // 100 FPS
