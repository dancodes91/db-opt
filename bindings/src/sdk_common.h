#ifndef SDK_COMMON_H
#define SDK_COMMON_H

// CRITICAL: Windows headers MUST be included FIRST before any SDK headers
// This ensures HWND and other Windows types are defined before SDK headers use them
#ifdef WIN32
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <tchar.h>
#endif

// Now include SDK base headers - they expect Windows types to be defined
#include "zoom_sdk_def.h"
#include "zoom_sdk.h"

#endif // SDK_COMMON_H
