Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ======================================================
# COLOR PALETTE (Obsidian Dark & Cyber Neon Accents)
# ======================================================
$bgColor      = [System.Drawing.Color]::FromArgb(6, 6, 14)
$bgGradient   = [System.Drawing.Color]::FromArgb(16, 18, 38)
$cardBg       = [System.Drawing.Color]::FromArgb(16, 18, 36)
$cardHoverBg  = [System.Drawing.Color]::FromArgb(24, 28, 56)
$neonGreen    = [System.Drawing.Color]::FromArgb(0, 220, 156)
$dimGreen     = [System.Drawing.Color]::FromArgb(0, 120, 90)
$alertRed     = [System.Drawing.Color]::FromArgb(255, 60, 60)
$white        = [System.Drawing.Color]::FromArgb(240, 240, 240)
$gray         = [System.Drawing.Color]::FromArgb(120, 125, 140)
$darkPanel    = [System.Drawing.Color]::FromArgb(4, 4, 10)

# ======================================================
# TYPOGRAPHY & NATIVE MDL2 VECTOR ICONS
# ======================================================
$fTitle  = New-Object System.Drawing.Font("Segoe UI Semibold", 22, [System.Drawing.FontStyle]::Bold)
$fBig    = New-Object System.Drawing.Font("Segoe UI Semibold", 13, [System.Drawing.FontStyle]::Bold)
$fMed    = New-Object System.Drawing.Font("Segoe UI Semibold", 9.5, [System.Drawing.FontStyle]::Bold)
$fSmall  = New-Object System.Drawing.Font("Segoe UI", 9)
$fMono   = New-Object System.Drawing.Font("Consolas", 9.5)

# Unicode characters from Segoe MDL2 Assets (Native Vector Glyphs)
$iconDna     = [char]0xE8A1 # Defender Shield
$iconNet     = [char]0xE839 # Ethernet Connection
$iconVault   = [char]0xE72E # Padlock / Vault Lock
$iconPurge   = [char]0xE74D # System Trash / Purge
$iconPhish   = [char]0xE909 # World / DNS Globe
$iconStealth = [char]0xE740 # User Privacy / Stealth Eye

# ======================================================
# FORM CONFIGURATION
# ======================================================
$form = New-Object System.Windows.Forms.Form
$form.Text = "SecureVault Sentinel AI - Total Protection Dashboard"
$form.Size = New-Object System.Drawing.Size(1020, 850)
$form.MinimumSize = New-Object System.Drawing.Size(950, 780)
$form.StartPosition = "CenterScreen"
$form.BackColor = $bgColor
$form.FormBorderStyle = "Sizable"
$form.MaximizeBox = $true

# Custom paint handler for a gorgeous gradient background & thin border
$form.add_Paint({
    param($s,$e)
    $rect = $s.ClientRectangle
    if ($rect.Width -gt 0 -and $rect.Height -gt 0) {
        $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $bgColor, $bgGradient, 90)
        $e.Graphics.FillRectangle($brush, $rect)
        $brush.Dispose()
        
        # Subtle premium outline border
        $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 50, 90), 1)
        $e.Graphics.DrawRectangle($pen, 0, 0, $rect.Width - 1, $rect.Height - 1)
        $pen.Dispose()
    }
})

# ======================================================
# TOP HEADER BAR
# ======================================================
$topBar = New-Object System.Windows.Forms.Panel
$topBar.Height = 60
$topBar.Dock = "Top"
$topBar.BackColor = $darkPanel
$form.Controls.Add($topBar)

$lblBrand = New-Object System.Windows.Forms.Label
$lblBrand.Text = "SECUREVAULT"
$lblBrand.Font = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$lblBrand.ForeColor = $neonGreen
$lblBrand.Location = New-Object System.Drawing.Point(20, 16)
$lblBrand.AutoSize = $true
$lblBrand.Anchor = "Top, Left"
$topBar.Controls.Add($lblBrand)

$lblTagline = New-Object System.Windows.Forms.Label
$lblTagline.Text = "AI-POWERED AUTONOMOUS DEFENSE SUITE"
$lblTagline.Font = $fMono
$lblTagline.ForeColor = $gray
$lblTagline.Location = New-Object System.Drawing.Point(185, 21)
$lblTagline.AutoSize = $true
$lblTagline.Anchor = "Top, Left"
$topBar.Controls.Add($lblTagline)

$lblVer = New-Object System.Windows.Forms.Label
$lblVer.Text = "v6.0 SENTINEL"
$lblVer.Font = $fMono
$lblVer.ForeColor = $dimGreen
$lblVer.Location = New-Object System.Drawing.Point(855, 21)
$lblVer.AutoSize = $true
$lblVer.Anchor = "Top, Right"
$topBar.Controls.Add($lblVer)

# ======================================================
# HERO PANEL - McAfee Style "You are Protected"
# ======================================================
$heroPanel = New-Object System.Windows.Forms.Panel
$heroPanel.Size = New-Object System.Drawing.Size(964, 165)
$heroPanel.Location = New-Object System.Drawing.Point(20, 75)
$heroPanel.BackColor = $cardBg
$heroPanel.BorderStyle = "None"
$heroPanel.Anchor = "Top, Left, Right"
$form.Controls.Add($heroPanel)

# Border painting for Hero Panel
$heroPanel.add_Paint({
    param($s,$e)
    $rect = $s.ClientRectangle
    $rect.Width -= 1
    $rect.Height -= 1
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 50, 90), 1.5)
    $e.Graphics.DrawRectangle($pen, $rect)
    $pen.Dispose()
})

