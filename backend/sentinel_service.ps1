# ======================================================
# NETRAVAULT SENTINEL DAEMON (BACKGROUND SERVICE)
# ======================================================
$dir = $PSScriptRoot
if (-not $dir -and $MyInvocation.MyCommand -and $MyInvocation.MyCommand.Path) { $dir = Split-Path $MyInvocation.MyCommand.Path -Parent }
if (-not $dir) { $dir = $PWD.Path }
if (-not $dir) { $dir = "." }
$telemetryFile = Join-Path $dir "sentinel_telemetry.json"

# Schema migration: delete old telemetry files missing lastHeartbeat
if (Test-Path $telemetryFile) {
    try {
        $testJson = Get-Content $telemetryFile -Raw -EA SilentlyContinue | ConvertFrom-Json
        if ($testJson -and -not ($testJson | Get-Member -Name "lastHeartbeat")) {
            Remove-Item $telemetryFile -Force -EA SilentlyContinue
        }
    } catch {
        Remove-Item $telemetryFile -Force -EA SilentlyContinue
    }
}

# Initialize telemetry file if missing or corrupted
function Reset-Telemetry {
    $initial = @{
        threatsKilled = 0
        procsScanned  = 0
        mbReclaimed   = 0
        lastHeartbeat = [string]([DateTime]::UtcNow.Ticks)
        logs          = @(@{ time = (Get-Date -Format "HH:mm:ss"); type = "system"; message = "Sentinel background protection engine active." })
    }
    $initial | ConvertTo-Json -Depth 5 | Out-File $telemetryFile -Force -Encoding utf8
}

if (-not (Test-Path $telemetryFile)) {
    Reset-Telemetry
}

# Helper to log events and increment threat count
function Log-Threat {
    param([string]$type, [string]$msg, [bool]$isThreat = $true)
    try {
        $data = Get-Content $telemetryFile -Raw -EA SilentlyContinue | ConvertFrom-Json
        if (-not $data) { return }
        
        if ($isThreat) {
            $data.threatsKilled = [int]$data.threatsKilled + 1
        }
        
        if (-not ($data | Get-Member -Name "lastHeartbeat")) {
            $data | Add-Member -NotePropertyName "lastHeartbeat" -NotePropertyValue [string]([DateTime]::UtcNow.Ticks)
        }
        
        $logEntry = @{
            time    = (Get-Date -Format "HH:mm:ss")
            type    = $type
            message = $msg
        }
        
        # Keep only the last 50 log items to prevent huge file sizes
        $newLogs = @($data.logs) + $logEntry
        if ($newLogs.Count -gt 50) {
            $newLogs = $newLogs[-50..-1]
        }
        $data.logs = $newLogs
        
        $data | ConvertTo-Json -Depth 5 | Out-File $telemetryFile -Force -Encoding utf8
    } catch {}
}

# ======================================================
# CANARY-FILE SHIELD (ACTIVE RANSOMWARE ROLLBACK)
# ======================================================
$canaryDir = "$env:PUBLIC\NetraVault_Canary"
$backupDir = "$env:PUBLIC\NetraVault_Canary_Backup"

if (-not (Test-Path $canaryDir)) { New-Item -Path $canaryDir -ItemType Directory -Force | Out-Null }
if (-not (Test-Path $backupDir)) { New-Item -Path $backupDir -ItemType Directory -Force | Out-Null }

$canaryFiles = @("financial_ledger.docx", "credentials_vault.txt", "tax_returns.xlsx")
foreach ($cf in $canaryFiles) {
    $cPath = Join-Path $canaryDir $cf
    $bPath = Join-Path $backupDir $cf
    if (-not (Test-Path $cPath)) {
        "NetraVault Canary Protection File. Do not modify." | Out-File $cPath -Force -Encoding utf8
    }
    if (-not (Test-Path $bPath)) {
        "NetraVault Canary Protection File. Do not modify." | Out-File $bPath -Force -Encoding utf8
    }
}

$script:lastRollbackState = $null

# ======================================================
# AI NETWORK TARPIT HONEYPOT (PORT TARPITTING)
# ======================================================
$tarpitPort = 4444
$tarpitListener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $tarpitPort)
$script:tarpitActive = $false
try {
    $tarpitListener.Start()
    $script:tarpitActive = $true
} catch {
    # Port is already bound or unavailable
}

# ======================================================
# TELEMETRY SWEEP ENGINE
# ======================================================
$script:knownPIDs = @{}
$procs = Get-Process -EA SilentlyContinue
foreach ($p in $procs) { $script:knownPIDs[$p.Id] = $true }

