"""
Zoom Kiosk - Configuration Module

Handles loading and validation of configuration from config.json
"""

import json
from pathlib import Path
from typing import TypedDict, Optional
import os


class ZoomConfig(TypedDict):
    sdkKey: str
    sdkSecret: str
    pmi: str
    passcode: str
    displayName: str


class ScreenConfig(TypedDict):
    monitorIndex: int
    shareComputerSound: bool
    stereoAudio: bool
    optimizeForVideo: bool


class RemoteControlConfig(TypedDict):
    autoAccept: bool
    enableClipboard: bool


class RecoveryConfig(TypedDict):
    maxRetries: int
    initialBackoffMs: int
    maxBackoffMs: int


class KioskModeConfig(TypedDict):
    showTrayIcon: bool
    minimizeToTray: bool


class KioskConfig(TypedDict):
    zoom: ZoomConfig
    screen: ScreenConfig
    remoteControl: RemoteControlConfig
    recovery: RecoveryConfig
    kiosk: KioskModeConfig


# Default configuration values
default_config: KioskConfig = {
    "zoom": {
        "sdkKey": "",
        "sdkSecret": "",
        "pmi": "",
        "passcode": "",
        "displayName": "REMOTE-PC-01"
    },
    "screen": {
        "monitorIndex": 0,
        "shareComputerSound": True,
        "stereoAudio": True,
        "optimizeForVideo": False
    },
    "remoteControl": {
        "autoAccept": True,
        "enableClipboard": True
    },
    "recovery": {
        "maxRetries": 10,
        "initialBackoffMs": 1000,
        "maxBackoffMs": 30000
    },
    "kiosk": {
        "showTrayIcon": True,
        "minimizeToTray": True
    }
}


def find_config_path() -> Path:
    """Find the config file path"""
    possible_paths = [
        Path.cwd() / "config.json",
        Path(__file__).parent / "config.json",
        Path(__file__).parent.parent / "config.json",
        Path(os.environ.get("APPDATA", "")) / "zoom-kiosk" / "config.json"
    ]

    for config_path in possible_paths:
        if config_path.exists():
            return config_path

    # Return default path if none found
    return possible_paths[0]


def load_config() -> KioskConfig:
    """Load configuration from file"""
    config_path = find_config_path()

    try:
        if config_path.exists():
            with open(config_path, 'r', encoding='utf-8') as f:
                user_config = json.load(f)

            # Deep merge with defaults
            config: KioskConfig = {
                "zoom": {**default_config["zoom"], **(user_config.get("zoom", {}))},
                "screen": {**default_config["screen"], **(user_config.get("screen", {}))},
                "remoteControl": {**default_config["remoteControl"], **(user_config.get("remoteControl", {}))},
                "recovery": {**default_config["recovery"], **(user_config.get("recovery", {}))},
                "kiosk": {**default_config["kiosk"], **(user_config.get("kiosk", {}))}
            }

            validate_config(config)
            return config
    except Exception as e:
        print(f"Error loading config: {e}")

    print("Warning: Using default configuration. Please edit config.json with your Zoom SDK credentials.")
    return default_config


def validate_config(config: KioskConfig) -> None:
    """Validate configuration values"""
    warnings = []

    if not config["zoom"]["sdkKey"] or config["zoom"]["sdkKey"] == "YOUR_CLIENT_ID":
        warnings.append("Zoom SDK Key is not configured")

    if not config["zoom"]["sdkSecret"] or config["zoom"]["sdkSecret"] == "YOUR_CLIENT_SECRET":
        warnings.append("Zoom SDK Secret is not configured")

    if not config["zoom"]["pmi"] or config["zoom"]["pmi"] == "1234567890":
        warnings.append("Zoom PMI is not configured")

    if config["screen"]["monitorIndex"] < 0:
        config["screen"]["monitorIndex"] = 0
        warnings.append("Invalid monitor index, defaulting to 0")

    if config["recovery"]["maxRetries"] < 1:
        config["recovery"]["maxRetries"] = 1
        warnings.append("Invalid max retries, defaulting to 1")

    if warnings:
        print("Configuration warnings:")
        for w in warnings:
            print(f"  - {w}")


def save_config(config: KioskConfig) -> None:
    """Save configuration to file"""
    config_path = find_config_path()

    try:
        config_path.parent.mkdir(parents=True, exist_ok=True)

        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2)

        print(f"Configuration saved to: {config_path}")
    except Exception as e:
        print(f"Failed to save config: {e}")
