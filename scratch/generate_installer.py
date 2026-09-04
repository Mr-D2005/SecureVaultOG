import base64
import os

def get_base64_chunks(filepath):
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found!")
        return None
    with open(filepath, 'rb') as f:
        data = f.read()
    b64 = base64.b64encode(data).decode('utf-8')
    # Chunk into 70 characters per line
    return [b64[i:i+70] for i in range(0, len(b64), 70)]

def main():
    gui_chunks = get_base64_chunks("backend/sentinel_gui.ps1")
    service_chunks = get_base64_chunks("backend/sentinel_service.ps1")
    icon_chunks = get_base64_chunks("public/netravault_logo.ico")

    if not all([gui_chunks, service_chunks, icon_chunks]):
        return

    # Prepare chunks formatted for batch writing
    def format_chunks(chunks):
        return "\n".join([f"echo {chunk}" for chunk in chunks])

    gui_block = format_chunks(gui_chunks)
    service_block = format_chunks(service_chunks)
    icon_block = format_chunks(icon_chunks)

    # Create the self-contained installer content
    installer_template = f"""@echo off
title NetraVault AI Total Protection Setup
color 0B
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo !!                                                        !!
echo !!        NETRAVAULT: AI TOTAL DEFENSE SETUP             !!
echo !!        STATUS: COGNITIVE SYSTEM SEEDING ACTIVE         !!
echo !!                                                        !!
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo.

set "INSTALL_DIR=%APPDATA%\\NetraVault"
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

echo [GHOST_SETUP] Stopping running protection daemons...
powershell -Command "Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {{ $_.CommandLine -match 'sentinel_service.ps1' -or $_.CommandLine -match 'sentinel_gui.ps1' }} | ForEach-Object {{ Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }}" >nul 2>&1

echo [GHOST_SETUP] Initializing filesystem handles...
echo [GHOST_SETUP] Target directory: %INSTALL_DIR%
echo.

:: 1. Write Base64 payloads to temporary text files
echo [GHOST_SETUP] Preparing payload decoders...

(
{gui_block}
) > "%INSTALL_DIR%\\gui.b64"

(
{service_block}
) > "%INSTALL_DIR%\\service.b64"

(
{icon_block}
) > "%INSTALL_DIR%\\icon.b64"

:: 2. Decode files using PowerShell
echo [GHOST_SETUP] Unpacking 6-Agent Core Engine...
powershell -Command "$b64 = (Get-Content '%INSTALL_DIR%\\gui.b64') -join ''; [System.IO.File]::WriteAllBytes('%INSTALL_DIR%\\sentinel_gui.ps1', [System.Convert]::FromBase64String($b64))"

echo [GHOST_SETUP] Unpacking Persistent Protection Daemon...
powershell -Command "$b64 = (Get-Content '%INSTALL_DIR%\\service.b64') -join ''; [System.IO.File]::WriteAllBytes('%INSTALL_DIR%\\sentinel_service.ps1', [System.Convert]::FromBase64String($b64))"

echo [GHOST_SETUP] Unpacking Branding Assets...
powershell -Command "$b64 = (Get-Content '%INSTALL_DIR%\\icon.b64') -join ''; [System.IO.File]::WriteAllBytes('%INSTALL_DIR%\\logo.ico', [System.Convert]::FromBase64String($b64))"

:: 3. Clean up base64 temp files
del /q "%INSTALL_DIR%\\*.b64" >nul 2>&1

:: 4. Create robust .bat Launcher on Desktop
echo [GHOST_SETUP] Creating Desktop Launcher...
del /f /q "%USERPROFILE%\\Desktop\\NetraVault AI Antivirus.lnk" >nul 2>&1

(
echo @echo off
echo powershell.exe -WindowStyle Hidden -STA -ExecutionPolicy Bypass -File "%%APPDATA%%\NetraVault\sentinel_gui.ps1"
) > "%USERPROFILE%\\Desktop\\NetraVault AI Antivirus.bat"

echo.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo !!  [SUCCESS] NETRAVAULT AI TOTAL PROTECTION INSTALLED   !!
echo !!  Launcher: 'NetraVault AI Antivirus' Shortcut on Desktop!!
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo.
echo Launching the Antivirus Suite now...
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $WshShell.Run('powershell.exe -WindowStyle Hidden -STA -ExecutionPolicy Bypass -File \"' + $env:APPDATA + '\\NetraVault\\sentinel_gui.ps1\"', 0, $false)"
exit
"""

    with open("backend/NetraVault_Antivirus_Setup.bat", "w", newline="\r\n") as f:
        f.write(installer_template)
    print("Self-contained setup batch file generated successfully at backend/NetraVault_Antivirus_Setup.bat")

if __name__ == "__main__":
    main()
