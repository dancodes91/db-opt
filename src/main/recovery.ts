/**
 * Zoom Kiosk - Recovery Watchdog
 * 
 * Monitors connection state and automatically attempts to recover
 * after network disconnections or meeting failures.
 */

import { RecoveryConfig } from './config';

/**
 * Recovery state enumeration
 */
enum RecoveryState {
  Idle = 'idle',
  Monitoring = 'monitoring',
  Recovering = 'recovering',
  Failed = 'failed'
}

/**
 * Recovery Watchdog class
 * Implements exponential backoff retry logic for meeting recovery
 */
export class RecoveryWatchdog {
  private config: RecoveryConfig;
  private reconnectCallback: () => Promise<void>;
  private state: RecoveryState = RecoveryState.Idle;
  private retryCount: number = 0;
  private retryTimer: NodeJS.Timeout | null = null;
  private healthCheckTimer: NodeJS.Timeout | null = null;

  constructor(config: RecoveryConfig, reconnectCallback: () => Promise<void>) {
    this.config = config;
    this.reconnectCallback = reconnectCallback;
  }

  /**
   * Start monitoring for disconnections
   */
  start(): void {
    this.state = RecoveryState.Monitoring;
    this.retryCount = 0;
    console.log('[RecoveryWatchdog] Started monitoring');
  }

  /**
   * Stop the watchdog
   */
  stop(): void {
    this.state = RecoveryState.Idle;
    this.clearTimers();
    console.log('[RecoveryWatchdog] Stopped');
  }

  /**
   * Called when a disconnection is detected
   */
  onDisconnected(): void {
    // If already recovering, reset and start fresh recovery
    // This handles cases where a new disconnect happens during recovery
    if (this.state === RecoveryState.Recovering) {
      console.log('[RecoveryWatchdog] New disconnect detected during recovery, resetting and starting fresh');
      this.clearTimers();
      this.retryCount = 0; // Reset retry count for fresh start
    }

    // If in failed state, reset to allow new recovery attempts
    if (this.state === RecoveryState.Failed) {
      console.log('[RecoveryWatchdog] Reset from failed state, starting new recovery');
      this.retryCount = 0;
    }

    console.log('[RecoveryWatchdog] Disconnection detected, starting recovery');
    this.state = RecoveryState.Recovering;
    this.scheduleRetry();
  }

  /**
   * Called when successfully reconnected
   */
  onConnected(): void {
    console.log('[RecoveryWatchdog] Connection restored');
    this.state = RecoveryState.Monitoring;
    this.retryCount = 0;
    this.clearTimers();
  }

  /**
   * Called when sharing is restored
   */
  onSharingRestored(): void {
    console.log('[RecoveryWatchdog] Sharing restored, recovery complete');
    this.state = RecoveryState.Monitoring;
    this.retryCount = 0;
  }

  /**
   * Schedule a retry attempt with exponential backoff
   */
  private scheduleRetry(): void {
    if (this.retryCount >= this.config.maxRetries) {
      console.error('[RecoveryWatchdog] Max retries reached, entering failed state');
      this.state = RecoveryState.Failed;
      return;
    }

    const backoff = this.calculateBackoff();
    console.log(`[RecoveryWatchdog] Scheduling retry ${this.retryCount + 1}/${this.config.maxRetries} in ${backoff}ms`);

    this.retryTimer = setTimeout(async () => {
      await this.attemptRecovery();
    }, backoff);
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoff(): number {
    const exponentialDelay = this.config.initialBackoffMs * Math.pow(2, this.retryCount);
    const jitter = Math.random() * 1000; // Add random jitter up to 1 second
    return Math.min(exponentialDelay + jitter, this.config.maxBackoffMs);
  }

  /**
   * Attempt to recover the connection
   */
  private async attemptRecovery(): Promise<void> {
    this.retryCount++;
    console.log(`[RecoveryWatchdog] Attempting recovery (attempt ${this.retryCount})`);

    try {
      await this.reconnectCallback();
      // Success - the callback will trigger onConnected via event
    } catch (error) {
      console.error('[RecoveryWatchdog] Recovery attempt failed:', error);
      
      if (this.retryCount < this.config.maxRetries) {
        this.scheduleRetry();
      } else {
        this.state = RecoveryState.Failed;
        console.error('[RecoveryWatchdog] All recovery attempts exhausted');
      }
    }
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
  }

  /**
   * Get current recovery state
   */
  getState(): RecoveryState {
    return this.state;
  }

  /**
   * Get retry count
   */
  getRetryCount(): number {
    return this.retryCount;
  }

  /**
   * Check if in failed state (needs manual intervention)
   */
  needsAttention(): boolean {
    return this.state === RecoveryState.Failed;
  }

  /**
   * Reset and restart recovery attempts
   */
  reset(): void {
    this.clearTimers();
    this.retryCount = 0;
    this.state = RecoveryState.Monitoring;
    console.log('[RecoveryWatchdog] Reset, ready for new recovery cycle');
  }
}