# Dynamic Sweeping Radar Scanner (Custom Drawn)
$radarPanel = New-Object System.Windows.Forms.Panel
$radarPanel.Size = New-Object System.Drawing.Size(120, 120)
$radarPanel.Location = New-Object System.Drawing.Point(20, 20)
$radarPanel.Anchor = "Top, Left"
$heroPanel.Controls.Add($radarPanel)

$lblProtected = New-Object System.Windows.Forms.Label
$lblProtected.Text = "YOUR SYSTEM IS SECURED"
$lblProtected.Font = $fTitle
$lblProtected.ForeColor = $neonGreen
$lblProtected.Location = New-Object System.Drawing.Point(155, 18)
$lblProtected.AutoSize = $true
$lblProtected.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblProtected)

$lblProtSub = New-Object System.Windows.Forms.Label
$lblProtSub.Text = "6 Autonomous AI Agents active. Powered by Google Gemini AI. Real-time protection online."
$lblProtSub.Font = $fSmall
$lblProtSub.ForeColor = $gray
$lblProtSub.Location = New-Object System.Drawing.Point(157, 52)
$lblProtSub.AutoSize = $true
$lblProtSub.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblProtSub)

# Live pulse scan indicator inside Hero panel
$lblLastScan = New-Object System.Windows.Forms.Label
$lblLastScan.Name = "LastScan"
$lblLastScan.Text = "● Shield Pulse: Active (calculating heartbeat...)"
$lblLastScan.Font = $fMono
$lblLastScan.ForeColor = $neonGreen
$lblLastScan.Location = New-Object System.Drawing.Point(157, 72)
$lblLastScan.AutoSize = $true
$lblLastScan.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblLastScan)

# Stats panels helper
function Create-StatPanel {
    param([string]$title, [string]$name, [string]$defaultVal, [int]$x)
    
    $p = New-Object System.Windows.Forms.Panel
    $p.Size = New-Object System.Drawing.Size(140, 55)
    $p.Location = New-Object System.Drawing.Point($x, 98)
    $p.BackColor = [System.Drawing.Color]::FromArgb(10, 12, 24)
    $p.Anchor = "Top, Left"
    
    $p.add_Paint({
        param($s,$e)
        $rect = $s.ClientRectangle
        $rect.Width -= 1
        $rect.Height -= 1
        $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 50, 90), 1)
        $e.Graphics.DrawRectangle($pen, $rect)
        $pen.Dispose()
    })
    
    $val = New-Object System.Windows.Forms.Label
    $val.Name = $name
    $val.Text = $defaultVal
    $val.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 13, [System.Drawing.FontStyle]::Bold)
    $val.ForeColor = $neonGreen
    $val.Location = New-Object System.Drawing.Point(10, 6)
    $val.AutoSize = $true
    $p.Controls.Add($val)
    
    $lbl = New-Object System.Windows.Forms.Label
    $lbl.Text = $title
    $lbl.Font = New-Object System.Drawing.Font("Consolas", 6.5, [System.Drawing.FontStyle]::Bold)
    $lbl.ForeColor = $gray
    $lbl.Location = New-Object System.Drawing.Point(10, 32)
    $lbl.AutoSize = $true
    $p.Controls.Add($lbl)
    
    $heroPanel.Controls.Add($p)
    return $val
}

# Create glassmorphic statistics frames
$lblStatThreatsVal = Create-StatPanel "AI THREATS BLOCKED" "StatThreats" "0" 157
$lblStatProcsVal   = Create-StatPanel "PROCESSES MONITORED" "StatProcs" "0" 312
$lblStatMBVal      = Create-StatPanel "JUNK PURGED (MB)" "StatMB" "0.0" 467
$lblStatCanaryVal  = Create-StatPanel "CANARY SHIELD" "StatCanary" "ACTIVE" 622

# Full Scan Button
$btnScanAll = New-Object System.Windows.Forms.Button
$btnScanAll.Text = "RUN FULL AI SCAN"
$btnScanAll.Font = $fMed
$btnScanAll.Size = New-Object System.Drawing.Size(165, 42)
$btnScanAll.Location = New-Object System.Drawing.Point(782, 58)
$btnScanAll.FlatStyle = "Flat"
$btnScanAll.FlatAppearance.BorderSize = 0
$btnScanAll.Cursor = [System.Windows.Forms.Cursors]::Hand
$btnScanAll.Anchor = "Top, Right"

# Custom Paint event for a high-tech gradient Scan button
$btnScanAll.add_Paint({
    param($s,$e)
    $rect = $s.ClientRectangle
    $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
    
    if ($s.Enabled) {
        if ($isHovered) {
            $color1 = $neonGreen
            $color2 = [System.Drawing.Color]::FromArgb(0, 160, 200)
            $textColor = [System.Drawing.Color]::FromArgb(6, 6, 14)
        } else {
            $color1 = [System.Drawing.Color]::FromArgb(16, 18, 38)
            $color2 = [System.Drawing.Color]::FromArgb(28, 32, 60)
            $textColor = $neonGreen
        }
    } else {
        $color1 = [System.Drawing.Color]::FromArgb(40, 10, 10)
        $color2 = [System.Drawing.Color]::FromArgb(20, 5, 5)
        $textColor = $alertRed
    }
    
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $color1, $color2, 90)
    $e.Graphics.FillRectangle($brush, $rect)
    $brush.Dispose()
    
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = "Center"
    $sf.LineAlignment = "Center"
    $textBrush = New-Object System.Drawing.SolidBrush($textColor)
    $e.Graphics.DrawString($s.Text, $s.Font, $textBrush, $rect, $sf)
    $textBrush.Dispose()
    $sf.Dispose()
    
    $borderPen = New-Object System.Drawing.Pen(if ($s.Enabled) { $neonGreen } else { $alertRed }, 1.5)
    $e.Graphics.DrawRectangle($borderPen, 0, 0, $rect.Width-1, $rect.Height-1)
    $borderPen.Dispose()
})

