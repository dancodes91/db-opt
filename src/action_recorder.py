"""
User preferences handler - Records mouse clicks for replay
"""

import json
from pathlib import Path
from typing import Optional, List, Dict, Literal
from pynput import mouse


MouseAction = Dict[str, any]  # type: ignore


class ActionRecorder:
    """Records mouse clicks for replay"""

    def __init__(self):
        self.recording: List[MouseAction] = []
        self.start_time: float = 0.0
        self._is_recording: bool = False
        self.listener: Optional[mouse.Listener] = None
        self.recording_path = Path.cwd() / 'user-prefs.json'

    @property
    def is_recording(self) -> bool:
        """Check if currently recording"""
        return self._is_recording

    @is_recording.setter
    def is_recording(self, value: bool) -> None:
        """Set recording state"""
        self._is_recording = value

    def start_recording(self) -> None:
        """Start capturing input"""
        if self.is_recording:
            return

        self.recording = []
        import time
        self.start_time = time.time()
        self._is_recording = True

        def on_click(x: float, y: float, button: mouse.Button, pressed: bool) -> None:
            if not self.is_recording or not pressed:
                return

            button_str = 'left' if button == mouse.Button.left else \
                        'right' if button == mouse.Button.right else 'middle'

            self.record_click(int(x), int(y), button_str, 'click')

        self.listener = mouse.Listener(on_click=on_click)
        self.listener.start()

    def stop_recording(self) -> bool:
        """Stop capturing and save preferences"""
        if not self.is_recording:
            return False

        self._is_recording = False

        if self.listener:
            self.listener.stop()
            self.listener = None

        # Only clicks are recorded
        self.recording = [action for action in self.recording if action['type'] in ('click', 'doubleclick')]

        try:
            with open(self.recording_path, 'w', encoding='utf-8') as f:
                json.dump(self.recording, f, indent=2)
            return True
        except Exception:
            return False

    def has_recording(self) -> bool:
        """Check if preferences exist"""
        return self.recording_path.exists()

    def load_recording(self) -> Optional[List[MouseAction]]:
        """Load preferences from file"""
        try:
            if not self.has_recording():
                return None

            with open(self.recording_path, 'r', encoding='utf-8') as f:
                actions = json.load(f)
            return actions
        except Exception:
            return None

    def delete_recording(self) -> None:
        """Delete preferences file"""
        try:
            if self.recording_path.exists():
                self.recording_path.unlink()
        except Exception:
            pass

    def get_status(self) -> Dict[str, any]:
        """Get current status"""
        return {
            'isRecording': self.is_recording,
            'actionCount': len(self.recording)
        }

    def record_click(self, x: int, y: int, button: Literal['left', 'right', 'middle'] = 'left',
                    action_type: Literal['click', 'doubleclick'] = 'click') -> None:
        """Capture click event"""
        if not self.is_recording:
            return

        import time
        click_action: MouseAction = {
            'x': x,
            'y': y,
            'time': int((time.time() - self.start_time) * 1000),
            'type': action_type,
            'button': button
        }

        self.recording.append(click_action)
