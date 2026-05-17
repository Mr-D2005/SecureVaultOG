@echo off
title SecureVault AI Total Protection Setup
color 0B
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo !!                                                        !!
echo !!        SECUREVAULT: AI TOTAL DEFENSE SETUP             !!
echo !!        STATUS: COGNITIVE SYSTEM SEEDING ACTIVE         !!
echo !!                                                        !!
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo.

set "INSTALL_DIR=%APPDATA%\SecureVault"
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

echo [GHOST_SETUP] Initializing filesystem handles...
echo [GHOST_SETUP] Target directory: %INSTALL_DIR%
echo.

:: 1. Fetch GUI core
echo [GHOST_SETUP] [1/3] Fetching 6-Agent Core Engine...

:: Prioritize local files first during development/installation
if exist "sentinel_gui.ps1" (
    echo [LOCAL_DEV] Copying sentinel_gui.ps1 from working directory...
    copy "sentinel_gui.ps1" "%INSTALL_DIR%\sentinel_gui.ps1" >nul
) else if exist "backend\sentinel_gui.ps1" (
    echo [LOCAL_DEV] Copying sentinel_gui.ps1 from backend folder...
    copy "backend\sentinel_gui.ps1" "%INSTALL_DIR%\sentinel_gui.ps1" >nul
) else if exist "%~dp0sentinel_gui.ps1" (
    echo [LOCAL_DEV] Copying sentinel_gui.ps1 from parent batch path...
    copy "%~dp0sentinel_gui.ps1" "%INSTALL_DIR%\sentinel_gui.ps1" >nul
) else (
    echo [NETWORK_FETCH] Downloading from secure nodes...
    powershell -Command "Invoke-WebRequest -Uri 'http://localhost:5000/api/system-shield/gui-script' -OutFile '%INSTALL_DIR%\sentinel_gui.ps1' -ErrorAction SilentlyContinue"
    if not exist "%INSTALL_DIR%\sentinel_gui.ps1" (
        powershell -Command "Invoke-WebRequest -Uri 'https://securevault-main.onrender.com/api/system-shield/gui-script' -OutFile '%INSTALL_DIR%\sentinel_gui.ps1' -ErrorAction SilentlyContinue"
    )
)

if not exist "%INSTALL_DIR%\sentinel_gui.ps1" (
    echo [CRITICAL ERROR] Core script sentinel_gui.ps1 could not be retrieved!
    echo Please make sure your server is online and running.
    pause
    exit /b
)

:: 2. Fetch Icon
echo [GHOST_SETUP] [2/3] Downloading High-Res Identity Icon...

if exist "securevault_logo.ico" (
    copy "securevault_logo.ico" "%INSTALL_DIR%\logo.ico" >nul
) else if exist "public\securevault_logo.ico" (
    copy "public\securevault_logo.ico" "%INSTALL_DIR%\logo.ico" >nul
) else if exist "%~dp0..\public\securevault_logo.ico" (
    copy "%~dp0..\public\securevault_logo.ico" "%INSTALL_DIR%\logo.ico" >nul
) else (
    powershell -Command "Invoke-WebRequest -Uri 'http://localhost:5000/api/system-shield/icon' -OutFile '%INSTALL_DIR%\logo.ico' -ErrorAction SilentlyContinue"
    if not exist "%INSTALL_DIR%\logo.ico" (
        powershell -Command "Invoke-WebRequest -Uri 'https://securevault-main.onrender.com/api/system-shield/icon' -OutFile '%INSTALL_DIR%\logo.ico' -ErrorAction SilentlyContinue"
    )
)

:: 3. Configure Shortcuts
echo [GHOST_SETUP] [3/3] Fortifying Desktop Shortcuts...
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\SecureVault AI Antivirus.lnk'); $Shortcut.TargetPath = 'powershell.exe'; $Shortcut.Arguments = '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \"'+$env:APPDATA+'\SecureVault\sentinel_gui.ps1\"'; if (Test-Path '%INSTALL_DIR%\logo.ico') { $Shortcut.IconLocation = '%INSTALL_DIR%\logo.ico' }; $Shortcut.Save()"

echo.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo !!  [SUCCESS] SECUREVAULT AI TOTAL PROTECTION INSTALLED   !!
echo !!  Shortcut created: 'SecureVault AI Antivirus' (Desktop)!!
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo.
echo Launching the Antivirus Suite now...
start "" "%USERPROFILE%\Desktop\SecureVault AI Antivirus.lnk"
exit
