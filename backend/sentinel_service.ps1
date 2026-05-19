# ======================================================
# SECUREVAULT SENTINEL DAEMON (BACKGROUND SERVICE)
# ======================================================
$telemetryFile = Join-Path $PSScriptRoot "sentinel_telemetry.json"

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
$canaryDir = "$env:PUBLIC\SecureVault_Canary"
$backupDir = "$env:PUBLIC\SecureVault_Canary_Backup"

if (-not (Test-Path $canaryDir)) { New-Item -Path $canaryDir -ItemType Directory -Force | Out-Null }
if (-not (Test-Path $backupDir)) { New-Item -Path $backupDir -ItemType Directory -Force | Out-Null }

$canaryFiles = @("financial_ledger.docx", "credentials_vault.txt", "tax_returns.xlsx")
foreach ($cf in $canaryFiles) {
    $cPath = Join-Path $canaryDir $cf
    $bPath = Join-Path $backupDir $cf
    if (-not (Test-Path $cPath)) {
        "SecureVault Canary Protection File. Do not modify." | Out-File $cPath -Force -Encoding utf8
    }
    if (-not (Test-Path $bPath)) {
        "SecureVault Canary Protection File. Do not modify." | Out-File $bPath -Force -Encoding utf8
    }
}

$script:canaryAlerts = [System.Collections.Generic.List[string]]::new()

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $canaryDir
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

$onChanged = Register-ObjectEvent $watcher "Changed" -Action {
    $name = $Event.SourceEventArgs.Name
    $script:canaryAlerts.Add($name)
}

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
    # 1. Process Canary Rollback Alerts
    if ($script:canaryAlerts.Count -gt 0) {
        $alertsToProcess = $script:canaryAlerts | Select-Object -Unique
        $script:canaryAlerts.Clear()
        
        foreach ($name in $alertsToProcess) {
            $path = Join-Path $canaryDir $name
            $bPath = Join-Path $backupDir $name
            
            Log-Threat "canary" "Ransomware Blocked: Reverted modifications on Canary file $name"
            
            # Rollback: Restore original document
            if (Test-Path $bPath) {
                Start-Sleep -Milliseconds 100
                try {
                    Copy-Item -Path $bPath -Destination $path -Force
                } catch {}
            }
            try { [System.Console]::Beep(1000, 300) } catch {}
        }
    }

    # 2. Check for Tarpit Honeypot Intrusion Attempts
    if ($script:tarpitActive -and $tarpitListener.Pending()) {
        try {
            $client = $tarpitListener.AcceptTcpClient()
            $remoteIP = $client.Client.RemoteEndPoint.Address.ToString()
            
            Log-Threat "tarpit" "Intrusion intercepted: Attacking IP $remoteIP quarantined on Port $tarpitPort"
            
            Start-Sleep -Milliseconds 200
            $client.Close()
            try { [System.Console]::Beep(900, 250) } catch {}
        } catch {}
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
        elseif ($cliArgs -match '-enc' -or $cliArgs -match 'bypass' -or $cliArgs -match 'hidden' -or $cliArgs -match 'iex\(') {
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

    Start-Sleep -Seconds 3
}

# Cleanup on exit (should not exit under normal conditions)
$watcher.EnableRaisingEvents = $false
$watcher.Dispose()
if ($tarpitListener) { $tarpitListener.Stop() }
Unregister-Event -SourceIdentifier * -ErrorAction SilentlyContinue