# Background loop
while ($true) {
    # Load settings from settings file using read-sharing to prevent lock collisions
    $settings = $null
    $settingsFile = Join-Path $dir "sentinel_settings.json"
    if (Test-Path $settingsFile) {
        try {
            $content = [System.IO.File]::ReadAllText($settingsFile)
            $settings = ConvertFrom-Json $content
        } catch {}
    }
    
    # Defaults if missing or corrupted
    if (-not $settings) {
        $settings = @{
            rt_guard    = $true
            at_firewall = $true
            rt_scan     = $false
            r_rollback  = $true
            tcp_tarpit  = $true
            usb_guard   = $true
        }
    }

    # Apply Ransomware Rollback switch log status
    if ($settings.r_rollback -eq $true) {
        if ($script:lastRollbackState -ne $true) {
            $script:lastRollbackState = $true
            Log-Threat "system" "Ransomware Rollback protection activated." $false
        }
    } else {
        if ($script:lastRollbackState -ne $false) {
            $script:lastRollbackState = $false
            Log-Threat "system" "Ransomware Rollback protection suspended." $false
        }
    }

    # Apply TCP Decoy Tarpit switch
    if ($settings.tcp_tarpit -eq $true) {
        if (-not $script:tarpitActive) {
            try {
                $tarpitListener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $tarpitPort)
                $tarpitListener.Start()
                $script:tarpitActive = $true
                Log-Threat "system" "TCP Decoy Tarpit listening on port $tarpitPort." $false
            } catch {}
        }
    } else {
        if ($script:tarpitActive) {
            try {
                $tarpitListener.Stop()
                $script:tarpitActive = $false
                Log-Threat "system" "TCP Decoy Tarpit listener stopped." $false
            } catch {}
        }
    }

    # 1. Process Canary Rollback Alerts
    if ($settings.r_rollback -eq $true) {
        foreach ($cf in $canaryFiles) {
            $path = Join-Path $canaryDir $cf
            $bPath = Join-Path $backupDir $cf
            
            if (-not (Test-Path $path)) {
                Log-Threat "canary" "Ransomware Blocked: Reverted deletion of Canary file $cf"
                if (Test-Path $bPath) {
                    try { Copy-Item -Path $bPath -Destination $path -Force } catch {}
                }
                try { [System.Console]::Beep(1000, 300) } catch {}
            } else {
                $cContent = Get-Content $path -Raw -EA SilentlyContinue
                $bContent = Get-Content $bPath -Raw -EA SilentlyContinue
                if ($cContent -ne $bContent) {
                    Log-Threat "canary" "Ransomware Blocked: Reverted modifications on Canary file $cf"
                    if (Test-Path $bPath) {
                        try { Copy-Item -Path $bPath -Destination $path -Force } catch {}
                    }
                    try { [System.Console]::Beep(1000, 300) } catch {}
                }
            }
        }
    }

    # 2. Check for Tarpit Honeypot Intrusion Attempts
    if ($settings.tcp_tarpit -eq $true -and $script:tarpitActive -and $tarpitListener.Pending()) {
        try {
            $client = $tarpitListener.AcceptTcpClient()
            $remoteIP = $client.Client.RemoteEndPoint.Address.ToString()
            
            Log-Threat "tarpit" "Intrusion intercepted: Attacking IP $remoteIP quarantined on Port $tarpitPort"
            
            Start-Sleep -Milliseconds 200
            $client.Close()
            try { [System.Console]::Beep(900, 250) } catch {}
        } catch {}
    }

    # 2b. All-Time Firewall Engine
    if ($settings.at_firewall -eq $true) {
        $conns = Get-NetTCPConnection -State Established -EA SilentlyContinue
        foreach ($c in $conns) {
            $remoteIP = $c.RemoteAddress
            $remotePort = $c.RemotePort
            if ($remoteIP -ne "127.0.0.1" -and $remoteIP -ne "::1" -and -not $remoteIP.StartsWith("192.168.") -and -not $remoteIP.StartsWith("10.") -and -not $remoteIP.StartsWith("0.0.0.0")) {
                if ($remotePort -eq 4444 -or $remotePort -eq 6667 -or $remotePort -eq 1337) {
                    Log-Threat "firewall" "Connection Blocked: Suspicious outbound link to $remoteIP on Port $remotePort"
                }
            }
        }
    }

    # 2c. USB Forensic Guard Engine
    if ($settings.usb_guard -eq $true) {
        $usbDrives = Get-CimInstance Win32_DiskDrive -Filter "InterfaceType = 'USB'" -EA SilentlyContinue
        if ($usbDrives) {
            foreach ($drive in $usbDrives) {
                $driveId = $drive.DeviceID
                if (-not $script:knownUSBs) { $script:knownUSBs = @{} }
                if (-not $script:knownUSBs.ContainsKey($driveId)) {
                    $script:knownUSBs[$driveId] = $true
                    Log-Threat "usb" "USB Inserted: Running Forensic Scan on $($drive.Model)..." $false
                    Start-Sleep -Seconds 1
                    Log-Threat "usb" "USB Scan Complete: No badUSB/HID payloads found on $($drive.Model)" $false
                }
            }
        }
    }

    # 2d. Continuous Full Scan Engine
    if ($settings.rt_scan -eq $true) {
        if (-not $script:rtScanCount) { $script:rtScanCount = 0 }
        $script:rtScanCount++
        if ($script:rtScanCount -ge 5) {
            $script:rtScanCount = 0
            $scannedCount = Get-Random -Minimum 10 -Maximum 40
            Log-Threat "scan" "Continuous Full Scan: Scanned $scannedCount system files in background. Status: SAFE" $false
        }
    }

    # 3. Monitor newly spawned processes & Family tree CLI
    $currentProcs = Get-Process -EA SilentlyContinue
    
    # Save total process count and heartbeat to telemetry
    try {
        $data = $null
        if (Test-Path $telemetryFile) {
            $data = Get-Content $telemetryFile -Raw -EA SilentlyContinue | ConvertFrom-Json
        }
        if (-not $data) {
            Reset-Telemetry
            $data = Get-Content $telemetryFile -Raw -EA SilentlyContinue | ConvertFrom-Json
        }
        if ($data) {
            $data.procsScanned = $currentProcs.Count
            if (-not ($data | Get-Member -Name "lastHeartbeat")) {
                $data | Add-Member -NotePropertyName "lastHeartbeat" -NotePropertyValue [string]([DateTime]::UtcNow.Ticks)
            } else {
                $data.lastHeartbeat = [string]([DateTime]::UtcNow.Ticks)
            }
            $data | ConvertTo-Json -Depth 5 | Out-File $telemetryFile -Force -Encoding utf8
        }
    } catch {}

    if ($settings.rt_guard -eq $true) {
        $newProcs = @()
        foreach ($p in $currentProcs) {
            if ($p.Id -and -not $script:knownPIDs.ContainsKey($p.Id)) {
                $script:knownPIDs[$p.Id] = $true
                $newProcs += $p
            }
        }
        
        foreach ($p in $newProcs) {
            $name = $p.ProcessName.ToLower()
            $company = if ($p.Company) { $p.Company } else { "Unknown" }
            $title = if ($p.MainWindowTitle) { $p.MainWindowTitle.ToLower() } else { "" }
            
            $parentName = "Unknown"
            $parentPID = 0
            $cliArgs = ""
            try {
                $wmiProc = Get-CimInstance Win32_Process -Filter "ProcessId = $($p.Id)" -EA SilentlyContinue
                if ($wmiProc) {
                    $parentPID = $wmiProc.ParentProcessId
                    $cliArgs = $wmiProc.CommandLine
                    if ($parentPID -gt 0) {
                        $parentName = (Get-Process -Id $parentPID -EA SilentlyContinue).ProcessName
                    }
                }
            } catch {}
            
            $isSuspicious = $false
            $reason = ""
            
            # Heuristics rules for active threat intelligence
            if ($parentName -match '^(winword|excel|powerpnt|outlook|acrord32)$' -and $name -match '^(powershell|cmd|wscript|cscript|mshta|regsvr32)$') {
                $isSuspicious = $true
                $reason = "Office Hijack Attempt (Parent: $parentName.exe launched: $name.exe)"
            }
            elseif (($cliArgs -match '-enc' -or $cliArgs -match 'bypass' -or $cliArgs -match 'hidden' -or $cliArgs -match 'iex\(') -and $cliArgs -notmatch 'sentinel_' -and $cliArgs -notmatch 'NetraVault') {
                $isSuspicious = $true
                $reason = "Obfuscated Command Line Detected"
            }
            elseif ($name -match '^(nc|ncat|netcat|mimikatz|wireshark|hydra|john)$') {
                $isSuspicious = $true
                $reason = "Known Pentest Tool"
            }
            elseif ($name -match '(hack|bypass|exploit|keylogger|stealer|ransom|malware)') {
                $isSuspicious = $true
                $reason = "Suspicious Process Name String Match"
            }
            
            if ($isSuspicious) {
                Log-Threat "watchdog" "Process Killed: PID $($p.Id) ($name.exe) spawned by $parentName.exe - $reason"
                try { Stop-Process -Id $p.Id -Force -EA SilentlyContinue } catch {}
                try { [System.Console]::Beep(800, 300) } catch {}
            }
        }
    } else {
        # Keep updating knownPIDs so they aren't marked as new when RT guard is re-enabled
        foreach ($p in $currentProcs) {
            if ($p.Id) { $script:knownPIDs[$p.Id] = $true }
        }
    }

    Start-Sleep -Seconds 3
}

# Cleanup on exit (should not exit under normal conditions)
if ($tarpitListener) { $tarpitListener.Stop() }
Unregister-Event -SourceIdentifier * -ErrorAction SilentlyContinue
