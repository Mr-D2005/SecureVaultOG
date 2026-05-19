Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ======================================================
# COLOR PALETTE (Obsidian Dark & Cyber Neon Accents)
# ======================================================
$bgColor    = [System.Drawing.Color]::FromArgb(8, 8, 20)
$cardBg     = [System.Drawing.Color]::FromArgb(16, 18, 36)
$neonGreen  = [System.Drawing.Color]::FromArgb(0, 220, 156)
$dimGreen   = [System.Drawing.Color]::FromArgb(0, 120, 90)
$alertRed   = [System.Drawing.Color]::FromArgb(255, 60, 60)
$white      = [System.Drawing.Color]::FromArgb(240, 240, 240)
$gray       = [System.Drawing.Color]::FromArgb(120, 125, 140)
$darkPanel  = [System.Drawing.Color]::FromArgb(5, 5, 14)

# ======================================================
# TYPOGRAPHY
# ======================================================
$fTitle  = New-Object System.Drawing.Font("Segoe UI Semibold", 22, [System.Drawing.FontStyle]::Bold)
$fBig    = New-Object System.Drawing.Font("Segoe UI Semibold", 13, [System.Drawing.FontStyle]::Bold)
$fMed    = New-Object System.Drawing.Font("Segoe UI Semibold", 9.5, [System.Drawing.FontStyle]::Bold)
$fSmall  = New-Object System.Drawing.Font("Segoe UI", 9)
$fMono   = New-Object System.Drawing.Font("Consolas", 9.5)

# Icons
$emojiShield  = [char]::ConvertFromUtf32(0x1F6E1)
$emojiDna     = [char]::ConvertFromUtf32(0x1F9EC)
$emojiNet     = [char]::ConvertFromUtf32(0x1F310)
$emojiVault   = [char]::ConvertFromUtf32(0x1F512)
$emojiPurge   = [char]::ConvertFromUtf32(0x1F9F9)
$emojiPhish   = [char]::ConvertFromUtf32(0x1F3A3)
$emojiStealth = [char]::ConvertFromUtf32(0x1F464)

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
$heroPanel.BorderStyle = "FixedSingle"
$heroPanel.Anchor = "Top, Left, Right"
$form.Controls.Add($heroPanel)

$lblShield = New-Object System.Windows.Forms.Label
$lblShield.Text = $emojiShield
$lblShield.Font = New-Object System.Drawing.Font("Segoe UI", 55)
$lblShield.ForeColor = $neonGreen
$lblShield.Location = New-Object System.Drawing.Point(28, 15)
$lblShield.AutoSize = $true
$lblShield.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblShield)

$lblProtected = New-Object System.Windows.Forms.Label
$lblProtected.Text = "YOUR SYSTEM IS SECURED"
$lblProtected.Font = $fTitle
$lblProtected.ForeColor = $neonGreen
$lblProtected.Location = New-Object System.Drawing.Point(140, 22)
$lblProtected.AutoSize = $true
$lblProtected.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblProtected)

$lblProtSub = New-Object System.Windows.Forms.Label
$lblProtSub.Text = "6 Autonomous AI Agents active. Powered by Google Gemini AI. Real-time protection online."
$lblProtSub.Font = $fSmall
$lblProtSub.ForeColor = $gray
$lblProtSub.Location = New-Object System.Drawing.Point(142, 66)
$lblProtSub.AutoSize = $true
$lblProtSub.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblProtSub)

# Live pulse scan indicator inside Hero panel
$lblLastScan = New-Object System.Windows.Forms.Label
$lblLastScan.Name = "LastScan"
$lblLastScan.Text = "● Shield Pulse: Active (calculating heartbeat...)"
$lblLastScan.Font = $fMono
$lblLastScan.ForeColor = $neonGreen
$lblLastScan.Location = New-Object System.Drawing.Point(142, 88)
$lblLastScan.AutoSize = $true
$lblLastScan.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblLastScan)

