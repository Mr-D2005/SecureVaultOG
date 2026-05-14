@echo off
title SecureVault Sentinel Vanguard Launcher
echo --------------------------------------------------
echo [SECUREVAULT] Initializing Sentinel Vanguard...
echo --------------------------------------------------

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed! 
    echo Please install Python from python.org to use this tool.
    pause
    exit /b
)

:: Install Dependencies
echo [SYSTEM] Checking dependencies (psutil, requests)...
pip install psutil requests --quiet

:: Run the Bridge
echo [SENTINEL] Starting Exhaustive Hardware Audit...
echo [SENTINEL] Scanning and Correcting USB threats...
python usb_bridge.py

echo --------------------------------------------------
echo [COMPLETE] Forensic data synced to SecureVault Cloud.
echo --------------------------------------------------
pause
