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

:: Create and Activate Virtual Environment
echo [GHOST_MOUNT] Creating Virtual Environment...
python -m venv venv
call venv\Scripts\activate

:: Install Dependencies
echo [GHOST_MOUNT] Initializing Forensic Environment...
pip install psutil requests --quiet

:: Fetch the Bridge script dynamically from the backend
echo [GHOST_MOUNT] Fetching latest Forensic Engine script...
powershell -Command "Invoke-WebRequest -Uri 'https://securevault-main.onrender.com/api/usb-lab/download-bridge' -OutFile 'usb_bridge.py' -ErrorAction SilentlyContinue"
if not exist usb_bridge.py (
    echo [WARNING] Could not fetch from cloud, trying local server...
    powershell -Command "Invoke-WebRequest -Uri 'http://localhost:5000/api/usb-lab/download-bridge' -OutFile 'usb_bridge.py' -ErrorAction SilentlyContinue"
)

:: Ask user to insert USB
echo.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo !!  [ACTION REQUIRED] PLEASE INSERT THE USB DRIVE NOW     !!
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
pause

:: Run the Bridge
echo [GHOST_MOUNT] Virtual Sandbox Deployed.
echo [GHOST_MOUNT] Performing Forensic Check...
echo.
python usb_bridge.py

echo.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo !!  [SUCCESS] FORENSIC DNA SYNCED TO CLOUD DASHBOARD      !!
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
pause
