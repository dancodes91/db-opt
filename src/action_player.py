"""
Input handler for user preferences - Replays mouse actions with WindMouse algorithm
"""

import asyncio
import math
import random
import time
from typing import List, Dict, Optional, Literal
import pyautogui
import ctypes
from ctypes import wintypes

# Disable pyautogui failsafe
pyautogui.FAILSAFE = False

MouseAction = Dict[str, any]  # type: ignore


def get_screen_waypoints() -> Dict[str, Dict[str, int]]:
    """Get screen waypoints: center and topCenter (25px below top, 100px left of center)"""
    try:
        # Use Windows API to get screen dimensions
        user32 = ctypes.windll.user32
        width = user32.GetSystemMetrics(0)  # SM_CXSCREEN
        height = user32.GetSystemMetrics(1)  # SM_CYSCREEN

        center = {'x': width // 2, 'y': height // 2}
        top_center = {'x': width // 2 - 100, 'y': 25}
        return {'center': center, 'topCenter': top_center}
    except Exception:
        return {'center': {'x': 960, 'y': 540}, 'topCenter': {'x': 860, 'y': 25}}


class ActionPlayer:
    """Replays mouse actions with natural movement"""

    def __init__(self):
        self.is_playing = False
        self.playback_speed = 1.0

    async def wind_mouse(
        self,
        start_x: float,
        start_y: float,
        dest_x: float,
        dest_y: float,
        G_0: float = 9.0,
        W_0: float = 5.0,
        M_0: float = 15.0,
        D_0: float = 12.0
    ) -> None:
        """
        WindMouse algorithm for natural mouse movement
        G_0 - magnitude of the gravitational force
        W_0 - magnitude of the wind force fluctuations
        M_0 - maximum step size (velocity clip threshold)
        D_0 - distance where wind behavior changes from random to damped
        """
        sqrt3 = math.sqrt(3)
        sqrt5 = math.sqrt(5)

        current_x = start_x
        current_y = start_y
        v_x = 0.0
        v_y = 0.0
        W_x = 0.0
        W_y = 0.0
        start_x_pos = start_x
        start_y_pos = start_y
        M_0_current = M_0

        while True:
            dist = math.hypot(dest_x - start_x_pos, dest_y - start_y_pos)
            if dist < 1:
                break

            W_mag = min(W_0, dist)
            if dist >= D_0:
                W_x = W_x / sqrt3 + (2 * random.random() - 1) * W_mag / sqrt5
                W_y = W_y / sqrt3 + (2 * random.random() - 1) * W_mag / sqrt5
            else:
                W_x /= sqrt3
                W_y /= sqrt3
                if M_0_current < 3:
                    M_0_current = random.random() * 3 + 3
                else:
                    M_0_current /= sqrt5

            v_x += W_x + G_0 * (dest_x - start_x_pos) / dist
            v_y += W_y + G_0 * (dest_y - start_y_pos) / dist
            v_mag = math.hypot(v_x, v_y)

            if v_mag > M_0_current:
                v_clip = M_0_current / 2 + random.random() * M_0_current / 2
                v_x = (v_x / v_mag) * v_clip
                v_y = (v_y / v_mag) * v_clip

            start_x_pos += v_x
            start_y_pos += v_y
            move_x = round(start_x_pos)
            move_y = round(start_y_pos)

            if current_x != move_x or current_y != move_y:
                pyautogui.moveTo(move_x, move_y)
                current_x = move_x
                current_y = move_y

                # Variable delay based on velocity
                base_delay = 1.5
                velocity_factor = min(1.0, v_mag / M_0_current)
                delay = base_delay * (1.0 - velocity_factor * 0.3) + random.random() * 0.2
                await asyncio.sleep(max(0.0005, delay / 1000.0))

        # Ensure final position is exact
        pyautogui.moveTo(int(dest_x), int(dest_y))

    async def play_actions(self, actions: List[MouseAction]) -> None:
        """Apply user preferences"""
        if self.is_playing:
            return

        if not actions or len(actions) == 0:
            return

        self.is_playing = True

        try:
            # Filter to only process clicks
            click_actions = [a for a in actions if a.get('type') in ('click', 'doubleclick')]

            if len(click_actions) == 0:
                return

            # Sort actions by time
            sorted_actions = sorted(click_actions, key=lambda a: a.get('time', 0))

            previous_time = 0

            for action in sorted_actions:
                if not self.is_playing:
                    break

                delay = action.get('time', 0) - previous_time
                if delay > 0:
                    wait_ms = delay / self.playback_speed
                    chunk = 50
                    left = wait_ms
                    while left > 0 and self.is_playing:
                        await asyncio.sleep(min(chunk, left) / 1000.0)
                        left -= chunk
                if not self.is_playing:
                    break

                waypoints = get_screen_waypoints()
                center = waypoints['center']
                top_center = waypoints['topCenter']
                current_pos = pyautogui.position()
                x = current_pos.x
                y = current_pos.y

                # Waypoints before each click: current -> center -> topCenter -> target
                if x != center['x'] or y != center['y']:
                    await self.wind_mouse(x, y, center['x'], center['y'])
                    if not self.is_playing:
                        break
                    x = center['x']
                    y = center['y']

                if x != top_center['x'] or y != top_center['y']:
                    await self.wind_mouse(x, y, top_center['x'], top_center['y'])
                    if not self.is_playing:
                        break
                    x = top_center['x']
                    y = top_center['y']

                if x != action['x'] or y != action['y']:
                    await self.wind_mouse(x, y, action['x'], action['y'])
                if not self.is_playing:
                    break

                # Small random delay before click
                await asyncio.sleep(random.random() * 0.01 + 0.005)
                if not self.is_playing:
                    break

                # Execute the click
                button = action.get('button', 'left')
                if action.get('type') == 'click':
                    pyautogui.click(action['x'], action['y'], button=button)
                elif action.get('type') == 'doubleclick':
                    pyautogui.click(action['x'], action['y'], button=button)
                    await asyncio.sleep(random.random() * 0.03 + 0.03)
                    pyautogui.click(action['x'], action['y'], button=button)

                previous_time = action.get('time', 0)
        except Exception as e:
            raise e
        finally:
            self.is_playing = False

    def stop(self) -> None:
        """Stop execution (if in progress)"""
        self.is_playing = False

    def is_currently_playing(self) -> bool:
        """Check if currently executing"""
        return self.is_playing

    def set_playback_speed(self, speed: float) -> None:
        """Set execution speed multiplier"""
        self.playback_speed = max(0.1, min(5.0, speed))
