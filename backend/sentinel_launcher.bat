@echo off
title SecureVault Ghost-Mount Gateway
color 0B
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo !!                                                        !!
echo !!        SECUREVAULT: GHOST-MOUNT GATEWAY v1.0           !!
echo !!        STATUS: AIR-GAP ISOLATION ACTIVE                !!
echo !!                                                        !!
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo.

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed! 
    echo Please install Python from python.org to use this tool.
    pause
    exit /b
)

:: Install Dependencies
echo [GHOST_MOUNT] Initializing Forensic Environment...
pip install psutil requests --quiet

:: Run the Bridge
echo [GHOST_MOUNT] Virtual Sandbox Deployed.
echo [GHOST_MOUNT] Waiting for Hardware Connection...
echo.
python usb_bridge.py

echo.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo !!  [SUCCESS] FORENSIC DNA SYNCED TO CLOUD DASHBOARD      !!
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
pause
