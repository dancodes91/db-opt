/**
 * Zoom Kiosk - Renderer Script
 * 
 * Handles the minimal status UI for the kiosk application
 */

// DOM Elements
const statusDot = document.getElementById('statusDot') as HTMLDivElement;
const statusLabel = document.getElementById('statusLabel') as HTMLSpanElement;
const statusMessage = document.getElementById('statusMessage') as HTMLDivElement;
const displayNameEl = document.getElementById('displayName') as HTMLSpanElement;
const meetingIdEl = document.getElementById('meetingId') as HTMLSpanElement;
const monitorEl = document.getElementById('monitor') as HTMLSpanElement;
const reconnectBtn = document.getElementById('reconnectBtn') as HTMLButtonElement;

/**
 * Status states for visual indication
 */
type StatusState = 'idle' | 'connecting' | 'connected' | 'error';

/**
 * Update the status display
 */
function updateStatus(message: string): void {
  statusMessage.textContent = message;
  
  // Determine state from message content
  let state: StatusState = 'idle';
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('ready') || lowerMessage.includes('sharing') || lowerMessage.includes('enabled')) {
    state = 'connected';
    statusLabel.textContent = 'Connected';
  } else if (lowerMessage.includes('error') || lowerMessage.includes('failed') || lowerMessage.includes('disconnected')) {
    state = 'error';
    statusLabel.textContent = 'Error';
  } else if (lowerMessage.includes('connecting') || lowerMessage.includes('starting') || lowerMessage.includes('initializing')) {
    state = 'connecting';
    statusLabel.textContent = 'Connecting';
  } else {
    statusLabel.textContent = 'Working';
    state = 'connecting';
  }
  
  // Update status dot
  statusDot.className = 'status-dot ' + state;
}

/**
 * Load and display configuration
 */
async function loadConfig(): Promise<void> {
  try {
    const config = await window.zoomKiosk.getConfig();
    displayNameEl.textContent = config.displayName;
    meetingIdEl.textContent = formatMeetingId(config.pmi);
    monitorEl.textContent = `Display ${config.monitorIndex + 1}`;
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

/**
 * Format meeting ID for display (add spaces for readability)
 */
function formatMeetingId(pmi: string): string {
  if (!pmi || pmi.length < 10) return pmi;
  return `${pmi.slice(0, 3)} ${pmi.slice(3, 6)} ${pmi.slice(6)}`;
}

/**
 * Handle reconnect button click
 */
async function handleReconnect(): Promise<void> {
  reconnectBtn.disabled = true;
  reconnectBtn.textContent = 'Reconnecting...';
  
  try {
    await window.zoomKiosk.reconnect();
  } catch (error) {
    console.error('Reconnect failed:', error);
  } finally {
    reconnectBtn.disabled = false;
    reconnectBtn.textContent = 'Reconnect';
  }
}

/**
 * Initialize the renderer
 */
async function init(): Promise<void> {
  // Load configuration
  await loadConfig();
  
  // Subscribe to status updates
  window.zoomKiosk.onStatusUpdate((status: string) => {
    updateStatus(status);
  });
  
  // Get initial status
  try {
    const status = await window.zoomKiosk.getStatus();
    updateStatus(status);
  } catch (error) {
    updateStatus('Waiting for initialization...');
  }
  
  // Set up reconnect button
  reconnectBtn.addEventListener('click', handleReconnect);
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);