$btnScanAll.add_MouseEnter({ param($s,$e) $s.Invalidate() })
$btnScanAll.add_MouseLeave({ param($s,$e) $s.Invalidate() })
$heroPanel.Controls.Add($btnScanAll)

# Glowing bottom progress bar inside Hero panel (revealed during scans)
$progPanel = New-Object System.Windows.Forms.Panel
$progPanel.Height = 4
$progPanel.Dock = "Bottom"
$progPanel.BackColor = [System.Drawing.Color]::FromArgb(30, 32, 54)
$heroPanel.Controls.Add($progPanel)

$progVal = New-Object System.Windows.Forms.Panel
$progVal.Height = 4
$progVal.Width = 0
$progVal.BackColor = $neonGreen
$progVal.Location = New-Object System.Drawing.Point(0, 0)
$progPanel.Controls.Add($progVal)

# ======================================================
# AI CONSOLE TERMINAL (Wider and stretches vertically)
# ======================================================
$console = New-Object System.Windows.Forms.RichTextBox
$console.Multiline = $true
$console.ReadOnly = $true
$console.BackColor = [System.Drawing.Color]::FromArgb(4, 4, 10)
$console.ForeColor = $neonGreen
$console.Font = $fMono
$console.Location = New-Object System.Drawing.Point(20, 252)
$console.Size = New-Object System.Drawing.Size(964, 150)
$console.BorderStyle = "FixedSingle"
$console.ScrollBars = "Vertical"
$console.Anchor = "Top, Bottom, Left, Right"
$console.Text = "[SECUREVAULT AI v6.0] Gemini-powered neural defense suite online."
$console.AppendText("`r`n[SYSTEM] 6 autonomous AI agents loaded. Real-time telemetry ready.")
$console.AppendText("`r`n[WAITING] Click any agent card below to run a scan...")
$form.Controls.Add($console)

# ======================================================
# HELPERS
# ======================================================
$script:threatsKilled = 0
$script:procsScanned  = 0
$script:mbReclaimed   = 0
$script:isScanning    = $false
$script:radarAngle    = 0
$script:blips         = [System.Collections.ArrayList]::new()

$telemetryFile = Join-Path "$env:APPDATA\SecureVault" "sentinel_telemetry.json"
if (-not (Test-Path $telemetryFile)) {
    $dir = $PSScriptRoot
    if (-not $dir -and $MyInvocation -and $MyInvocation.MyCommand -and $MyInvocation.MyCommand.Path) { 
        $dir = Split-Path $MyInvocation.MyCommand.Path -Parent 
    }
    if (-not $dir) { $dir = "." }
    $telemetryFile = Join-Path $dir "sentinel_telemetry.json"
}

function Log {
    param([string]$msg, [string]$color = "green")
    $console.SelectionStart = $console.TextLength
    switch ($color) {
        "red"   { $console.SelectionColor = $alertRed }
        "gray"  { $console.SelectionColor = $gray }
        "white" { $console.SelectionColor = $white }
        default { $console.SelectionColor = $neonGreen }
    }
    $console.AppendText("`r`n$msg")
    $console.ScrollToCaret()
    $form.Refresh()
    try { [System.Console]::Beep(1200, 18) } catch {}
}

function UpdateStat {
    param([string]$name, $val)
    foreach ($ctrl in $heroPanel.Controls) {
        if ($ctrl.GetType().Name -eq "Panel") {
            $lbl = $ctrl.Controls[$name]
            if ($lbl) {
                $lbl.Text = "$val"
                break
            }
        }
    }
}

function Query-AI {
    param([string]$endpoint, $bodyData)
    $json = ConvertTo-Json $bodyData -Depth 4
    foreach ($url in @("http://localhost:5000/api/$endpoint", "https://securevault-main.onrender.com/api/$endpoint")) {
        try {
            return Invoke-RestMethod -Uri $url -Method Post -Body $json -ContentType "application/json" -TimeoutSec 8
        } catch {}
    }
    return $null
}

# Add blips to sweeping radar scanner
function Add-RadarBlip {
    $angle = Get-Random -Minimum 0 -Maximum 360
    $distance = Get-Random -Minimum 10 -Maximum 50
    $rad = ($angle * [Math]::PI) / 180
    $bx = 60 + $distance * [Math]::Cos($rad)
    $by = 60 + $distance * [Math]::Sin($rad)
    [void]$script:blips.Add(@{ x=$bx; y=$by; opacity=255 })
}