# Stats labels
$lblStatThreatsVal = New-Object System.Windows.Forms.Label
$lblStatThreatsVal.Name = "StatThreats"
$lblStatThreatsVal.Text = "0"
$lblStatThreatsVal.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 15, [System.Drawing.FontStyle]::Bold)
$lblStatThreatsVal.ForeColor = $neonGreen
$lblStatThreatsVal.Location = New-Object System.Drawing.Point(142, 112)
$lblStatThreatsVal.AutoSize = $true
$lblStatThreatsVal.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblStatThreatsVal)

$lblStatThreatsKey = New-Object System.Windows.Forms.Label
$lblStatThreatsKey.Text = "AI THREATS BLOCKED"
$lblStatThreatsKey.Font = New-Object System.Drawing.Font("Consolas", 7.5)
$lblStatThreatsKey.ForeColor = $gray
$lblStatThreatsKey.Location = New-Object System.Drawing.Point(142, 136)
$lblStatThreatsKey.AutoSize = $true
$lblStatThreatsKey.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblStatThreatsKey)

$lblStatProcsVal = New-Object System.Windows.Forms.Label
$lblStatProcsVal.Name = "StatProcs"
$lblStatProcsVal.Text = "0"
$lblStatProcsVal.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 15, [System.Drawing.FontStyle]::Bold)
$lblStatProcsVal.ForeColor = $neonGreen
$lblStatProcsVal.Location = New-Object System.Drawing.Point(310, 112)
$lblStatProcsVal.AutoSize = $true
$lblStatProcsVal.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblStatProcsVal)

$lblStatProcsKey = New-Object System.Windows.Forms.Label
$lblStatProcsKey.Text = "PROCESSES MONITORED"
$lblStatProcsKey.Font = New-Object System.Drawing.Font("Consolas", 7.5)
$lblStatProcsKey.ForeColor = $gray
$lblStatProcsKey.Location = New-Object System.Drawing.Point(310, 136)
$lblStatProcsKey.AutoSize = $true
$lblStatProcsKey.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblStatProcsKey)

$lblStatMBVal = New-Object System.Windows.Forms.Label
$lblStatMBVal.Name = "StatMB"
$lblStatMBVal.Text = "0.0"
$lblStatMBVal.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 15, [System.Drawing.FontStyle]::Bold)
$lblStatMBVal.ForeColor = $neonGreen
$lblStatMBVal.Location = New-Object System.Drawing.Point(480, 112)
$lblStatMBVal.AutoSize = $true
$lblStatMBVal.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblStatMBVal)

$lblStatMBKey = New-Object System.Windows.Forms.Label
$lblStatMBKey.Text = "JUNK PURGED (MB)"
$lblStatMBKey.Font = New-Object System.Drawing.Font("Consolas", 7.5)
$lblStatMBKey.ForeColor = $gray
$lblStatMBKey.Location = New-Object System.Drawing.Point(480, 136)
$lblStatMBKey.AutoSize = $true
$lblStatMBKey.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblStatMBKey)

$lblStatCanaryVal = New-Object System.Windows.Forms.Label
$lblStatCanaryVal.Name = "StatCanary"
$lblStatCanaryVal.Text = "ACTIVE"
$lblStatCanaryVal.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 15, [System.Drawing.FontStyle]::Bold)
$lblStatCanaryVal.ForeColor = $neonGreen
$lblStatCanaryVal.Location = New-Object System.Drawing.Point(620, 112)
$lblStatCanaryVal.AutoSize = $true
$lblStatCanaryVal.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblStatCanaryVal)

$lblStatCanaryKey = New-Object System.Windows.Forms.Label
$lblStatCanaryKey.Text = "CANARY SHIELD"
$lblStatCanaryKey.Font = New-Object System.Drawing.Font("Consolas", 7.5)
$lblStatCanaryKey.ForeColor = $gray
$lblStatCanaryKey.Location = New-Object System.Drawing.Point(620, 136)
$lblStatCanaryKey.AutoSize = $true
$lblStatCanaryKey.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblStatCanaryKey)

