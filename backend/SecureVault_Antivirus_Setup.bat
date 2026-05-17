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

if exist "%~dp0sentinel_gui.ps1" (
    echo [LOCAL] Copying sentinel_gui.ps1 from batch folder...
    copy "%~dp0sentinel_gui.ps1" "%INSTALL_DIR%\sentinel_gui.ps1" >nul
) else if exist "sentinel_gui.ps1" (
    echo [LOCAL] Copying sentinel_gui.ps1 from working directory...
    copy "sentinel_gui.ps1" "%INSTALL_DIR%\sentinel_gui.ps1" >nul
) else if exist "backend\sentinel_gui.ps1" (
    echo [LOCAL] Copying sentinel_gui.ps1 from backend folder...
    copy "backend\sentinel_gui.ps1" "%INSTALL_DIR%\sentinel_gui.ps1" >nul
) else (
    echo [NETWORK] Downloading from SecureVault servers...
    powershell -Command "Invoke-WebRequest -Uri 'https://securevault-main.onrender.com/api/system-shield/gui-script' -OutFile '%INSTALL_DIR%\sentinel_gui.ps1' -UseBasicParsing -ErrorAction SilentlyContinue"
)

if not exist "%INSTALL_DIR%\sentinel_gui.ps1" (
    echo [ERROR] Could not retrieve sentinel_gui.ps1!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)
echo [OK] Core engine ready.

:: 2. Fetch Icon
echo [GHOST_SETUP] [2/3] Downloading Icon...

if exist "%~dp0logo.ico" (
    copy "%~dp0logo.ico" "%INSTALL_DIR%\logo.ico" >nul
) else if exist "public\securevault_logo.ico" (
    copy "public\securevault_logo.ico" "%INSTALL_DIR%\logo.ico" >nul
) else (
    powershell -Command "Invoke-WebRequest -Uri 'https://securevault-main.onrender.com/api/system-shield/icon' -OutFile '%INSTALL_DIR%\logo.ico' -UseBasicParsing -ErrorAction SilentlyContinue"
)

:: 3. Create a .bat launcher on Desktop (100% reliable, no PowerShell shortcut bugs)
echo [GHOST_SETUP] [3/3] Creating Desktop Launcher...

set "LAUNCHER=%USERPROFILE%\Desktop\SecureVault AI Antivirus.bat"

(
echo @echo off
echo powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%INSTALL_DIR%\sentinel_gui.ps1"
) > "%LAUNCHER%"

echo.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo !!  [SUCCESS] SECUREVAULT AI TOTAL PROTECTION INSTALLED   !!
echo !!  Launcher: 'SecureVault AI Antivirus.bat' on Desktop   !!
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo.
echo Launching the Antivirus Suite now...
start "" "%LAUNCHER%"
exit