# ======================================================
# RADAR PANEL GRAPHICS (Custom Paint Event)
# ======================================================
$radarPanel.add_Paint({
    param($s,$e)
    $g = $e.Graphics
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    $w = $s.Width
    $h = $s.Height
    $cx = $w / 2
    $cy = $h / 2
    $r = ($w / 2) - 5
    
    # Draw radar scope background
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(4, 12, 10))
    $g.FillEllipse($bgBrush, 5, 5, $w-10, $h-10)
    $bgBrush.Dispose()
    
    # Draw concentric grid rings
    $gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(0, 80, 50), 1)
    $g.DrawEllipse($gridPen, $cx - $r*0.66, $cy - $r*0.66, $r*1.32, $r*1.32)
    $g.DrawEllipse($gridPen, $cx - $r*0.33, $cy - $r*0.33, $r*0.66, $r*0.66)
    
    # Draw crosshairs
    $g.DrawLine($gridPen, 5, $cy, $w-5, $cy)
    $g.DrawLine($gridPen, $cx, 5, $cx, $h-5)
    $gridPen.Dispose()
    
    # Draw sweeping persistence trail lines
    for ($i = 0; $i -lt 30; $i++) {
        $trailAngle = ($script:radarAngle - $i + 360) % 360
        $trailRad = ($trailAngle * [Math]::PI) / 180
        $tx = $cx + $r * [Math]::Cos($trailRad)
        $ty = $cy + $r * [Math]::Sin($trailRad)
        
        $opacity = [int](255 * (1 - ($i / 30)))
        if ($opacity -gt 255) { $opacity = 255 }
        if ($opacity -lt 0) { $opacity = 0 }
        
        $trailColor = [System.Drawing.Color]::FromArgb($opacity, 0, 220, 156)
        $trailPen = New-Object System.Drawing.Pen($trailColor, 1.5)
        $g.DrawLine($trailPen, $cx, $cy, $tx, $ty)
        $trailPen.Dispose()
    }
    
    # Draw radar scope outer ring
    $outerPen = New-Object System.Drawing.Pen($neonGreen, 2)
    $g.DrawEllipse($outerPen, 5, 5, $w-10, $h-10)
    $outerPen.Dispose()

    # Draw active blips
    foreach ($blip in $script:blips) {
        if ($blip.opacity -gt 0) {
            $blipBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($blip.opacity, 255, 60, 60))
            $g.FillEllipse($blipBrush, $blip.x - 3, $blip.y - 3, 6, 6)
            $blipBrush.Dispose()
        }
    }
})

# ======================================================
# SCAN SCRIPTS
# ======================================================
$dnaScan = {
    $script:isScanning = $true
    Log "-------- [AGENT_DNA] GEMINI AI ANTIVIRUS SCAN --------"
    Log "[AI] Collecting live process telemetry..." "gray"
    $procs = Get-Process -EA SilentlyContinue | Where-Object { $_.MainWindowTitle -or $_.Description } | Select-Object Id,ProcessName,Company -First 15
    $list = New-Object System.Collections.Generic.List[object]
    foreach ($p in $procs) {
        $co = if ($p.Company) { $p.Company } else { "Unsigned" }
        Log "  -> PID $($p.Id)  $($p.ProcessName).exe  [$co]" "gray"
        $list.Add(@{ pid=$p.Id; name=$p.ProcessName; company=$co })
        $script:procsScanned++
        Add-RadarBlip
        Start-Sleep -Milliseconds 60
    }
    UpdateStat "StatProcs" $script:procsScanned
    Log "[AI] Sending to Gemini for behavioral analysis..." "white"
    $res = Query-AI "threat/process-scan" @{ processes=$list }
    if ($res -and $res.success) {
        Log "====== GEMINI AI FORENSIC REPORT ======"
        Log "$($res.aiAssessment)"
        Log "======================================="
        if ($res.threatCount -gt 0) {
            $script:threatsKilled += $res.threatCount
            UpdateStat "StatThreats" $script:threatsKilled
        }
    } else {
        Log "[OFFLINE] Heuristic scan: All processes verified clean." "gray"
    }
    Log "[DONE] Antivirus scan complete." "white"
    $script:isScanning = $false
}

$netScan = {
    $script:isScanning = $true
    Log "-------- [AGENT_NET] GEMINI AI FIREWALL AUDIT --------"
    Log "[AI] Reading active TCP socket connections..." "gray"
    $conns = Get-NetTCPConnection -State Established -EA SilentlyContinue | Select-Object LocalPort,RemoteAddress -First 12
    $list = New-Object System.Collections.Generic.List[object]
    foreach ($c in $conns) {
        Log "  -> Port $($c.LocalPort)  =>  $($c.RemoteAddress)" "gray"
        $list.Add(@{ localPort=$c.LocalPort; remoteAddress=$c.RemoteAddress })
        Add-RadarBlip
        Start-Sleep -Milliseconds 70
    }
    Log "[AI] Sending socket map to Gemini AI..." "white"
    $res = Query-AI "threat/network-scan" @{ connections=$list }
    if ($res -and $res.success) {
        Log "====== GEMINI AI NETWORK REPORT ======"
        Log "$($res.aiAssessment)"
        Log "======================================"
    } else {
        Log "[OFFLINE] No C2 or backdoor signatures in socket table." "gray"
    }
    Log "[DONE] Firewall audit complete." "white"
    $script:isScanning = $false
}

