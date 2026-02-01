"""
Zoom Kiosk - Recovery Watchdog

Monitors connection state and automatically attempts to recover
after network disconnections or meeting failures.
"""

import asyncio
import random
from typing import Callable, Awaitable
from .config import RecoveryConfig


class RecoveryState:
    IDLE = 'idle'
    MONITORING = 'monitoring'
    RECOVERING = 'recovering'
    FAILED = 'failed'


class RecoveryWatchdog:
    """Recovery Watchdog class with exponential backoff retry logic"""

    def __init__(self, config: RecoveryConfig, reconnect_callback: Callable[[], Awaitable[None]]):
        self.config = config
        self.reconnect_callback = reconnect_callback
        self.state = RecoveryState.IDLE
        self.retry_count = 0
        self.retry_task: asyncio.Task | None = None

    def start(self) -> None:
        """Start monitoring for disconnections"""
        self.state = RecoveryState.MONITORING
        self.retry_count = 0
        print('[RecoveryWatchdog] Started monitoring')

    def stop(self) -> None:
        """Stop the watchdog"""
        self.state = RecoveryState.IDLE
        self._clear_timers()
        print('[RecoveryWatchdog] Stopped')

    def on_disconnected(self) -> None:
        """Called when a disconnection is detected"""
        # If already recovering, reset and start fresh recovery
        if self.state == RecoveryState.RECOVERING:
            print('[RecoveryWatchdog] New disconnect detected during recovery, resetting and starting fresh')
            self._clear_timers()
            self.retry_count = 0

        # If in failed state, reset to allow new recovery attempts
        if self.state == RecoveryState.FAILED:
            print('[RecoveryWatchdog] Reset from failed state, starting new recovery')
            self.retry_count = 0

        print('[RecoveryWatchdog] Disconnection detected, starting recovery')
        self.state = RecoveryState.RECOVERING
        self._schedule_retry()

    def on_connected(self) -> None:
        """Called when successfully reconnected"""
        print('[RecoveryWatchdog] Connection restored')
        self.state = RecoveryState.MONITORING
        self.retry_count = 0
        self._clear_timers()

    def on_sharing_restored(self) -> None:
        """Called when sharing is restored"""
        print('[RecoveryWatchdog] Sharing restored, recovery complete')
        self.state = RecoveryState.MONITORING
        self.retry_count = 0

    def _schedule_retry(self) -> None:
        """Schedule a retry attempt with exponential backoff"""
        if self.retry_count >= self.config["maxRetries"]:
            print('[RecoveryWatchdog] Max retries reached, entering failed state')
            self.state = RecoveryState.FAILED
            return

        backoff = self._calculate_backoff()
        print(f'[RecoveryWatchdog] Scheduling retry {self.retry_count + 1}/{self.config["maxRetries"]} in {backoff}ms')

        async def retry_task():
            await asyncio.sleep(backoff / 1000.0)
            await self._attempt_recovery()

        self.retry_task = asyncio.create_task(retry_task())

    def _calculate_backoff(self) -> float:
        """Calculate exponential backoff delay"""
        exponential_delay = self.config["initialBackoffMs"] * (2 ** self.retry_count)
        jitter = random.random() * 1000  # Add random jitter up to 1 second
        return min(exponential_delay + jitter, self.config["maxBackoffMs"])

    async def _attempt_recovery(self) -> None:
        """Attempt to recover the connection"""
        self.retry_count += 1
        print(f'[RecoveryWatchdog] Attempting recovery (attempt {self.retry_count})')

        try:
            await self.reconnect_callback()
            # Success - the callback will trigger on_connected via event
        except Exception as e:
            print(f'[RecoveryWatchdog] Recovery attempt failed: {e}')

            if self.retry_count < self.config["maxRetries"]:
                self._schedule_retry()
            else:
                self.state = RecoveryState.FAILED
                print('[RecoveryWatchdog] All recovery attempts exhausted')

    def _clear_timers(self) -> None:
        """Clear all timers"""
        if self.retry_task and not self.retry_task.done():
            self.retry_task.cancel()
            self.retry_task = None

    def get_state(self) -> str:
        """Get current recovery state"""
        return self.state

    def get_retry_count(self) -> int:
        """Get retry count"""
        return self.retry_count

    def needs_attention(self) -> bool:
        """Check if in failed state (needs manual intervention)"""
        return self.state == RecoveryState.FAILED

    def reset(self) -> None:
        """Reset and restart recovery attempts"""
        self._clear_timers()
        self.retry_count = 0
        self.state = RecoveryState.MONITORING
        print('[RecoveryWatchdog] Reset, ready for new recovery cycle')