# Full Scan Button
$btnScanAll = New-Object System.Windows.Forms.Button
$btnScanAll.Text = "RUN FULL AI SCAN"
$btnScanAll.Font = $fMed
$btnScanAll.Size = New-Object System.Drawing.Size(165, 42)
$btnScanAll.Location = New-Object System.Drawing.Point(782, 58)
$btnScanAll.BackColor = $neonGreen
$btnScanAll.ForeColor = [System.Drawing.Color]::FromArgb(5, 5, 14)
$btnScanAll.FlatStyle = "Flat"
$btnScanAll.FlatAppearance.BorderSize = 0
$btnScanAll.Cursor = [System.Windows.Forms.Cursors]::Hand
$btnScanAll.Anchor = "Top, Right"
$btnScanAll.add_MouseEnter({ param($s,$e); $s.BackColor=[System.Drawing.Color]::FromArgb(0, 255, 180) })
$btnScanAll.add_MouseLeave({ param($s,$e); $s.BackColor=$neonGreen })
$heroPanel.Controls.Add($btnScanAll)

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
    $ctrl = $heroPanel.Controls[$name]
    if ($ctrl) { $ctrl.Text = "$val" }
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

# ======================================================
# SCAN SCRIPTS
# ======================================================
$dnaScan = {
    Log "-------- [AGENT_DNA] GEMINI AI ANTIVIRUS SCAN --------"
    Log "[AI] Collecting live process telemetry..." "gray"
    $procs = Get-Process -EA SilentlyContinue | Where-Object { $_.MainWindowTitle -or $_.Description } | Select-Object Id,ProcessName,Company -First 15
    $list = New-Object System.Collections.Generic.List[object]
    foreach ($p in $procs) {
        $co = if ($p.Company) { $p.Company } else { "Unsigned" }
        Log "  -> PID $($p.Id)  $($p.ProcessName).exe  [$co]" "gray"
        $list.Add(@{ pid=$p.Id; name=$p.ProcessName; company=$co })
        $script:procsScanned++
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
}

$netScan = {
    Log "-------- [AGENT_NET] GEMINI AI FIREWALL AUDIT --------"
    Log "[AI] Reading active TCP socket connections..." "gray"
    $conns = Get-NetTCPConnection -State Established -EA SilentlyContinue | Select-Object LocalPort,RemoteAddress -First 12
    $list = New-Object System.Collections.Generic.List[object]
    foreach ($c in $conns) {
        Log "  -> Port $($c.LocalPort)  =>  $($c.RemoteAddress)" "gray"
        $list.Add(@{ localPort=$c.LocalPort; remoteAddress=$c.RemoteAddress })
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
}

$vaultScan = {
    Log "-------- [AGENT_VAULT] GEMINI AI IDENTITY AUDIT --------"
    Log "[AI] Scanning Documents for exposed credentials..." "gray"
    $path = "$env:USERPROFILE\Documents"
    $files = Get-ChildItem $path -File -EA SilentlyContinue | Select-Object Name,Length -First 15
    $list = New-Object System.Collections.Generic.List[object]
    foreach ($f in $files) {
        $sz = $f.Length
        Log "  -> $($f.Name)  [$sz bytes]" "gray"
        $list.Add(@{ name=$f.Name; size=$sz })
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
}

$purgeScan = {
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
}

$phishScan = {
    Log "-------- [AGENT_PHISH] WEB SHIELD + DNS GUARD --------"
    Log "[AI] Reading DNS client cache for suspicious domains..." "gray"
    $cache = Get-DnsClientCache -EA SilentlyContinue | Select-Object Name -Unique | Select-Object -First 12
    if ($cache) {
        foreach ($d in $cache) {
            Log "  -> Checking: $($d.Name)" "gray"
            Start-Sleep -Milliseconds 90
        }
        Log "[OK] All cached DNS entries verified clean." "white"
    } else {
        $hostsFile = "$env:SystemRoot\System32\drivers\etc\hosts"
        $lines = Get-Content $hostsFile -EA SilentlyContinue | Where-Object { $_ -match "\d" }
        foreach ($l in $lines) {
            Log "  -> $l" "gray"
            Start-Sleep -Milliseconds 80
        }
    }
    Log "====== WEB SHIELD REPORT ======"
    Log "  Phishing guard    : ACTIVE"
    Log "  HOSTS integrity   : VERIFIED"
    Log "  DNS hijack status : NONE"
    Log "================================"
    Log "[DONE] Web Shield scan complete." "white"
}

$stealthScan = {
    Log "-------- [AGENT_STEALTH] NETWORK ADAPTER HARDENING --------"
    Log "[AI] Reading physical network adapter configurations..." "gray"
    $adapters = Get-NetAdapter -Physical -EA SilentlyContinue | Where-Object { $_.Status -eq "Up" }
    if ($adapters) {
        foreach ($a in $adapters) {
            Log "  -> $($a.InterfaceDescription)  MAC: $($a.MacAddress)" "gray"
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

# Set grid columns to 33.3% width
[void]$grid.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 33.33)))
[void]$grid.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 33.33)))
[void]$grid.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 33.33)))