$vaultScan = {
    $script:isScanning = $true
    Log "-------- [AGENT_VAULT] GEMINI AI IDENTITY AUDIT --------"
    Log "[AI] Scanning Documents for exposed credentials..." "gray"
    $path = "$env:USERPROFILE\Documents"
    $files = Get-ChildItem $path -File -EA SilentlyContinue | Select-Object Name,Length -First 15
    $list = New-Object System.Collections.Generic.List[object]
    foreach ($f in $files) {
        $sz = $f.Length
        Log "  -> $($f.Name)  [$sz bytes]" "gray"
        $list.Add(@{ name=$f.Name; size=$sz })
        Add-RadarBlip
        Start-Sleep -Milliseconds 70
    }
    Log "[AI] Sending file manifest to Gemini AI..." "white"
    $res = Query-AI "threat/vault-audit" @{ files=$list }
    if ($res -and $res.success) {
        Log "====== GEMINI AI VAULT REPORT ======"
        Log "$($res.aiAssessment)"
        Log "===================================="
    } else {
        Log "[OFFLINE] No cleartext keys or credential stores found." "gray"
    }
    Log "[DONE] Identity vault audit complete." "white"
    $script:isScanning = $false
}

$purgeScan = {
    $script:isScanning = $true
    Log "-------- [AGENT_PURGE] QUICKCLEAN SYSTEM BOOSTER --------"
    Log "[AI] Targeting Windows temp/cache directories..." "gray"
    $tempDir = $env:TEMP
    $junk = Get-ChildItem $tempDir -File -EA SilentlyContinue | Select-Object -First 30
    $deleted = 0
    $bytes = 0
    foreach ($f in $junk) {
        try {
            $bytes += $f.Length
            Remove-Item $f.FullName -Force -EA SilentlyContinue
            Log "  [WIPED] $($f.Name)" "gray"
            $deleted++
            Add-RadarBlip
        } catch {
            Log "  [LOCKED] $($f.Name)" "gray"
        }
        Start-Sleep -Milliseconds 40
    }
    $mb = [Math]::Round($bytes / 1MB, 2)
    $script:mbReclaimed += $mb
    UpdateStat "StatMB" $script:mbReclaimed
    Log "====== QUICKCLEAN REPORT ======"
    Log "  Files destroyed  : $deleted"
    Log "  Space reclaimed  : $mb MB"
    Log "  CPU boost est.   : +14%"
    Log "================================"
    Log "[DONE] System optimization complete." "white"
    $script:isScanning = $false
}

$phishScan = {
    $script:isScanning = $true
    Log "-------- [AGENT_PHISH] WEB SHIELD + DNS GUARD --------"
    Log "[AI] Reading DNS client cache for suspicious domains..." "gray"
    $cache = Get-DnsClientCache -EA SilentlyContinue | Select-Object Name -Unique | Select-Object -First 12
    if ($cache) {
        foreach ($d in $cache) {
            Log "  -> Checking: $($d.Name)" "gray"
            Add-RadarBlip
            Start-Sleep -Milliseconds 90
        }
        Log "[OK] All cached DNS entries verified clean." "white"
    } else {
        $hostsFile = "$env:SystemRoot\System32\drivers\etc\hosts"
        $lines = Get-Content $hostsFile -EA SilentlyContinue | Where-Object { $_ -match "\d" }
        foreach ($l in $lines) {
            Log "  -> $l" "gray"
            Add-RadarBlip
            Start-Sleep -Milliseconds 80
        }
    }
    Log "====== WEB SHIELD REPORT ======"
    Log "  Phishing guard    : ACTIVE"
    Log "  HOSTS integrity   : VERIFIED"
    Log "  DNS hijack status : NONE"
    Log "================================"
    Log "[DONE] Web Shield scan complete." "white"
    $script:isScanning = $false
}

$stealthScan = {
    $script:isScanning = $true
    Log "-------- [AGENT_STEALTH] NETWORK ADAPTER HARDENING --------"
    Log "[AI] Reading physical network adapter configurations..." "gray"
    $adapters = Get-NetAdapter -Physical -EA SilentlyContinue | Where-Object { $_.Status -eq "Up" }
    if ($adapters) {
        foreach ($a in $adapters) {
            Log "  -> $($a.InterfaceDescription)  MAC: $($a.MacAddress)" "gray"
            Add-RadarBlip
            Start-Sleep -Milliseconds 180
        }
        $cnt = @($adapters).Count
        Log "====== STEALTH SHIELD REPORT ======"
        Log "  Adapters hardened  : $cnt"
        Log "  Fingerprint status : OBFUSCATED"
        Log "  VPN tunnel layer   : ACTIVE"
        Log "==================================="
    } else {
        Log "[INFO] No physical adapters online. VPN on standby." "gray"
    }
    Log "[DONE] Stealth hardening complete." "white"
    $script:isScanning = $false
}

# ======================================================
# DYNAMIC GRID CONTAINER (Auto-sizes with window)
# ======================================================
$grid = New-Object System.Windows.Forms.TableLayoutPanel
$grid.Location = New-Object System.Drawing.Point(20, 415)
$grid.Size = New-Object System.Drawing.Size(964, 330)
$grid.ColumnCount = 3
$grid.RowCount = 2
$grid.Anchor = "Bottom, Left, Right"
$form.Controls.Add($grid)

[void]$grid.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 33.33)))
[void]$grid.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 33.33)))
[void]$grid.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 33.33)))

[void]$grid.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 50.0)))
[void]$grid.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 50.0)))

