$installDir = "$env:APPDATA\SecureVault"
$desktopPath = "$env:USERPROFILE\Desktop\SecureVault AI Antivirus.lnk"
$iconPath = "$installDir\logo.ico"

# Rebuild the shortcut WITHOUT -WindowStyle Hidden so errors are visible
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($desktopPath)
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$installDir\sentinel_gui.ps1`""
$Shortcut.WorkingDirectory = $installDir
if (Test-Path $iconPath) { $Shortcut.IconLocation = $iconPath }
$Shortcut.Save()

Write-Host "[OK] Shortcut rebuilt: $desktopPath" -ForegroundColor Green
Write-Host "[OK] Script path: $installDir\sentinel_gui.ps1" -ForegroundColor Green
Write-Host ""
Write-Host "Now launching the GUI to verify it works..." -ForegroundColor Cyan
Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$installDir\sentinel_gui.ps1`""