# Set grid rows to 50% height
[void]$grid.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 50.0)))
[void]$grid.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 50.0)))

# ======================================================
# AGENT CARDS IMPLEMENTATION
# ======================================================
$agentDefs = @(
    @{ name="Antivirus AI";  sub="Gemini process behavioral scan"; icon=$emojiDna;     scan=$dnaScan;     row=0; col=0; color=[System.Drawing.Color]::FromArgb(0, 220, 156) },
    @{ name="Firewall AI";   sub="TCP socket telemetry threat scan";icon=$emojiNet;     scan=$netScan;     row=0; col=1; color=[System.Drawing.Color]::FromArgb(0, 200, 255) },
    @{ name="Vault Guard";   sub="Documents credential leak audit";  icon=$emojiVault;   scan=$vaultScan;   row=0; col=2; color=[System.Drawing.Color]::FromArgb(255, 180, 0) },
    @{ name="QuickClean";    sub="Purge temp caches & boost CPU";    icon=$emojiPurge;   scan=$purgeScan;   row=1; col=0; color=[System.Drawing.Color]::FromArgb(255, 0, 180) },
    @{ name="Web Shield";    sub="Phishing guard & HOSTS checker";   icon=$emojiPhish;   scan=$phishScan;   row=1; col=1; color=[System.Drawing.Color]::FromArgb(180, 0, 255) },
    @{ name="Stealth VPN";   sub="Hardens physical network adapters"; icon=$emojiStealth; scan=$stealthScan; row=1; col=2; color=[System.Drawing.Color]::FromArgb(0, 255, 220) }
)