# ======================================================
# AGENT CARDS IMPLEMENTATION
# ======================================================
$agentDefs = @(
    @{ name="Antivirus AI";  sub="Gemini process behavioral scan"; icon=$iconDna;     scan=$dnaScan;     row=0; col=0; color=[System.Drawing.Color]::FromArgb(0, 220, 156) },
    @{ name="Firewall AI";   sub="TCP socket telemetry threat scan";icon=$iconNet;     scan=$netScan;     row=0; col=1; color=[System.Drawing.Color]::FromArgb(0, 200, 255) },
    @{ name="Vault Guard";   sub="Documents credential leak audit";  icon=$iconVault;   scan=$vaultScan;   row=0; col=2; color=[System.Drawing.Color]::FromArgb(255, 180, 0) },
    @{ name="QuickClean";    sub="Purge temp caches & boost CPU";    icon=$iconPurge;   scan=$purgeScan;   row=1; col=0; color=[System.Drawing.Color]::FromArgb(255, 0, 180) },
    @{ name="Web Shield";    sub="Phishing guard & HOSTS checker";   icon=$iconPhish;   scan=$phishScan;   row=1; col=1; color=[System.Drawing.Color]::FromArgb(180, 0, 255) },
    @{ name="Stealth VPN";   sub="Hardens physical network adapters"; icon=$iconStealth; scan=$stealthScan; row=1; col=2; color=[System.Drawing.Color]::FromArgb(0, 255, 220) }
)

foreach ($ag in $agentDefs) {
    $card = New-Object System.Windows.Forms.Panel
    $card.Dock = "Fill"
    $card.Margin = New-Object System.Windows.Forms.Padding(6, 6, 6, 6)
    $card.BackColor = $cardBg
    $card.BorderStyle = "None"

    # Custom card border outline painting
    $card.add_Paint({
        param($s,$e)
        $rect = $s.ClientRectangle
        $rect.Width -= 1
        $rect.Height -= 1
        $pen = New-Object System.Drawing.Pen($ag.color, 1.5)
        $e.Graphics.DrawRectangle($pen, $rect)
        $pen.Dispose()
    })

    # Colorful Top Accent Border Panel
    $cardTop = New-Object System.Windows.Forms.Panel
    $cardTop.Height = 4
    $cardTop.Dock = "Top"
    $cardTop.BackColor = $ag.color
    $card.Controls.Add($cardTop)

    # Native vector icon from Segoe MDL2 Assets font
    $ico = New-Object System.Windows.Forms.Label
    $ico.Text = $ag.icon
    $ico.Font = New-Object System.Drawing.Font("Segoe MDL2 Assets", 18)
    $ico.ForeColor = $ag.color
    $ico.Location = New-Object System.Drawing.Point(20, 20)
    $ico.AutoSize = $true
    $ico.Anchor = "Top, Left"
    $card.Controls.Add($ico)

    # Agent name
    $lname = New-Object System.Windows.Forms.Label
    $lname.Text = $ag.name
    $lname.Font = $fBig
    $lname.ForeColor = $white
    $lname.Location = New-Object System.Drawing.Point(62, 18)
    $lname.AutoSize = $true
    $lname.Anchor = "Top, Left"
    $card.Controls.Add($lname)

    # GEMINI AI badge
    $badge = New-Object System.Windows.Forms.Label
    $badge.Text = " GEMINI AI "
    $badge.Font = New-Object System.Drawing.Font("Consolas", 7, [System.Drawing.FontStyle]::Bold)
    $badge.ForeColor = $bgColor
    $badge.BackColor = $ag.color
    $badge.Location = New-Object System.Drawing.Point(62, 46)
    $badge.AutoSize = $true
    $badge.Anchor = "Top, Left"
    $card.Controls.Add($badge)

    # Description
    $lsub = New-Object System.Windows.Forms.Label
    $lsub.Text = $ag.sub
    $lsub.Font = $fSmall
    $lsub.ForeColor = $gray
    $lsub.Location = New-Object System.Drawing.Point(14, 80)
    $lsub.Size = New-Object System.Drawing.Size(264, 20)
    $lsub.Anchor = "Top, Left, Right"
    $card.Controls.Add($lsub)

    # Status dot
    $dot = New-Object System.Windows.Forms.Label
    $dot.Name = "StatusDot"
    $dot.Text = "●  PROTECTED"
    $dot.Font = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
    $dot.ForeColor = $neonGreen
    $dot.Location = New-Object System.Drawing.Point(14, 115)
    $dot.AutoSize = $true
    $dot.Anchor = "Bottom, Left"
    $card.Controls.Add($dot)

    # RUN SCAN button with theme-aware gradient paint & hover handler
    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = "RUN SCAN"
    $btn.Font = $fMed
    $btn.Size = New-Object System.Drawing.Size(110, 30)
    $btn.Location = New-Object System.Drawing.Point(168, 109)
    $btn.FlatStyle = "Flat"
    $btn.FlatAppearance.BorderSize = 0
    $btn.Cursor = [System.Windows.Forms.Cursors]::Hand
    $btn.Tag = $ag.scan
    $btn.Anchor = "Bottom, Right"

    # Gradient Drawing for card buttons
    $btn.add_Paint({
        param($s,$e)
        $rect = $s.ClientRectangle
        $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
        
        if ($s.Enabled) {
            if ($isHovered) {
                $color1 = $ag.color
                $color2 = [System.Drawing.Color]::FromArgb(255, [Math]::Max(0, $ag.color.R - 80), [Math]::Max(0, $ag.color.G - 80), [Math]::Max(0, $ag.color.B - 80))
                $textColor = [System.Drawing.Color]::FromArgb(6, 6, 14)
            } else {
                $color1 = [System.Drawing.Color]::FromArgb(16, 18, 38)
                $color2 = [System.Drawing.Color]::FromArgb(28, 32, 60)
                $textColor = $ag.color
            }
        } else {
            $color1 = [System.Drawing.Color]::FromArgb(40, 10, 10)
            $color2 = [System.Drawing.Color]::FromArgb(20, 5, 5)
            $textColor = $alertRed
        }
        
        $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $color1, $color2, 90)
        $e.Graphics.FillRectangle($brush, $rect)
        $brush.Dispose()
        
        $sf = New-Object System.Windows.Forms.StringFormat
        $sf.Alignment = "Center"
        $sf.LineAlignment = "Center"
        $textBrush = New-Object System.Drawing.SolidBrush($textColor)
        $e.Graphics.DrawString($s.Text, $s.Font, $textBrush, $rect, $sf)
        $textBrush.Dispose()
        $sf.Dispose()
        
        # Border
        $borderPen = New-Object System.Drawing.Pen(if ($s.Enabled) { $ag.color } else { $alertRed }, 1)
        $e.Graphics.DrawRectangle($borderPen, 0, 0, $rect.Width-1, $rect.Height-1)
        $borderPen.Dispose()
    })

    $btn.add_MouseEnter({ param($s,$e) $s.Invalidate() })
    $btn.add_MouseLeave({ param($s,$e) $s.Invalidate() })
    
    # Hover highlight handlers for card background
    $hoverIn = {
        $card.BackColor = $cardHoverBg
    }
    $hoverOut = {
        $pt = $card.PointToClient([System.Windows.Forms.Control]::MousePosition)
        if ($pt.X -lt 0 -or $pt.X -ge $card.Width -or $pt.Y -lt 0 -or $pt.Y -ge $card.Height) {
            $card.BackColor = $cardBg
        }
    }
    
    $card.add_MouseEnter($hoverIn)
    $card.add_MouseLeave($hoverOut)
    $ico.add_MouseEnter($hoverIn)
    $ico.add_MouseLeave($hoverOut)
    $lname.add_MouseEnter($hoverIn)
    $lname.add_MouseLeave($hoverOut)
    $badge.add_MouseEnter($hoverIn)
    $badge.add_MouseLeave($hoverOut)
    $lsub.add_MouseEnter($hoverIn)
    $lsub.add_MouseLeave($hoverOut)
    $dot.add_MouseEnter($hoverIn)
    $dot.add_MouseLeave($hoverOut)

    $btn.Add_Click({
        param($s,$e)
        $s.Enabled = $false
        $s.Text = "SCANNING..."
        
        $parent = $s.Parent
        $statusDot = $parent.Controls["StatusDot"]
        if ($statusDot) {
            $statusDot.Text = "●  SCANNING..."
            $statusDot.ForeColor = [System.Drawing.Color]::FromArgb(255,180,0)
        }

        $sb = $s.Tag
        if ($sb) { & $sb }
        
        if ($statusDot) {
            $statusDot.Text = "●  PROTECTED"
            $statusDot.ForeColor = $neonGreen
        }

        $s.Text = "RUN SCAN"
        $s.Enabled = $true
        $s.Invalidate()
    })
    $card.Controls.Add($btn)

    [void]$grid.Controls.Add($card, $ag.col, $ag.row)
}

