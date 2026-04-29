@echo off
echo ===================================================
echo     SECURE VAULT: MASTER IGNITION PROTOCOL v2
echo ===================================================

echo [CLEANUP] Terminating ghost processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1

timeout /t 2 /nobreak >nul

echo [1/3] Activating Python Cipher Core (Port 5002)...
start "Python Cipher Core" cmd /k "cd /d %~dp0backend && python encryption_core.py"

timeout /t 3 /nobreak >nul

echo [2/3] Activating Node Orchestrator (Port 5001)...
start "Node.js Gateway" cmd /k "cd /d %~dp0backend && node server.js"

timeout /t 3 /nobreak >nul

echo [3/3] Activating React Sentinel Interface (Port 5173)...
start "React UI" cmd /k "cd /d %~dp0 && npm run dev"

echo ===================================================
echo  ALL SYSTEMS ONLINE - VAULT IS ARMED
echo  Python  : http://localhost:5002
echo  Node.js  : http://localhost:5001
echo  Frontend : http://localhost:5173/SecureVault/
echo ===================================================
pause
