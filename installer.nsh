; Zoom Kiosk NSIS Installer Script
; Custom installer behaviors

!macro customHeader
  ; Add custom header content here if needed
!macroend

!macro customInit
  ; Initialization code
!macroend

!macro customInstall
  ; Copy SDK DLLs to installation directory
  SetOutPath "$INSTDIR\resources\sdk\bin"
  
  ; Create config directory in AppData
  CreateDirectory "$APPDATA\zoom-kiosk"
  
  ; Copy default config if not exists
  IfFileExists "$APPDATA\zoom-kiosk\config.json" +2
    CopyFiles "$INSTDIR\resources\config.json" "$APPDATA\zoom-kiosk\config.json"
!macroend

!macro customUnInstall
  ; Remove auto-start registry entry
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "ZoomKiosk"
  
  ; Optionally remove config (commented out to preserve settings)
  ; RMDir /r "$APPDATA\zoom-kiosk"
!macroend