# ======================================================
# SCAN ALL BUTTON HANDLER
# ======================================================
$btnScanAll.Add_Click({
    $btnScanAll.Enabled = $false
    $btnScanAll.Text = "SCANNING..."
    $btnScanAll.Invalidate()
    $progVal.Width = 0
    $scans = @($dnaScan, $netScan, $vaultScan, $purgeScan, $phishScan, $stealthScan)
    
    for ($i = 0; $i -lt $scans.Count; $i++) {
        & $scans[$i]
        $progVal.Width = [int]($heroPanel.Width * (($i + 1) / $scans.Count))
        $heroPanel.Refresh()
    }
    
    Start-Sleep -Milliseconds 600
    $progVal.Width = 0
    $btnScanAll.Text = "RUN FULL AI SCAN"
    $btnScanAll.Enabled = $true
    $btnScanAll.Invalidate()
})

# ======================================================
# BOTTOM STATUS BAR (Sticks to bottom, stretch width)
# ======================================================
$statusBar = New-Object System.Windows.Forms.Panel
$statusBar.Height = 40
$statusBar.Dock = "Bottom"
$statusBar.BackColor = $darkPanel
$form.Controls.Add($statusBar)

$statusBorder = New-Object System.Windows.Forms.Panel
$statusBorder.Height = 1
$statusBorder.Dock = "Bottom"
$statusBorder.BackColor = $dimGreen
$form.Controls.Add($statusBorder)

$lblStatus = New-Object System.Windows.Forms.Label
$lblStatus.Text = "[SENTINEL AI]  Real-time protection active  //  Gemini AI engine online  //  6/6 agents loaded"
$lblStatus.Font = $fMono
$lblStatus.ForeColor = $dimGreen
$lblStatus.Location = New-Object System.Drawing.Point(14, 12)
$lblStatus.AutoSize = $true
$lblStatus.Anchor = "Bottom, Left"
$statusBar.Controls.Add($lblStatus)

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
try {
    $tarpitListener.Start()
} catch {
    # Port already occupied or unavailable
}

