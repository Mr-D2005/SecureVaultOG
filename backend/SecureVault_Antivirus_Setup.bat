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
echo [GHOST_SETUP] [1/5] Fetching 6-Agent Core Engine...

if exist "%~dp0sentinel_gui.ps1" (
    echo [LOCAL] Copying sentinel_gui.ps1...
    copy "%~dp0sentinel_gui.ps1" "%INSTALL_DIR%\sentinel_gui.ps1" >nul
) else if exist "sentinel_gui.ps1" (
    echo [LOCAL] Copying sentinel_gui.ps1...
    copy "sentinel_gui.ps1" "%INSTALL_DIR%\sentinel_gui.ps1" >nul
) else if exist "backend\sentinel_gui.ps1" (
    echo [LOCAL] Copying sentinel_gui.ps1...
    copy "backend\sentinel_gui.ps1" "%INSTALL_DIR%\sentinel_gui.ps1" >nul
) else (
    echo [NETWORK] Downloading from SecureVault servers...
    powershell -Command "Invoke-WebRequest -Uri 'https://securevault-main.onrender.com/api/system-shield/gui-script' -OutFile '%INSTALL_DIR%\sentinel_gui.ps1' -UseBasicParsing -ErrorAction SilentlyContinue"
)

if not exist "%INSTALL_DIR%\sentinel_gui.ps1" (
    echo [ERROR] Could not retrieve sentinel_gui.ps1!
    pause
    exit /b 1
)

:: 2. Fetch Background Daemon Core
echo [GHOST_SETUP] [2/5] Fetching Persistent Protection Daemon...

if exist "%~dp0sentinel_service.ps1" (
    echo [LOCAL] Copying sentinel_service.ps1...
    copy "%~dp0sentinel_service.ps1" "%INSTALL_DIR%\sentinel_service.ps1" >nul
) else if exist "sentinel_service.ps1" (
    echo [LOCAL] Copying sentinel_service.ps1...
    copy "sentinel_service.ps1" "%INSTALL_DIR%\sentinel_service.ps1" >nul
) else if exist "backend\sentinel_service.ps1" (
    echo [LOCAL] Copying sentinel_service.ps1...
    copy "backend\sentinel_service.ps1" "%INSTALL_DIR%\sentinel_service.ps1" >nul
) else (
    echo [NETWORK] Downloading from SecureVault servers...
    powershell -Command "Invoke-WebRequest -Uri 'https://securevault-main.onrender.com/api/system-shield/service-script' -OutFile '%INSTALL_DIR%\sentinel_service.ps1' -UseBasicParsing -ErrorAction SilentlyContinue"
)

if not exist "%INSTALL_DIR%\sentinel_service.ps1" (
    echo [ERROR] Could not retrieve sentinel_service.ps1!
    pause
    exit /b 1
)

:: 3. Fetch Unified Launcher
echo [GHOST_SETUP] [3/5] Fetching Unified Launcher...

if exist "%~dp0sentinel_defender.bat" (
    echo [LOCAL] Copying sentinel_defender.bat...
    copy "%~dp0sentinel_defender.bat" "%INSTALL_DIR%\sentinel_defender.bat" >nul
) else if exist "sentinel_defender.bat" (
    echo [LOCAL] Copying sentinel_defender.bat...
    copy "sentinel_defender.bat" "%INSTALL_DIR%\sentinel_defender.bat" >nul
) else if exist "backend\sentinel_defender.bat" (
    echo [LOCAL] Copying sentinel_defender.bat...
    copy "backend\sentinel_defender.bat" "%INSTALL_DIR%\sentinel_defender.bat" >nul
) else (
    echo [NETWORK] Downloading from SecureVault servers...
    powershell -Command "Invoke-WebRequest -Uri 'https://securevault-main.onrender.com/api/system-shield/launcher-script' -OutFile '%INSTALL_DIR%\sentinel_defender.bat' -UseBasicParsing -ErrorAction SilentlyContinue"
)

if not exist "%INSTALL_DIR%\sentinel_defender.bat" (
    echo [ERROR] Could not retrieve sentinel_defender.bat!
    pause
    exit /b 1
)

:: 4. Fetch Icon
echo [GHOST_SETUP] [4/5] Downloading Icon...

if exist "%~dp0logo.ico" (
    copy "%~dp0logo.ico" "%INSTALL_DIR%\logo.ico" >nul
) else if exist "public\securevault_logo.ico" (
    copy "public\securevault_logo.ico" "%INSTALL_DIR%\logo.ico" >nul
) else (
    powershell -Command "Invoke-WebRequest -Uri 'https://securevault-main.onrender.com/api/system-shield/icon' -OutFile '%INSTALL_DIR%\logo.ico' -UseBasicParsing -ErrorAction SilentlyContinue"
)

:: 5. Create Desktop Launcher Batch File pointing to the Unified Launcher
echo [GHOST_SETUP] [5/5] Creating Desktop Launcher...

set "LAUNCHER=%USERPROFILE%\Desktop\SecureVault AI Antivirus.bat"

(
echo @echo off
echo cd /d "%INSTALL_DIR%"
echo start "" "sentinel_defender.bat"
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
