@echo off
title SecureVault Total AI Protection Launcher
:: Hide the terminal and launch the GUI
echo [SYSTEM] Launching SecureVault Total AI Protection...
powershell -ExecutionPolicy Bypass -File sentinel_gui.ps1
exit