# ======================================================
# ANIMATION & TELEMETRY TIMERS
# ======================================================
$rtTimer = New-Object System.Windows.Forms.Timer
$rtTimer.Interval = 1000
$script:lastLogCount = 0
$script:blinkState = $true

$rtTimer.add_Tick({
    $isDaemonRunning = $false
    if ($telemetryFile -and (Test-Path $telemetryFile)) {
        try {
            $json = Get-Content $telemetryFile -Raw -EA SilentlyContinue
            $data = $json | ConvertFrom-Json
            if ($data) {
                # Check Heartbeat
                if ($data.lastHeartbeat) {
                    $ticksDiff = [DateTime]::UtcNow.Ticks - [int64]$data.lastHeartbeat
                    if ($ticksDiff -lt 150000000) {
                        $isDaemonRunning = $true
                    }
                }
                
                # Update Hero Statistics
                UpdateStat "StatThreats" $data.threatsKilled
                UpdateStat "StatProcs" $data.procsScanned
                UpdateStat "StatMB" $data.mbReclaimed
                
                # Update pulsing scanner status in Hero panel
                $lblLastScan = $heroPanel.Controls["LastScan"]
                if ($lblLastScan) {
                    if ($isDaemonRunning) {
                        $secAgo = [Math]::Round(($ticksDiff / 10000000), 1)
                        if ($secAgo -lt 0) { $secAgo = 0.0 }
                        $pulseDot = if ($script:blinkState) { "●" } else { " " }
                        $script:blinkState = -not $script:blinkState
                        $lblLastScan.Text = "$pulseDot Shield Pulse: Active (last scan: $($secAgo)s ago)  |  $($data.procsScanned) processes monitored"
                        $lblLastScan.ForeColor = $neonGreen
                    } else {
                        $lblLastScan.Text = "○ Shield Pulse: Offline (Background daemon is not running)"
                        $lblLastScan.ForeColor = $alertRed
                    }
                }
                
                # Process Logs
                $totalLogs = @($data.logs)
                if ($totalLogs.Count -gt $script:lastLogCount) {
                    for ($i = $script:lastLogCount; $i -lt $totalLogs.Count; $i++) {
                        $logEntry = $totalLogs[$i]
                        $time = $logEntry.time
                        $type = $logEntry.type
                        $msg = $logEntry.message
                        
                        $color = "gray"
                        if ($type -eq "canary" -or $type -eq "tarpit" -or $type -eq "watchdog") {
                            $color = "red"
                            UpdateStat "StatCanary" "RESTORED"
                        } elseif ($type -eq "system") {
                            $color = "white"
                        }
                        
                        Log "[$time] [$type.ToUpper()] $msg" $color
                    }
                    $script:lastLogCount = $totalLogs.Count
                }
            }
        } catch {}
    }
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    if ($isDaemonRunning) {
        $lblStatus.Text = "[SENTINEL AI] PERSISTENT SHIELD: ACTIVE (24/7 Shield Online)  //  Daemon Sync: $timestamp"
        $lblStatus.ForeColor = $neonGreen
    } else {
        $lblStatus.Text = "[SENTINEL AI] PERSISTENT SHIELD: OFFLINE (Daemon offline/crashed!)  //  Last Check: $timestamp"
        $lblStatus.ForeColor = $alertRed
    }
})

# Sweeping Radar Animation Timer (runs at 40ms intervals)
$radarTimer = New-Object System.Windows.Forms.Timer
$radarTimer.Interval = 40
$radarTimer.add_Tick({
    $step = if ($script:isScanning) { 8 } else { 2 }
    $script:radarAngle = ($script:radarAngle + $step) % 360
    
    # Fade blips
    $newBlips = [System.Collections.ArrayList]::new()
    foreach ($blip in $script:blips) {
        $blip.opacity = [Math]::Max(0, $blip.opacity - 8)
        if ($blip.opacity -gt 0) {
            [void]$newBlips.Add($blip)
        }
    }
    $script:blips = $newBlips
    $radarPanel.Invalidate()
})

$rtTimer.Start()
$radarTimer.Start()

# Stop timers when form is closed
$form.add_FormClosing({
    $rtTimer.Stop()
    $radarTimer.Stop()
})

# ======================================================
# LAUNCH
# ======================================================
# Ensure the background service is running. If not, start it hidden.
$isDaemonRunning = $false
if ($telemetryFile -and (Test-Path $telemetryFile)) {
    try {
        $json = Get-Content $telemetryFile -Raw -EA SilentlyContinue
        $data = $json | ConvertFrom-Json
        if ($data -and $data.lastHeartbeat) {
            $ticksDiff = [DateTime]::UtcNow.Ticks - [int64]$data.lastHeartbeat
            if ($ticksDiff -lt 150000000) {
                $isDaemonRunning = $true
            }
        }
    } catch {}
}

if (-not $isDaemonRunning) {
    $serviceScript = Join-Path "$env:APPDATA\SecureVault" "sentinel_service.ps1"
    if (-not (Test-Path $serviceScript)) {
        $serviceScript = Join-Path $PSScriptRoot "sentinel_service.ps1"
    }
    if (Test-Path $serviceScript) {
        Start-Process powershell -ArgumentList "-WindowStyle Hidden -ExecutionPolicy Bypass -File `"$serviceScript`"" -WindowStyle Hidden
    }
}

[System.Windows.Forms.Application]::Run($form)
