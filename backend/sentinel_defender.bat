@echo off
title NetraVault Total AI Protection Launcher
:: Change directory to the folder containing this batch script
cd /d "%~dp0"

:: 1. Ensure the background service is running. If not, launch it in hidden mode
tasklist /V /FI "IMAGENAME eq powershell.exe" 2>NUL | find /I "NetraVault_Sentinel_Daemon" >NUL
if "%ERRORLEVEL%" neq "0" (
    echo [SYSTEM] Starting NetraVault Background Protection Daemon...
    start "NetraVault_Sentinel_Daemon" /min powershell -WindowStyle Hidden -ExecutionPolicy Bypass -Command "$Host.UI.RawUI.WindowTitle='NetraVault_Sentinel_Daemon'; & '%~dp0sentinel_service.ps1'"
)

:: 2. Launch the interactive GUI Dashboard
echo [SYSTEM] Launching NetraVault Total AI Protection GUI...
powershell -STA -ExecutionPolicy Bypass -File sentinel_gui.ps1
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Sentinel GUI failed to launch or exited with error code %ERRORLEVEL%.
    pause
)
exit
