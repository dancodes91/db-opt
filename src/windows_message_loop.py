"""
Windows Message Loop for Console Applications

The Zoom SDK requires a Windows message loop to process callbacks and events.
This module provides a message loop that can be integrated with asyncio.
"""

import ctypes
from ctypes import wintypes
import threading
import time
import asyncio
from typing import Optional
import sys

if sys.platform != 'win32':
    raise RuntimeError('Windows message loop is only available on Windows')

# Use wintypes for compatibility with pynput
LPMSG = ctypes.POINTER(wintypes.MSG)

# Load Windows API functions
user32 = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32

# Function signatures - use wintypes for compatibility
GetMessageW = user32.GetMessageW
GetMessageW.argtypes = [LPMSG, wintypes.HWND, wintypes.UINT, wintypes.UINT]
GetMessageW.restype = ctypes.c_int

TranslateMessage = user32.TranslateMessage
TranslateMessage.argtypes = [LPMSG]
TranslateMessage.restype = wintypes.BOOL

DispatchMessageW = user32.DispatchMessageW
DispatchMessageW.argtypes = [LPMSG]
DispatchMessageW.restype = ctypes.c_long

PostQuitMessage = user32.PostQuitMessage
PostQuitMessage.argtypes = [ctypes.c_int]
PostQuitMessage.restype = None

PeekMessageW = user32.PeekMessageW
PeekMessageW.argtypes = [LPMSG, wintypes.HWND, wintypes.UINT, wintypes.UINT, wintypes.UINT]
PeekMessageW.restype = wintypes.BOOL

PM_REMOVE = 0x0001
PM_NOREMOVE = 0x0000


class WindowsMessageLoop:
    """Windows message loop integrated with asyncio"""
    
    def __init__(self):
        self.running = False
        self.task: Optional[asyncio.Task] = None
    
    def start(self) -> None:
        """Start the message loop as an asyncio task"""
        if self.running:
            print('[MessageLoop] Message loop already running')
            return
        
        self.running = True
        loop = asyncio.get_event_loop()
        self.task = loop.create_task(self._pump_messages())
        print('[MessageLoop] Windows message loop started')
    
    def stop(self) -> None:
        """Stop the message loop"""
        if not self.running:
            return
        
        self.running = False
        
        if self.task and not self.task.done():
            self.task.cancel()
            # Note: We don't await here because this is called from sync code
            # The caller should wait for tasks to complete
        
        print('[MessageLoop] Windows message loop stopped')
    
    async def _pump_messages(self) -> None:
        """Pump Windows messages periodically in asyncio event loop"""
        # Use wintypes.MSG for compatibility with pynput
        msg = wintypes.MSG()
        pmsg = ctypes.byref(msg)
        WM_QUIT = 0x0012
        
        print('[MessageLoop] Message pump task started')
        
        try:
            while self.running:
                # Process all available messages without blocking
                messages_processed = 0
                while True:
                    bRet = PeekMessageW(pmsg, None, 0, 0, PM_REMOVE)
                    
                    if not bRet:
                        # No more messages
                        break
                    
                    # Message available, process it
                    if msg.message == WM_QUIT:
                        print('[MessageLoop] Received WM_QUIT')
                        self.running = False
                        break
                    
                    TranslateMessage(pmsg)
                    DispatchMessageW(pmsg)
                    messages_processed += 1
                
                # Yield to asyncio event loop
                # This allows other async tasks to run while we periodically check for messages
                await asyncio.sleep(0.01)
        except asyncio.CancelledError:
            print('[MessageLoop] Message pump task cancelled')
        finally:
            print('[MessageLoop] Message pump task exiting')
            self.running = False


# Global message loop instance
_message_loop: Optional[WindowsMessageLoop] = None


def start_message_loop() -> None:
    """Start the global Windows message loop"""
    global _message_loop
    if _message_loop is None:
        _message_loop = WindowsMessageLoop()
    _message_loop.start()


def stop_message_loop() -> None:
    """Stop the global Windows message loop"""
    global _message_loop
    if _message_loop:
        _message_loop.stop()
        _message_loop = None