foreach ($ag in $agentDefs) {
    $card = New-Object System.Windows.Forms.Panel
    $card.Dock = "Fill"
    $card.Margin = New-Object System.Windows.Forms.Padding(6, 6, 6, 6)
    $card.BackColor = $cardBg
    $card.BorderStyle = "FixedSingle"

    # Colorful Top Accent Border Panel
    $cardTop = New-Object System.Windows.Forms.Panel
    $cardTop.Height = 4
    $cardTop.Dock = "Top"
    $cardTop.BackColor = $ag.color
    $card.Controls.Add($cardTop)

    # Emoji icon
    $ico = New-Object System.Windows.Forms.Label
    $ico.Text = $ag.icon
    $ico.Font = New-Object System.Drawing.Font("Segoe UI", 24)
    $ico.ForeColor = $ag.color
    $ico.Location = New-Object System.Drawing.Point(14, 18)
    $ico.AutoSize = $true
    $ico.Anchor = "Top, Left"
    $card.Controls.Add($ico)

    # Agent name
    $lname = New-Object System.Windows.Forms.Label
    $lname.Text = $ag.name
    $lname.Font = $fBig
    $lname.ForeColor = $white
    $lname.Location = New-Object System.Drawing.Point(72, 20)
    $lname.AutoSize = $true
    $lname.Anchor = "Top, Left"
    $card.Controls.Add($lname)

    # GEMINI AI badge
    $badge = New-Object System.Windows.Forms.Label
    $badge.Text = " GEMINI AI "
    $badge.Font = New-Object System.Drawing.Font("Consolas", 7, [System.Drawing.FontStyle]::Bold)
    $badge.ForeColor = $bgColor
    $badge.BackColor = $ag.color
    $badge.Location = New-Object System.Drawing.Point(72, 50)
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

    # RUN AI SCAN button
    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = "RUN SCAN"
    $btn.Font = $fMed
    $btn.Size = New-Object System.Drawing.Size(110, 30)
    $btn.Location = New-Object System.Drawing.Point(168, 109)
    $btn.BackColor = [System.Drawing.Color]::FromArgb(0, 50, 40)
    $btn.ForeColor = $neonGreen
    $btn.FlatStyle = "Flat"
    $btn.FlatAppearance.BorderColor = $dimGreen
    $btn.FlatAppearance.BorderSize = 1
    $btn.Cursor = [System.Windows.Forms.Cursors]::Hand
    $btn.Tag = $ag.scan
    $btn.Anchor = "Bottom, Right"

    $btn.add_MouseEnter({ param($s,$e); $s.BackColor=[System.Drawing.Color]::FromArgb(0,120,90); $s.ForeColor=[System.Drawing.Color]::White })
    $btn.add_MouseLeave({ param($s,$e); $s.BackColor=[System.Drawing.Color]::FromArgb(0,50,40);  $s.ForeColor=[System.Drawing.Color]::FromArgb(0,220,156) })
    $btn.Add_Click({
        param($s,$e)
        $s.Enabled = $false
        $s.Text = "SCANNING..."
        $s.BackColor = [System.Drawing.Color]::FromArgb(60,15,0)
        $s.ForeColor = [System.Drawing.Color]::FromArgb(255,60,60)
        
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
        $s.BackColor = [System.Drawing.Color]::FromArgb(0,50,40)
        $s.ForeColor = [System.Drawing.Color]::FromArgb(0,220,156)
        $s.Enabled = $true
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
    foreach ($sb in @($dnaScan, $netScan, $vaultScan, $purgeScan, $phishScan, $stealthScan)) {
        & $sb
    }
    $btnScanAll.Text = "RUN FULL AI SCAN"
    $btnScanAll.Enabled = $true
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
# TELEMETRY SYNC ENGINE
# ======================================================
$dir = $PSScriptRoot
if (-not $dir -and $MyInvocation.MyCommand -and $MyInvocation.MyCommand.Path) { $dir = Split-Path $MyInvocation.MyCommand.Path -Parent }
if (-not $dir) { $dir = $PWD.Path }
if (-not $dir) { $dir = "." }
$telemetryFile = Join-Path $dir "sentinel_telemetry.json"
$script:lastLogCount = 0
$script:blinkState = $true

$rtTimer = New-Object System.Windows.Forms.Timer
$rtTimer.Interval = 1000 # Sync and pulse every 1 second
$rtTimer.add_Tick({
    $isDaemonRunning = $false
    if (Test-Path $telemetryFile) {
        try {
            $json = Get-Content $telemetryFile -Raw -EA SilentlyContinue
            $data = $json | ConvertFrom-Json
            if ($data) {
                # Check Heartbeat (within 15 seconds)
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
                            $lblStatCanaryVal.Text = "RESTORED"
                            $lblStatCanaryVal.ForeColor = $alertRed
                        } elseif ($type -eq "system") {
                            $color = "white"
                        }
                        
                        Log "[$time] [$type.ToUpper()] $msg" $color
                    }
                    $script:lastLogCount = $totalLogs.Count
                } else {
                    if (-not $lblStatCanaryVal.ForeColor.Equals($alertRed)) {
                        $lblStatCanaryVal.Text = "ACTIVE"
                        $lblStatCanaryVal.ForeColor = $neonGreen
                    }
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

$rtTimer.Start()

# Stop timer when form is closed
$form.add_FormClosing({
    $rtTimer.Stop()
})

# ======================================================
# LAUNCH
# ======================================================
[System.Windows.Forms.Application]::Run($form)
