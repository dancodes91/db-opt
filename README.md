# Zoom Kiosk - Python Edition

Console-based Python application for automated Zoom Kiosk mode with screen sharing and remote control.

## Features

- Automated Zoom meeting join with PMI
- Screen sharing with audio
- Remote control preference automation
- Automatic reconnection on disconnect
- Mouse action recording and replay with natural movement (WindMouse algorithm)

## Requirements

- Python 3.10+
- Windows 10/11
- MS Build Tools 2022
- CMake 3.15+
- Zoom Windows SDK (included in `sdk/zoom-sdk-windows-6.7.2.26830/`)

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Build SDK bindings:
```bash
cd bindings
python setup.py build_ext --inplace
```

Or using CMake:
```bash
cd bindings
mkdir build
cd build
cmake ..
cmake --build . --config Release
```

3. Copy SDK DLLs to bindings output directory (or add to PATH)

## Configuration

Copy `examples.config.json` to `config.json` and fill in your Zoom SDK credentials:

```json
{
  "zoom": {
    "sdkKey": "YOUR_SDK_KEY",
    "sdkSecret": "YOUR_SDK_SECRET",
    "pmi": "YOUR_PMI",
    "passcode": "YOUR_PASSCODE",
    "displayName": "REMOTE-PC-01"
  },
  "screen": {
    "monitorIndex": 0,
    "shareComputerSound": true,
    "stereoAudio": true,
    "optimizeForVideo": false
  },
  "remoteControl": {
    "autoAccept": true,
    "enableClipboard": true
  },
  "recovery": {
    "maxRetries": 10,
    "initialBackoffMs": 1000,
    "maxBackoffMs": 30000
  }
}
```

## Usage

Run the application:
```bash
python main.py
```

### Keyboard Shortcuts

- **F9** - Start/Stop capturing mouse clicks for preferences
- **F10** - Force stop capturing

### Recording Preferences

1. Join a meeting
2. Press **F9** to start capturing
3. Navigate to Zoom settings and configure remote control options
4. Click on the UI elements you want to automate
5. Press **F9** again to stop capturing

The recorded preferences will be saved to `user-prefs.json` and automatically applied when another participant joins.

## Project Structure

```
.
├── main.py                 # Entry point
├── config.py              # Configuration loader
├── zoom_service.py         # Zoom SDK wrapper
├── action_recorder.py      # Mouse click recorder
├── action_player.py        # Mouse action replay
├── recovery.py             # Reconnection watchdog
├── bindings/               # Python SDK bindings
│   ├── src/
│   │   ├── module.cpp
│   │   ├── zoom_sdk_binding.cpp
│   │   ├── auth_service_binding.cpp
│   │   ├── meeting_service_binding.cpp
│   │   ├── participants_binding.cpp
│   │   ├── sharing_binding.cpp
│   │   ├── configuration_binding.cpp
│   │   └── callbacks.cpp
│   ├── CMakeLists.txt
│   └── setup.py
├── config.json            # Configuration file
├── user-prefs.json        # Recorded preferences
└── requirements.txt       # Python dependencies
```

## Migration from Electron

This Python application is a migration from the Electron/TypeScript version. Key differences:

- **No GUI**: Console-only application
- **Python SDK Bindings**: Uses pybind11 to bind Windows C++ SDK
- **asyncio**: Replaces Node.js EventEmitter with asyncio events
- **pyautogui/pynput**: Replaces robotjs/global-mouse-events

## Troubleshooting

### SDK Bindings Not Found

Ensure bindings are built and DLLs are in the correct location:
```bash
cd bindings
python setup.py build_ext --inplace
```

### Import Errors

Make sure all dependencies are installed:
```bash
pip install -r requirements.txt
```

### Meeting Join Fails

Check your `config.json` has valid SDK credentials and PMI.

## License

See LICENSE file for details.
