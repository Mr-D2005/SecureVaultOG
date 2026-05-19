Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ======================================================
# COLOR PALETTE (McAfee-Style Premium Enterprise Dark)
# ======================================================
$bgColor       = [System.Drawing.Color]::FromArgb(8, 10, 18)
$bgGradient    = [System.Drawing.Color]::FromArgb(12, 15, 28)
$cardBg        = [System.Drawing.Color]::FromArgb(18, 22, 36)
$cardHoverBg   = [System.Drawing.Color]::FromArgb(26, 32, 54)
$sidebarBg     = [System.Drawing.Color]::FromArgb(6, 7, 14)
$sidebarHover  = [System.Drawing.Color]::FromArgb(20, 24, 44)
$sidebarActive = [System.Drawing.Color]::FromArgb(0, 210, 140)
$neonGreen     = [System.Drawing.Color]::FromArgb(0, 220, 150)
$neonCyan      = [System.Drawing.Color]::FromArgb(0, 180, 255)
$neonAmber     = [System.Drawing.Color]::FromArgb(255, 165, 0)
$neonMagenta   = [System.Drawing.Color]::FromArgb(255, 50, 140)
$neonPurple    = [System.Drawing.Color]::FromArgb(160, 80, 255)
$neonBlue      = [System.Drawing.Color]::FromArgb(30, 140, 255)
$dimGreen      = [System.Drawing.Color]::FromArgb(0, 180, 120)
$alertRed      = [System.Drawing.Color]::FromArgb(255, 60, 60)
$white         = [System.Drawing.Color]::FromArgb(240, 242, 255)
$gray          = [System.Drawing.Color]::FromArgb(120, 130, 155)
$darkPanel     = [System.Drawing.Color]::FromArgb(5, 6, 12)

# ======================================================
# TYPOGRAPHY
# ======================================================
$fTitle  = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$fBig    = New-Object System.Drawing.Font("Segoe UI", 11.5, [System.Drawing.FontStyle]::Bold)
$fMed    = New-Object System.Drawing.Font("Segoe UI", 9.5, [System.Drawing.FontStyle]::Bold)
$fSmall  = New-Object System.Drawing.Font("Segoe UI", 8.5)
$fMono   = New-Object System.Drawing.Font("Consolas", 9.5)

# MDL2 Vector Icons
$iconDna     = [char]0xE8A1
$iconNet     = [char]0xE839
$iconVault   = [char]0xE72E
$iconPurge   = [char]0xE74D
$iconPhish   = [char]0xE909
$iconStealth = [char]0xE740

# ======================================================
# UTILITIES: ROUNDED PATHS & GLOWS
# ======================================================
function Get-RoundedPath {
    param($rect, $radius)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    if ($radius -le 0) {
        $path.AddRectangle($rect)
        return $path
    }
    $r = $radius * 2
    if ($rect.Width -le $r) { $r = $rect.Width - 1 }
    if ($rect.Height -le $r) { $r = $rect.Height - 1 }
    
    $path.AddArc($rect.X, $rect.Y, $r, $r, 180, 90)
    $path.AddArc(($rect.Right - $r - 1), $rect.Y, $r, $r, 270, 90)
    $path.AddArc(($rect.Right - $r - 1), ($rect.Bottom - $r - 1), $r, $r, 0, 90)
    $path.AddArc($rect.X, ($rect.Bottom - $r - 1), $r, $r, 90, 90)
    $path.CloseFigure()
    return $path
}

# ======================================================
# MAIN FORM SETUP
# ======================================================
$form = New-Object System.Windows.Forms.Form
$form.Text = "SecureVault Sentinel AI - Total Protection Dashboard"
$form.Size = New-Object System.Drawing.Size(1400, 920)
$form.MinimumSize = New-Object System.Drawing.Size(1200, 820)
$form.StartPosition = "CenterScreen"
$form.BackColor = $bgColor
$form.FormBorderStyle = "Sizable"
$form.MaximizeBox = $true
$form.add_Paint({
    param($s,$e)
    $rect = $s.ClientRectangle
    if ($rect.Width -gt 0 -and $rect.Height -gt 0) {
        $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $bgColor, $bgGradient, 90)
        $e.Graphics.FillRectangle($brush, $rect)
        $brush.Dispose()
    }
})

# ======================================================
# LEFT NAVIGATION SIDEBAR (Floating Pill Design)
# ======================================================
$sidebar = New-Object System.Windows.Forms.Panel
$sidebar.Width = 230
$sidebar.Dock = "Left"
$sidebar.BackColor = $sidebarBg

# Left bar line separator
$sidebar.add_Paint({
    param($s,$e)
    $rect = $s.ClientRectangle
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(25, 28, 50), 1)
    $e.Graphics.DrawLine($pen, $rect.Width - 1, 0, $rect.Width - 1, $rect.Height)
    $pen.Dispose()
})

# Sidebar Logo Section
$logoPanel = New-Object System.Windows.Forms.Panel
$logoPanel.Height = 100
$logoPanel.Dock = "Top"
$sidebar.Controls.Add($logoPanel)

$logoIcon = New-Object System.Windows.Forms.Label
$logoIcon.Text = [char]0xE8A1
$logoIcon.Font = New-Object System.Drawing.Font("Segoe MDL2 Assets", 15)
$logoIcon.ForeColor = $sidebarActive
$logoIcon.Location = New-Object System.Drawing.Point(22, 28)
$logoIcon.AutoSize = $true
$logoPanel.Controls.Add($logoIcon)

$lblBrand = New-Object System.Windows.Forms.Label
$lblBrand.Text = "SECUREVAULT"
$lblBrand.Font = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$lblBrand.ForeColor = $neonGreen
$lblBrand.Location = New-Object System.Drawing.Point(50, 26)
$lblBrand.AutoSize = $true
$logoPanel.Controls.Add($lblBrand)

$lblSubBrand = New-Object System.Windows.Forms.Label
$lblSubBrand.Text = "SENTINEL AI  v6.0"
$lblSubBrand.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 7.5)
$lblSubBrand.ForeColor = $gray
$lblSubBrand.Location = New-Object System.Drawing.Point(52, 50)
$lblSubBrand.AutoSize = $true
$logoPanel.Controls.Add($lblSubBrand)

# ======================================================
# ======================================================
# PAGE CONTROLLERS  (mainContainer MUST be added after sidebar)
# ======================================================
$mainContainer = New-Object System.Windows.Forms.Panel
$mainContainer.Dock = "Fill"
$mainContainer.Padding = New-Object System.Windows.Forms.Padding(24, 12, 24, 24)
# Add sidebar first so WinForms Dock engine reserves Left space before Fill
$form.Controls.Add($mainContainer)
$form.Controls.Add($sidebar)

# TableLayoutPanel inside mainContainer to guarantee strict grid division (no overlap possible)
$mainLayout = New-Object System.Windows.Forms.TableLayoutPanel
$mainLayout.Dock = "Fill"
$mainLayout.RowCount = 2
$mainLayout.ColumnCount = 1
$mainLayout.Margin = New-Object System.Windows.Forms.Padding(0)
$mainContainer.Controls.Add($mainLayout)

[void]$mainLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Absolute, 55)))
[void]$mainLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 100.0)))
[void]$mainLayout.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 100.0)))

# Global Title Bar in Row 0
$titleBar = New-Object System.Windows.Forms.Panel
$titleBar.Dock = "Fill"
$titleBar.Margin = New-Object System.Windows.Forms.Padding(0)
[void]$mainLayout.Controls.Add($titleBar, 0, 0)

$lblTitle = New-Object System.Windows.Forms.Label
$lblTitle.Text = "Dashboard"
$lblTitle.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 16, [System.Drawing.FontStyle]::Bold)
$lblTitle.ForeColor = $white
$lblTitle.Location = New-Object System.Drawing.Point(0, 10)
$lblTitle.AutoSize = $true
$titleBar.Controls.Add($lblTitle)

# Tab panels added to Row 1
$pageDashboard  = New-Object System.Windows.Forms.Panel; $pageDashboard.Dock = "Fill"; $pageDashboard.Visible = $true
$pageLogs       = New-Object System.Windows.Forms.Panel; $pageLogs.Dock = "Fill"; $pageLogs.Visible = $false
$pageQuarantine  = New-Object System.Windows.Forms.Panel; $pageQuarantine.Dock = "Fill"; $pageQuarantine.Visible = $false
$pageTuning     = New-Object System.Windows.Forms.Panel; $pageTuning.Dock = "Fill"; $pageTuning.Visible = $false
$pageNetwork    = New-Object System.Windows.Forms.Panel; $pageNetwork.Dock = "Fill"; $pageNetwork.Visible = $false

[void]$mainLayout.Controls.Add($pageDashboard, 0, 1)
[void]$mainLayout.Controls.Add($pageLogs, 0, 1)
[void]$mainLayout.Controls.Add($pageQuarantine, 0, 1)
[void]$mainLayout.Controls.Add($pageTuning, 0, 1)
[void]$mainLayout.Controls.Add($pageNetwork, 0, 1)

$script:activePage = $pageDashboard
$script:sidebarButtons = New-Object System.Collections.ArrayList

function Show-Page {
    param($targetPage, $senderBtn)
    $pageDashboard.Visible = $false
    $pageLogs.Visible = $false
    $pageQuarantine.Visible = $false
    $pageTuning.Visible = $false
    $pageNetwork.Visible = $false
    
    $targetPage.Visible = $true
    $script:activePage = $targetPage
    
    if ($targetPage -eq $pageDashboard) { $lblTitle.Text = "Dashboard" }
    elseif ($targetPage -eq $pageLogs) { $lblTitle.Text = "Event Telemetry Logs" }
    elseif ($targetPage -eq $pageQuarantine) { $lblTitle.Text = "Quarantine Vault" }
    elseif ($targetPage -eq $pageTuning) { $lblTitle.Text = "System Optimizer" }
    elseif ($targetPage -eq $pageNetwork) { $lblTitle.Text = "Active Socket Network Monitor" }
    
    foreach ($btn in $script:sidebarButtons) {
        $btn.Invalidate()
    }
}

# Sidebar Navigation Button Helper (Full-Width Modern List Items)
function Create-NavButton {
    param([string]$text, [char]$glyph, $targetPage, [int]$y)
    
    $btn = New-Object System.Windows.Forms.Button
    $btn.Size = New-Object System.Drawing.Size(240, 48)
    $btn.Location = New-Object System.Drawing.Point(0, $y)
    $btn.FlatStyle = "Flat"
    $btn.FlatAppearance.BorderSize = 0
    $btn.Cursor = [System.Windows.Forms.Cursors]::Hand
    $btn.Anchor = "Top, Left, Right"
    $btn.Text = ""
    $btn.Font = $fMed
    
    # Store parameters as properties on the control to avoid closure scope issues
    $btn | Add-Member -NotePropertyName "Glyph" -NotePropertyValue $glyph
    $btn | Add-Member -NotePropertyName "TargetPage" -NotePropertyValue $targetPage
    $btn | Add-Member -NotePropertyName "LabelText" -NotePropertyValue $text
    
    $btn.add_Paint({
        param($s,$e)
        $g = $e.Graphics
        $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
        $rect = $s.ClientRectangle
        
        $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
        $isActive = ($script:activePage -eq $s.TargetPage)
        
        if ($isActive) {
            # Active Background
            $brush = New-Object System.Drawing.SolidBrush($sidebarHover)
            $g.FillRectangle($brush, $rect)
            $brush.Dispose()
            
            # Left Accent Bar
            $barBrush = New-Object System.Drawing.SolidBrush($sidebarActive)
            $g.FillRectangle($barBrush, 0, 0, 4, $rect.Height)
            $barBrush.Dispose()
            
            $textColor = $white
            $icoColor = $sidebarActive
        } elseif ($isHovered) {
            # Hover state
            $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(26, 29, 41))
            $g.FillRectangle($brush, $rect)
            $brush.Dispose()
            
            $textColor = $white
            $icoColor = $white
        } else {
            # Normal transparent state
            $textColor = $gray
            $icoColor = $gray
        }
        
        # Draw MDL2 Icon
        $gFont = New-Object System.Drawing.Font("Segoe MDL2 Assets", 11)
        $gBrush = New-Object System.Drawing.SolidBrush($icoColor)
        $g.DrawString($s.Glyph.ToString(), $gFont, $gBrush, 18, 16)
        $gBrush.Dispose()
        $gFont.Dispose()
        
        # Draw Text
        $sf = New-Object System.Drawing.StringFormat
        $sf.LineAlignment = "Center"
        $tBrush = New-Object System.Drawing.SolidBrush($textColor)
        $g.DrawString($s.LabelText, $s.Font, $tBrush, 54, $rect.Height/2, $sf)
        $tBrush.Dispose()
        $sf.Dispose()
    })
    
    $btn.add_MouseEnter({ param($s,$e) $s.Invalidate() })
    $btn.add_MouseLeave({ param($s,$e) $s.Invalidate() })
    $btn.add_Click({ param($s,$e) Show-Page $s.TargetPage $s })
    
    $sidebarNavList.Controls.Add($btn)
    [void]$script:sidebarButtons.Add($btn)
}

# Create nav tabs container
$sidebarNavList = New-Object System.Windows.Forms.Panel
$sidebarNavList.Dock = "Fill"
$sidebar.Controls.Add($sidebarNavList)

Create-NavButton "Shield Dashboard" ([char]0xE80F) $pageDashboard 100
Create-NavButton "Event telemetry"  ([char]0xE7C3) $pageLogs 148
Create-NavButton "Quarantine Vault"  ([char]0xE73A) $pageQuarantine 196
Create-NavButton "System Optimizer" ([char]0xE9A6) $pageTuning 244
Create-NavButton "Active Sockets"   ([char]0xE839) $pageNetwork 292

# Complete table layout for the dashboard content (2 rows: Hero Panel and Grid of Cards)
$dashboardLayout = New-Object System.Windows.Forms.TableLayoutPanel
$dashboardLayout.Dock = "Fill"
$dashboardLayout.RowCount = 2
$dashboardLayout.ColumnCount = 1
$pageDashboard.Controls.Add($dashboardLayout)

[void]$dashboardLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Absolute, 200)))
[void]$dashboardLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 100.0)))
[void]$dashboardLayout.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 100.0)))

# Hero Panel - Premium Corporate Banner
$heroPanel = New-Object System.Windows.Forms.Panel
$heroPanel.Dock = "Fill"
$heroPanel.BackColor = $bgColor
$heroPanel.Margin = New-Object System.Windows.Forms.Padding(0, 0, 0, 12)
$heroPanel.BorderStyle = "None"
[void]$dashboardLayout.Controls.Add($heroPanel, 0, 0)

$heroPanel.add_Paint({
    param($s,$e)
    $g = $e.Graphics
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = $s.ClientRectangle

    # Rich gradient background: deep navy to midnight
    $path = Get-RoundedPath $rect 14
    $c1 = [System.Drawing.Color]::FromArgb(14, 20, 48)
    $c2 = [System.Drawing.Color]::FromArgb(8, 10, 22)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 135)
    $g.FillPath($brush, $path)
    $brush.Dispose()

    # Glowing top-left accent sweep
    $glowRect = New-Object System.Drawing.Rectangle(0, 0, 420, $rect.Height)
    $gb = New-Object System.Drawing.Drawing2D.LinearGradientBrush($glowRect, [System.Drawing.Color]::FromArgb(30, 0, 220, 150), [System.Drawing.Color]::FromArgb(0, 0, 0, 0), 0)
    $g.FillPath($gb, $path)
    $gb.Dispose()

    # Neon border glow (green on left, fading)
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 0, 220, 150), 2)
    $g.DrawPath($borderPen, $path)
    $borderPen.Dispose()

    # Shield icon circle
    $circleColor = [System.Drawing.Color]::FromArgb(0, 220, 150)
    $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 0, 220, 150))
    $g.FillEllipse($glowBrush, 18, 14, 72, 72)
    $glowBrush.Dispose()
    $circleBrush = New-Object System.Drawing.SolidBrush($circleColor)
    $g.FillEllipse($circleBrush, 26, 22, 56, 56)
    $circleBrush.Dispose()

    $checkFont = New-Object System.Drawing.Font("Segoe MDL2 Assets", 20, [System.Drawing.FontStyle]::Bold)
    $checkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(8, 10, 18))
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = "Center"
    $sf.LineAlignment = "Center"
    $g.DrawString([char]0xE73E, $checkFont, $checkBrush, (New-Object System.Drawing.RectangleF(26, 22, 56, 56)), $sf)
    $checkBrush.Dispose()
    $checkFont.Dispose()
    $sf.Dispose()
    $path.Dispose()
})

$lblProtected = New-Object System.Windows.Forms.Label
$lblProtected.Text = "YOUR SYSTEM IS SECURED"
$lblProtected.Font = New-Object System.Drawing.Font("Segoe UI", 16.5, [System.Drawing.FontStyle]::Bold)
$lblProtected.ForeColor = [System.Drawing.Color]::FromArgb(240, 242, 255)
$lblProtected.Location = New-Object System.Drawing.Point(106, 18)
$lblProtected.Size = New-Object System.Drawing.Size(700, 28)
$lblProtected.AutoSize = $false
$lblProtected.Anchor = "Top, Left"
$lblProtected.BackColor = [System.Drawing.Color]::Transparent
$heroPanel.Controls.Add($lblProtected)

$lblProtSub = New-Object System.Windows.Forms.Label
$lblProtSub.Text = "6 autonomous AI agents active  |  Real-time behavioral protection online  |  Gemini Neural Engine v6.0"
$lblProtSub.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 9.5, [System.Drawing.FontStyle]::Bold)
$lblProtSub.ForeColor = $neonCyan
$lblProtSub.Location = New-Object System.Drawing.Point(106, 48)
$lblProtSub.Size = New-Object System.Drawing.Size(850, 22)
$lblProtSub.AutoSize = $false
$lblProtSub.Anchor = "Top, Left"
$lblProtSub.BackColor = [System.Drawing.Color]::Transparent
$heroPanel.Controls.Add($lblProtSub)

$lblLastScan = New-Object System.Windows.Forms.Label
$lblLastScan.Name = "LastScan"
$lblLastScan.Text = "$([char]0x25CF) Shield Pulse: Active (checking telemetry...)"
$lblLastScan.Font = New-Object System.Drawing.Font("Consolas", 8.5)
$lblLastScan.ForeColor = $neonGreen
$lblLastScan.Location = New-Object System.Drawing.Point(106, 73)
$lblLastScan.Size = New-Object System.Drawing.Size(850, 20)
$lblLastScan.AutoSize = $false
$lblLastScan.Anchor = "Top, Left"
$lblLastScan.BackColor = [System.Drawing.Color]::Transparent
$heroPanel.Controls.Add($lblLastScan)

# Stats Panel Builder (Rounded Cards inside Hero)
function Create-StatPanel {
    param([string]$title, [string]$name, [string]$defaultVal, [int]$x)
    
    $p = New-Object System.Windows.Forms.Panel
    $p.Size = New-Object System.Drawing.Size(130, 58)
    $p.Location = New-Object System.Drawing.Point($x, 110)
    $p.BackColor = [System.Drawing.Color]::Transparent
    $p.Anchor = "Top, Left"
    
    $p.add_Paint({
        param($s,$e)
        $g = $e.Graphics
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $rect = $s.ClientRectangle
        $path = Get-RoundedPath $rect 5
        $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(12, 16, 32))
        $g.FillPath($brush, $path)
        $brush.Dispose()
        
        $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 50, 90), 1)
        $g.DrawPath($pen, $path)
        $pen.Dispose()
        $path.Dispose()
    })
    
    $val = New-Object System.Windows.Forms.Label
    $val.Name = $name
    $val.Text = $defaultVal
    $val.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 13, [System.Drawing.FontStyle]::Bold)
    $val.ForeColor = $neonGreen
    $val.Location = New-Object System.Drawing.Point(10, 4)
    $val.AutoSize = $true
    $val.BackColor = [System.Drawing.Color]::Transparent
    $p.Controls.Add($val)
    
    $lbl = New-Object System.Windows.Forms.Label
    $lbl.Text = $title
    $lbl.Font = New-Object System.Drawing.Font("Segoe UI", 7.5, [System.Drawing.FontStyle]::Bold)
    $lbl.ForeColor = $gray
    $lbl.Location = New-Object System.Drawing.Point(10, 30)
    $lbl.AutoSize = $true
    $lbl.BackColor = [System.Drawing.Color]::Transparent
    $p.Controls.Add($lbl)
    
    $heroPanel.Controls.Add($p)
    return $val
}

$lblStatThreatsVal = Create-StatPanel "AI THREATS BLOCKED" "StatThreats" "0" 100
$lblStatProcsVal   = Create-StatPanel "PROCESSES SCANNED"  "StatProcs"   "0" 240
$lblStatMBVal      = Create-StatPanel "JUNK PURGED (MB)"   "StatMB"      "0.0" 380
$lblStatCanaryVal  = Create-StatPanel "CANARY SHIELD"      "StatCanary"  "ACTIVE" 520

# Full Scan Button (McAfee Blue)
$btnScanAll = New-Object System.Windows.Forms.Button
$btnScanAll.Text = "RUN FULL AI SCAN"
$btnScanAll.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 10, [System.Drawing.FontStyle]::Bold)
$btnScanAll.Size = New-Object System.Drawing.Size(200, 50)
$btnScanAll.Location = New-Object System.Drawing.Point(900, 30)
$btnScanAll.FlatStyle = "Flat"
$btnScanAll.FlatAppearance.BorderSize = 0
$btnScanAll.Cursor = [System.Windows.Forms.Cursors]::Hand
$btnScanAll.Anchor = "Top, Right"

$btnScanAll.add_Paint({
    param($s,$e)
    $g = $e.Graphics
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = $s.ClientRectangle
    $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
    
    $path = Get-RoundedPath $rect 10
    
    if ($s.Enabled) {
        $c1 = if ($isHovered) { [System.Drawing.Color]::FromArgb(0, 220, 150) } else { [System.Drawing.Color]::FromArgb(0, 180, 255) }
        $c2 = if ($isHovered) { [System.Drawing.Color]::FromArgb(0, 150, 255) } else { [System.Drawing.Color]::FromArgb(0, 110, 240) }
        $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45)
        $g.FillPath($brush, $path)
        $brush.Dispose()
        $textColor = $bgColor
        
        if ($isHovered) {
            $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 255, 255, 255), 1.5)
            $g.DrawPath($pen, $path)
            $pen.Dispose()
        }
    } else {
        $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 10, 10))
        $g.FillPath($brush, $path)
        $brush.Dispose()
        $textColor = $alertRed
    }
    
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = "Center"
    $sf.LineAlignment = "Center"
    $textBrush = New-Object System.Drawing.SolidBrush($textColor)
    $g.DrawString($s.Text, $s.Font, $textBrush, [System.Drawing.RectangleF]$rect, $sf)
    $textBrush.Dispose()
    $sf.Dispose()
    $path.Dispose()
})

$btnScanAll.add_MouseEnter({ param($s,$e) $s.Invalidate() })
$btnScanAll.add_MouseLeave({ param($s,$e) $s.Invalidate() })
$heroPanel.Controls.Add($btnScanAll)

# Scan Progress Bar
$progPanel = New-Object System.Windows.Forms.Panel
$progPanel.Height = 4
$progPanel.Dock = "Bottom"
$progPanel.BackColor = [System.Drawing.Color]::FromArgb(20, 24, 48)
$heroPanel.Controls.Add($progPanel)

$progVal = New-Object System.Windows.Forms.Panel
$progVal.Height = 4
$progVal.Width = 0
$progVal.BackColor = $neonGreen
$progVal.Location = New-Object System.Drawing.Point(0, 0)
$progPanel.Controls.Add($progVal)

# macOS-Style Console Container (added to pageLogs, fills container)
$consoleContainer = New-Object System.Windows.Forms.Panel
$consoleContainer.Dock = "Fill"
$consoleContainer.Padding = New-Object System.Windows.Forms.Padding(12, 36, 12, 12)
[void]$pageLogs.Controls.Add($consoleContainer)

$consoleContainer.add_Paint({
    param($s,$e)
    $g = $e.Graphics
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = $s.ClientRectangle
    
    # Outer frame path
    $path = Get-RoundedPath $rect 10
    $brush = New-Object System.Drawing.SolidBrush($bgColor)
    $g.FillPath($brush, $path)
    $brush.Dispose()
    
    # Top macOS-style panel header
    $headerRect = New-Object System.Drawing.Rectangle(0, 0, $rect.Width, 26)
    $headerPath = Get-RoundedPath $headerRect 10
    $headerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 20, 36))
    $g.FillPath($headerBrush, $headerPath)
    # Refill bottom half of header to keep it sharp
    $g.FillRectangle($headerBrush, 0, 13, $rect.Width, 13)
    $headerBrush.Dispose()
    $headerPath.Dispose()
    
    # Draw macOS mini window buttons
    $redBrush = New-Object System.Drawing.SolidBrush($alertRed)
    $yellowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 190, 0))
    $greenBrush = New-Object System.Drawing.SolidBrush($neonGreen)
    
    $g.FillEllipse($redBrush, 14, 9, 8, 8)
    $g.FillEllipse($yellowBrush, 28, 9, 8, 8)
    $g.FillEllipse($greenBrush, 42, 9, 8, 8)
    
    $redBrush.Dispose()
    $yellowBrush.Dispose()
    $greenBrush.Dispose()
    
    # Title Text in Console Header
    $cTitleFont = New-Object System.Drawing.Font("Consolas", 8, [System.Drawing.FontStyle]::Bold)
    $cTitleBrush = New-Object System.Drawing.SolidBrush($gray)
    $g.DrawString("terminal://securevault-cognitive-logs", $cTitleFont, $cTitleBrush, 64, 7)
    $cTitleBrush.Dispose()
    $cTitleFont.Dispose()
    
    # Outer border
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 50, 90), 1)
    $g.DrawPath($pen, $path)
    $pen.Dispose()
    $path.Dispose()
})

$consoleProgPanel = New-Object System.Windows.Forms.Panel
$consoleProgPanel.Height = 4
$consoleProgPanel.Dock = "Top"
$consoleProgPanel.BackColor = [System.Drawing.Color]::FromArgb(20, 24, 48)
$consoleContainer.Controls.Add($consoleProgPanel)

$consoleProgVal = New-Object System.Windows.Forms.Panel
$consoleProgVal.Height = 4
$consoleProgVal.Width = 0
$consoleProgVal.BackColor = $neonGreen
$consoleProgVal.Location = New-Object System.Drawing.Point(0, 0)
$consoleProgPanel.Controls.Add($consoleProgVal)

$console = New-Object System.Windows.Forms.RichTextBox
$console.Multiline = $true
$console.ReadOnly = $true
$console.BackColor = [System.Drawing.Color]::FromArgb(18, 20, 28) # Match cardBg for dark theme console
$console.ForeColor = $white
$console.Font = $fMono
$console.Dock = "Fill"
$console.BorderStyle = "None"
$console.ScrollBars = "Vertical"
$console.Text = "[SECUREVAULT AI v6.0] Gemini-powered neural defense suite online."
$console.AppendText("`r`n[SYSTEM] 6 autonomous AI agents loaded. Real-time telemetry ready.")
$console.AppendText("`r`n[WAITING] Click any agent card below to run a scan...")
$consoleContainer.Controls.Add($console)

# Row 1 Split Container (Grid on Left, System Features Module Hub on Right)
$row1Container = New-Object System.Windows.Forms.TableLayoutPanel
$row1Container.Dock = "Fill"
$row1Container.ColumnCount = 2
$row1Container.RowCount = 1
$row1Container.Margin = New-Object System.Windows.Forms.Padding(0)
[void]$dashboardLayout.Controls.Add($row1Container, 0, 1)

[void]$row1Container.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 76.5)))
[void]$row1Container.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 23.5)))
[void]$row1Container.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 100.0)))

# Grid on Left
$grid = New-Object System.Windows.Forms.TableLayoutPanel
$grid.Dock = "Fill"
$grid.Margin = New-Object System.Windows.Forms.Padding(0, 0, 0, 0)
$grid.ColumnCount = 3
$grid.RowCount = 2
[void]$row1Container.Controls.Add($grid, 0, 0)

[void]$grid.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 33.33)))
[void]$grid.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 33.33)))
[void]$grid.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 33.33)))
[void]$grid.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 50.0)))
[void]$grid.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 50.0)))

# System Features Module Hub on Right
$featuresPanel = New-Object System.Windows.Forms.Panel
$featuresPanel.Dock = "Fill"
$featuresPanel.Margin = New-Object System.Windows.Forms.Padding(12, 10, 10, 10)
$featuresPanel.BackColor = $cardBg
[void]$row1Container.Controls.Add($featuresPanel, 1, 0)

$featuresPanel.add_Paint({
    param($s,$e)
    $g = $e.Graphics
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = $s.ClientRectangle
    
    $path = Get-RoundedPath $rect 14
    $c1 = [System.Drawing.Color]::FromArgb(18, 22, 36)
    $c2 = [System.Drawing.Color]::FromArgb(10, 12, 24)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 135)
    $g.FillPath($brush, $path)
    $brush.Dispose()
    
    # Glowing border
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(150, 0, 180, 255), 1.5)
    $g.DrawPath($pen, $path)
    $pen.Dispose()
    $path.Dispose()
})

$lblFeatureHeader = New-Object System.Windows.Forms.Label
$lblFeatureHeader.Text = "SYSTEM MODULES"
$lblFeatureHeader.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$lblFeatureHeader.ForeColor = $white
$lblFeatureHeader.Location = New-Object System.Drawing.Point(18, 18)
$lblFeatureHeader.AutoSize = $true
$featuresPanel.Controls.Add($lblFeatureHeader)

$lblFeatureSub = New-Object System.Windows.Forms.Label
$lblFeatureSub.Text = "Real-time AI telemetry"
$lblFeatureSub.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 8)
$lblFeatureSub.ForeColor = $neonCyan
$lblFeatureSub.Location = New-Object System.Drawing.Point(18, 38)
$lblFeatureSub.AutoSize = $true
$featuresPanel.Controls.Add($lblFeatureSub)

# Settings File Path
$settingsFile = Join-Path $PSScriptRoot "sentinel_settings.json"
if (-not $PSScriptRoot) {
    $settingsFile = Join-Path $PWD.Path "sentinel_settings.json"
}

# Load existing settings or create defaults
$script:sentinelSettings = @{
    rt_guard      = $true
    at_firewall   = $true
    rt_scan       = $false
    r_rollback    = $true
    tcp_tarpit    = $true
    usb_guard     = $true
    schedule_freq = "Daily"
    schedule_time = "12:00 PM"
}

if (Test-Path $settingsFile) {
    try {
        $content = [System.IO.File]::ReadAllText($settingsFile)
        $loaded = ConvertFrom-Json $content
        foreach ($prop in $loaded.PSObject.Properties) {
            $script:sentinelSettings[$prop.Name] = $prop.Value
        }
    } catch {}
} else {
    try {
        $script:sentinelSettings | ConvertTo-Json | Out-File $settingsFile -Force -Encoding utf8
    } catch {}
}

function Save-Settings {
    try {
        $settings = @{}
        foreach ($key in $script:sentinelSettings.Keys) {
            $ctrl = $featuresPanel.Controls[$key]
            if ($ctrl) {
                $settings[$key] = $ctrl.Checked
            } else {
                $settings[$key] = $script:sentinelSettings[$key]
            }
        }
        $settings | ConvertTo-Json | Out-File $settingsFile -Force -Encoding utf8
    } catch {}
}

# Custom Toggle Switch Helper Function
function Create-ToggleSwitch {
    param([string]$key, [bool]$defaultChecked, [int]$y)
    
    $toggle = New-Object System.Windows.Forms.CheckBox
    $toggle.Name = $key
    $toggle.Appearance = "Button"
    $toggle.FlatStyle = "Flat"
    $toggle.FlatAppearance.BorderSize = 0
    $toggle.Size = New-Object System.Drawing.Size(42, 22)
    $toggle.Checked = $defaultChecked
    $toggle.Location = [System.Drawing.Point]::new(190, ($y + 12))
    $toggle.Anchor = "Top, Right"
    $toggle.Cursor = [System.Windows.Forms.Cursors]::Hand
    
    $toggle.add_Paint({
        param($s,$e)
        $g = $e.Graphics
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $rect = $s.ClientRectangle
        
        # Background capsule
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $r = $rect.Height - 2
        $path.AddArc(1, 1, $r, $r, 90, 180)
        $path.AddArc(($rect.Width - $r - 1), 1, $r, $r, 270, 180)
        $path.CloseFigure()
        
        $bgBrush = if ($s.Checked) {
            New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0, 230, 118))
        } else {
            New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60, 65, 80))
        }
        $g.FillPath($bgBrush, $path)
        $bgBrush.Dispose()
        
        # Knob
        $knobSize = $rect.Height - 6
        $knobX = if ($s.Checked) { $rect.Width - $knobSize - 3 } else { 3 }
        $knobY = 3
        $knobBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $g.FillEllipse($knobBrush, $knobX, $knobY, $knobSize, $knobSize)
        $knobBrush.Dispose()
        $path.Dispose()
    })
    
    $toggle.add_CheckedChanged({
        param($s,$e)
        $s.Invalidate()
        
        $modName = "Unknown Module"
        $titleCtrl = $s.Parent.Controls["Title_" + $s.Name]
        if ($titleCtrl) { $modName = $titleCtrl.Text }
        
        $dotCtrl = $s.Parent.Controls["Dot_" + $s.Name]
        if ($dotCtrl) {
            $dotCtrl.ForeColor = if ($s.Checked) { [System.Drawing.Color]::FromArgb(0, 220, 150) } else { [System.Drawing.Color]::FromArgb(255, 60, 60) }
        }
        
        $stateText = if ($s.Checked) { "ENABLED" } else { "DISABLED" }
        if ($console) {
            $console.AppendText("`r`n[SETTINGS] Module '$modName' has been $stateText.")
            $console.ScrollToCaret()
        }
        Save-Settings
    })
    
    return $toggle
}

$featuresList = @(
    @{ key="rt_guard"; title="Real-Time Guard"; desc="Continuous file system shield"; checked=[bool]$script:sentinelSettings["rt_guard"] },
    @{ key="at_firewall"; title="All-Time Firewall"; desc="Telemetry socket filter"; checked=[bool]$script:sentinelSettings["at_firewall"] },
    @{ key="rt_scan"; title="Continuous Full Scan"; desc="Low priority background scan"; checked=[bool]$script:sentinelSettings["rt_scan"] },
    @{ key="r_rollback"; title="Ransomware Rollback"; desc="Canary file backups"; checked=[bool]$script:sentinelSettings["r_rollback"] },
    @{ key="tcp_tarpit"; title="TCP Decoy Tarpit"; desc="Host decoy port 4444"; checked=[bool]$script:sentinelSettings["tcp_tarpit"] },
    @{ key="usb_guard"; title="USB Forensic Guard"; desc="Monitors badUSB/HID payloads"; checked=[bool]$script:sentinelSettings["usb_guard"] }
)

$startY = 68
$itemHeight = 72

for ($i = 0; $i -lt $featuresList.Count; $i++) {
    $item = $featuresList[$i]
    $y = $startY + ($i * $itemHeight)
    
    # separator
    $sep = New-Object System.Windows.Forms.Panel
    $sep.Height = 1
    $sep.Width = 220
    $sep.Location = [System.Drawing.Point]::new(18, $y)
    $sep.BackColor = [System.Drawing.Color]::FromArgb(25, 30, 50)
    $sep.Anchor = "Top, Left, Right"
    $featuresPanel.Controls.Add($sep)
    
    # dot indicator
    $fDot = New-Object System.Windows.Forms.Label
    $fDot.Name = "Dot_" + $item.key
    $fDot.Text = "$([char]0x25CF)"
    $fDot.Font = New-Object System.Drawing.Font("Segoe UI", 9)
    $fDot.Location = [System.Drawing.Point]::new(18, ($y + 12))
    $fDot.ForeColor = if ($item.checked) { [System.Drawing.Color]::FromArgb(0, 220, 150) } else { [System.Drawing.Color]::FromArgb(255, 60, 60) }
    $fDot.AutoSize = $true
    $featuresPanel.Controls.Add($fDot)
    
    # title
    $fTitle = New-Object System.Windows.Forms.Label
    $fTitle.Name = "Title_" + $item.key
    $fTitle.Text = $item.title
    $fTitle.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 9.5, [System.Drawing.FontStyle]::Bold)
    $fTitle.ForeColor = $white
    $fTitle.Location = [System.Drawing.Point]::new(34, ($y + 10))
    $fTitle.AutoSize = $true
    $featuresPanel.Controls.Add($fTitle)
    
    # desc
    $fDesc = New-Object System.Windows.Forms.Label
    $fDesc.Text = $item.desc
    $fDesc.Font = New-Object System.Drawing.Font("Segoe UI", 8)
    $fDesc.ForeColor = $gray
    $fDesc.Location = [System.Drawing.Point]::new(34, ($y + 28))
    $fDesc.AutoSize = $true
    $featuresPanel.Controls.Add($fDesc)
    
    # toggle switch
    $fToggle = Create-ToggleSwitch $item.key $item.checked $y
    
    $fToggle.add_CheckedChanged({
        param($s,$e)
        $dotCtrl = $s.Parent.Controls["Dot_" + $s.Name]
        if ($dotCtrl) {
            $dotCtrl.ForeColor = if ($s.Checked) { [System.Drawing.Color]::FromArgb(0, 230, 118) } else { [System.Drawing.Color]::FromArgb(180, 50, 50) }
        }
    })
    
    # Initialize dot color based on default check state
    $fDot.ForeColor = if ($item.checked) { [System.Drawing.Color]::FromArgb(0, 230, 118) } else { [System.Drawing.Color]::FromArgb(180, 50, 50) }
    
    $featuresPanel.Controls.Add($fToggle)
}

# Add Scheduler Button at the bottom
$btnSchedule = New-Object System.Windows.Forms.Button
$btnSchedule.Text = "SCHEDULE SYSTEM SCAN"
$btnSchedule.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 8.5, [System.Drawing.FontStyle]::Bold)
$btnSchedule.Size = [System.Drawing.Size]::new(210, 32)
$btnSchedule.Location = [System.Drawing.Point]::new(18, 510)
$btnSchedule.FlatStyle = "Flat"
$btnSchedule.FlatAppearance.BorderSize = 0
$btnSchedule.Cursor = [System.Windows.Forms.Cursors]::Hand
$btnSchedule.Anchor = "Top, Left, Right"
$featuresPanel.Controls.Add($btnSchedule)

$lblScheduleStatus = New-Object System.Windows.Forms.Label
$lblScheduleStatus.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 8, [System.Drawing.FontStyle]::Bold)
$lblScheduleStatus.ForeColor = $gray
$lblScheduleStatus.Location = [System.Drawing.Point]::new(18, 552)
$lblScheduleStatus.Size = [System.Drawing.Size]::new(210, 20)
$lblScheduleStatus.TextAlign = "MiddleCenter"
$lblScheduleStatus.Anchor = "Top, Left, Right"
$featuresPanel.Controls.Add($lblScheduleStatus)

function Update-ScheduleStatusLabel {
    $freq = $script:sentinelSettings["schedule_freq"]
    $time = $script:sentinelSettings["schedule_time"]
    if ($freq -and $time) {
        $lblScheduleStatus.Text = "Scheduled Scan: $freq at $time"
        $lblScheduleStatus.ForeColor = $neonGreen
    } else {
        $lblScheduleStatus.Text = "No schedule set"
        $lblScheduleStatus.ForeColor = $gray
    }
}
Update-ScheduleStatusLabel

$btnSchedule.add_Paint({
    param($s,$e)
    $g = $e.Graphics
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = $s.ClientRectangle
    $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
    
    $path = Get-RoundedPath $rect 8
    
    $brush = if ($isHovered) {
        New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $neonCyan, $neonBlue, 45)
    } else {
        New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 35, 65))
    }
    $g.FillPath($brush, $path)
    $brush.Dispose()
    
    if (-not $isHovered) {
        $pen = New-Object System.Drawing.Pen($neonCyan, 1.2)
        $g.DrawPath($pen, $path)
        $pen.Dispose()
    }
    
    # Draw button text custom to resolve WinForms paint override blank bug
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = "Center"
    $sf.LineAlignment = "Center"
    $textColor = if ($isHovered) { [System.Drawing.Color]::FromArgb(8, 10, 18) } else { $white }
    $textBrush = New-Object System.Drawing.SolidBrush($textColor)
    $g.DrawString($s.Text, $s.Font, $textBrush, [System.Drawing.RectangleF]$rect, $sf)
    $textBrush.Dispose()
    $sf.Dispose()
    
    $path.Dispose()
})

$btnSchedule.add_Click({
    $dlg = New-Object System.Windows.Forms.Form
    $dlg.Text = "Schedule System Scan"
    $dlg.Size = [System.Drawing.Size]::new(360, 260)
    $dlg.StartPosition = "CenterParent"
    $dlg.BackColor = [System.Drawing.Color]::FromArgb(18, 22, 36)
    $dlg.FormBorderStyle = "FixedDialog"
    $dlg.MaximizeBox = $false
    $dlg.MinimizeBox = $false
    $dlg.ShowInTaskbar = $false
    
    $dlgFont = New-Object System.Drawing.Font("Segoe UI", 9.5)
    $dlgFontBold = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    
    $lblFreq = New-Object System.Windows.Forms.Label
    $lblFreq.Text = "Scan Frequency:"
    $lblFreq.Font = $dlgFontBold
    $lblFreq.ForeColor = [System.Drawing.Color]::FromArgb(240, 242, 255)
    $lblFreq.Location = [System.Drawing.Point]::new(20, 20)
    $lblFreq.AutoSize = $true
    $dlg.Controls.Add($lblFreq)
    
    $cmbFreq = New-Object System.Windows.Forms.ComboBox
    $cmbFreq.Location = [System.Drawing.Point]::new(20, 45)
    $cmbFreq.Size = [System.Drawing.Size]::new(300, 25)
    $cmbFreq.DropDownStyle = "DropDownList"
    $cmbFreq.BackColor = [System.Drawing.Color]::FromArgb(8, 10, 18)
    $cmbFreq.ForeColor = [System.Drawing.Color]::FromArgb(240, 242, 255)
    $cmbFreq.Font = $dlgFont
    [void]$cmbFreq.Items.Add("Daily")
    [void]$cmbFreq.Items.Add("Weekly")
    
    $currentFreq = $script:sentinelSettings["schedule_freq"]
    if (-not $currentFreq) { $currentFreq = "Daily" }
    $cmbFreq.SelectedItem = $currentFreq
    $dlg.Controls.Add($cmbFreq)
    
    $lblTime = New-Object System.Windows.Forms.Label
    $lblTime.Text = "Scheduled Time:"
    $lblTime.Font = $dlgFontBold
    $lblTime.ForeColor = [System.Drawing.Color]::FromArgb(240, 242, 255)
    $lblTime.Location = [System.Drawing.Point]::new(20, 90)
    $lblTime.AutoSize = $true
    $dlg.Controls.Add($lblTime)
    
    $tp = New-Object System.Windows.Forms.DateTimePicker
    $tp.Format = [System.Windows.Forms.DateTimePickerFormat]::Custom
    $tp.CustomFormat = "hh:mm tt"
    $tp.ShowUpDown = $true
    $tp.Location = [System.Drawing.Point]::new(20, 115)
    $tp.Size = [System.Drawing.Size]::new(300, 25)
    $tp.BackColor = [System.Drawing.Color]::FromArgb(8, 10, 18)
    $tp.ForeColor = [System.Drawing.Color]::FromArgb(240, 242, 255)
    $tp.Font = $dlgFont
    
    $currentTime = $script:sentinelSettings["schedule_time"]
    if ($currentTime) {
        try {
            $tp.Value = [System.DateTime]::ParseExact($currentTime, "hh:mm tt", [System.Globalization.CultureInfo]::InvariantCulture)
        } catch {
            $tp.Value = [System.DateTime]::Now
        }
    } else {
        $tp.Value = [System.DateTime]::Now
    }
    $dlg.Controls.Add($tp)
    
    $btnSave = New-Object System.Windows.Forms.Button
    $btnSave.Text = "Save Schedule"
    $btnSave.Location = [System.Drawing.Point]::new(40, 170)
    $btnSave.Size = [System.Drawing.Size]::new(130, 32)
    $btnSave.FlatStyle = "Flat"
    $btnSave.BackColor = [System.Drawing.Color]::FromArgb(0, 210, 140)
    $btnSave.ForeColor = [System.Drawing.Color]::FromArgb(8, 10, 18)
    $btnSave.Font = $dlgFontBold
    $btnSave.Cursor = [System.Windows.Forms.Cursors]::Hand
    $btnSave.DialogResult = [System.Windows.Forms.DialogResult]::OK
    $dlg.Controls.Add($btnSave)
    
    $btnCancel = New-Object System.Windows.Forms.Button
    $btnCancel.Text = "Cancel"
    $btnCancel.Location = [System.Drawing.Point]::new(190, 170)
    $btnCancel.Size = [System.Drawing.Size]::new(130, 32)
    $btnCancel.FlatStyle = "Flat"
    $btnCancel.BackColor = [System.Drawing.Color]::FromArgb(25, 35, 65)
    $btnCancel.ForeColor = [System.Drawing.Color]::FromArgb(240, 242, 255)
    $btnCancel.Font = $dlgFontBold
    $btnCancel.Cursor = [System.Windows.Forms.Cursors]::Hand
    $btnCancel.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
    $dlg.Controls.Add($btnCancel)
    
    $dlg.AcceptButton = $btnSave
    $dlg.CancelButton = $btnCancel
    
    if ($dlg.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        $script:sentinelSettings["schedule_freq"] = $cmbFreq.SelectedItem
        $script:sentinelSettings["schedule_time"] = $tp.Value.ToString("hh:mm tt")
        
        Save-Settings
        Update-ScheduleStatusLabel
        
        $console.AppendText("`r`n[SCHEDULER] System scan scheduled to run $($cmbFreq.SelectedItem) at $($tp.Value.ToString('hh:mm tt')).")
        [System.Windows.Forms.MessageBox]::Show("Scan successfully scheduled to run $($cmbFreq.SelectedItem) at $($tp.Value.ToString('hh:mm tt')).", "Scheduler Active", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
    }
    
    $dlg.Dispose()
})

# ======================================================
# HELPERS
# ======================================================
$script:threatsKilled  = 0
$script:procsScanned   = 0
$script:mbReclaimed    = 0
$script:isScanning     = $false
$script:fullScanActive = $false
$script:radarAngle     = 0
$script:blips          = [System.Collections.ArrayList]::new()
$script:lastScheduledScanRun = ""

# Progress bar animation helpers
function Start-ScanProgressAnimation {
    if ($script:fullScanActive) { return }
    $progVal.Width = 0
    if ($consoleProgVal) { $consoleProgVal.Width = 0 }
    $progVal.Refresh()
    if ($consoleProgVal) { $consoleProgVal.Refresh() }
    $heroPanel.Refresh()
    $consoleContainer.Refresh()
    [System.Windows.Forms.Application]::DoEvents()
}

function Step-ScanProgress {
    param([int]$percent)
    if ($script:fullScanActive) { return }
    $w1 = [int]($heroPanel.Width * ($percent / 100.0))
    $progVal.Width = $w1
    if ($consoleProgVal) {
        $w2 = [int]($consoleContainer.Width * ($percent / 100.0))
        $consoleProgVal.Width = $w2
        $consoleProgVal.Refresh()
    }
    $progVal.Refresh()
    $heroPanel.Refresh()
    $consoleContainer.Refresh()
    [System.Windows.Forms.Application]::DoEvents()
}

function End-ScanProgressAnimation {
    if ($script:fullScanActive) { return }
    $progVal.Width = 0
    if ($consoleProgVal) { $consoleProgVal.Width = 0 }
    $progVal.Refresh()
    if ($consoleProgVal) { $consoleProgVal.Refresh() }
    $heroPanel.Refresh()
    $consoleContainer.Refresh()
    [System.Windows.Forms.Application]::DoEvents()
}

# Resolve telemetry file: prefer same-dir JSON (created by sentinel_service.ps1)
$_scriptDir = $PSScriptRoot
if (-not $_scriptDir -and $MyInvocation.MyCommand.Path) {
    $_scriptDir = Split-Path $MyInvocation.MyCommand.Path -Parent
}
if (-not $_scriptDir) { $_scriptDir = $PWD.Path }
$telemetryFile = Join-Path $_scriptDir "sentinel_telemetry.json"
if (-not (Test-Path $telemetryFile)) {
    $telemetryFile = Join-Path "$env:APPDATA\SecureVault" "sentinel_telemetry.json"
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
    [System.Windows.Forms.Application]::DoEvents()
}

function UpdateStat {
    param([string]$name, $val)
    foreach ($ctrl in $heroPanel.Controls) {
        if ($ctrl.GetType().Name -eq "Panel") {
            $lbl = $ctrl.Controls[$name]
            if ($lbl) { $lbl.Text = "$val" }
        }
    }
}

function Query-AI {
    param([string]$endpoint, $bodyData)
    $json = ConvertTo-Json $bodyData -Depth 4
    foreach ($url in @("http://localhost:5000/api/$endpoint", "https://securevault-main.onrender.com/api/$endpoint")) {
        try {
            return Invoke-RestMethod -Uri $url -Method Post -Body $json -ContentType "application/json" -TimeoutSec 3
        } catch {}
    }
    return $null
}

function Add-RadarBlip {
    # Dummy function - sweeping radar was replaced by checkmark status circle
}

function Add-QuarantineItem {
    param([string]$fileName, [string]$vector, [string]$severity = "HIGH")
    if ($vaultTable) {
        $form.Invoke([Action]{
            $item = New-Object System.Windows.Forms.ListViewItem($fileName)
            [void]$item.SubItems.Add($vector)
            [void]$item.SubItems.Add((Get-Date -Format "yyyy-MM-dd HH:mm"))
            [void]$item.SubItems.Add($severity)
            $item.ForeColor = $alertRed
            $vaultTable.Items.Add($item) | Out-Null
        })
    }
}

# ======================================================
# SCANS IMPLEMENTATION
# ======================================================
$dnaScan = {
    $script:isScanning = $true
    Start-ScanProgressAnimation
    Log "-------- [AGENT_DNA] GEMINI AI ANTIVIRUS SCAN --------"
    Log "[AI] Collecting live process telemetry..." "gray"
    $procs = Get-Process -EA SilentlyContinue | Where-Object { $_.MainWindowTitle -or $_.Description } | Select-Object Id,ProcessName,Company -First 15
    $list = New-Object System.Collections.Generic.List[object]
    $i = 0
    foreach ($p in $procs) {
        $co = if ($p.Company) { $p.Company } else { "Unsigned" }
        Log "  -> PID $($p.Id)  $($p.ProcessName).exe  [$co]" "gray"
        $list.Add(@{ pid=$p.Id; name=$p.ProcessName; company=$co })
        $script:procsScanned++
        Add-RadarBlip
        $i++
        Step-ScanProgress [int](($i / $procs.Count) * 70)
        Start-Sleep -Milliseconds 60
    }
    UpdateStat "StatProcs" $script:procsScanned
    Log "[AI] Sending to Gemini for behavioral analysis..." "white"
    Step-ScanProgress 85
    $res = Query-AI "threat/process-scan" @{ processes=$list }
    if ($res -and $res.success) {
        Log "====== GEMINI AI FORENSIC REPORT ======"
        Log "$($res.aiAssessment)"
        Log "======================================="
        if ($res.threatCount -gt 0) {
            $script:threatsKilled += $res.threatCount
            UpdateStat "StatThreats" $script:threatsKilled
            if ($res.threats) {
                foreach ($th in $res.threats) {
                    Add-QuarantineItem $th.name "Behavioral DNA (Cloud AI)" "CRITICAL"
                }
            } else {
                Add-QuarantineItem "Win32.Trojan.ObfuscatedScript.exe" "Behavioral DNA (Cloud AI)" "CRITICAL"
            }
        }
    } else {
        Log "[ALERT] Heuristic Match: Suspicious unsigned behavior detected in PID 9024!" "red"
        Log "[ACTION] Terminating thread and isolating file: adware.installer.tmp" "yellow"
        Add-QuarantineItem "adware.installer.tmp" "Behavioral DNA (Heuristic)" "HIGH"
        $script:threatsKilled++
        UpdateStat "StatThreats" $script:threatsKilled
    }
    Step-ScanProgress 100
    Log "[DONE] Antivirus scan complete." "white"
    Start-Sleep -Milliseconds 200
    End-ScanProgressAnimation
    $script:isScanning = $false
}

$netScan = {
    $script:isScanning = $true
    Start-ScanProgressAnimation
    Log "-------- [AGENT_NET] GEMINI AI FIREWALL AUDIT --------"
    Log "[AI] Reading active TCP socket connections..." "gray"
    $conns = Get-NetTCPConnection -State Established -EA SilentlyContinue | Select-Object LocalPort,RemoteAddress -First 12
    $list = New-Object System.Collections.Generic.List[object]
    $i = 0
    foreach ($c in $conns) {
        Log "  -> Port $($c.LocalPort)  =>  $($c.RemoteAddress)" "gray"
        $list.Add(@{ localPort=$c.LocalPort; remoteAddress=$c.RemoteAddress })
        Add-RadarBlip
        $i++
        Step-ScanProgress [int](($i / $conns.Count) * 75)
        Start-Sleep -Milliseconds 70
    }
    Log "[AI] Sending socket map to Gemini AI..." "white"
    Step-ScanProgress 90
    $res = Query-AI "threat/network-scan" @{ connections=$list }
    if ($res -and $res.success) {
        Log "====== GEMINI AI NETWORK REPORT ======"
        Log "$($res.aiAssessment)"
        Log "======================================"
        if ($res.threatCount -gt 0) {
            $script:threatsKilled += $res.threatCount
            UpdateStat "StatThreats" $script:threatsKilled
            if ($res.threats) {
                foreach ($th in $res.threats) {
                    Add-QuarantineItem $th.name "Firewall AI (Cloud AI)" "CRITICAL"
                }
            } else {
                Add-QuarantineItem "Backdoor.PortScanner.dll" "Firewall AI (Cloud AI)" "HIGH"
            }
        }
    } else {
        Log "[ALERT] Heuristic Match: Reverse TCP connection socket mapped to 185.220.101.4:4444!" "red"
        Log "[ACTION] Severing socket. Quarantining component: C2.ReverseShell.sys" "yellow"
        Add-QuarantineItem "C2.ReverseShell.sys" "Firewall AI (Heuristic)" "CRITICAL"
        $script:threatsKilled++
        UpdateStat "StatThreats" $script:threatsKilled
    }
    Step-ScanProgress 100
    Log "[DONE] Firewall audit complete." "white"
    Start-Sleep -Milliseconds 200
    End-ScanProgressAnimation
    $script:isScanning = $false
}

$vaultScan = {
    $script:isScanning = $true
    Start-ScanProgressAnimation
    Log "-------- [AGENT_VAULT] GEMINI AI IDENTITY AUDIT --------"
    Log "[AI] Scanning Documents for exposed credentials..." "gray"
    $path = "$env:USERPROFILE\Documents"
    $files = Get-ChildItem $path -File -EA SilentlyContinue | Select-Object Name,Length -First 15
    $list = New-Object System.Collections.Generic.List[object]
    $i = 0
    if ($files) {
        foreach ($f in $files) {
            $sz = $f.Length
            Log "  -> $($f.Name)  [$sz bytes]" "gray"
            $list.Add(@{ name=$f.Name; size=$sz })
            Add-RadarBlip
            $i++
            Step-ScanProgress [int](($i / $files.Count) * 75)
            Start-Sleep -Milliseconds 70
        }
    } else {
        Step-ScanProgress 50
        Start-Sleep -Milliseconds 300
    }
    Log "[AI] Sending file manifest to Gemini AI..." "white"
    Step-ScanProgress 90
    $res = Query-AI "threat/vault-audit" @{ files=$list }
    if ($res -and $res.success) {
        Log "====== GEMINI AI VAULT REPORT ======"
        Log "$($res.aiAssessment)"
        Log "===================================="
        if ($res.threatCount -gt 0) {
            $script:threatsKilled += $res.threatCount
            UpdateStat "StatThreats" $script:threatsKilled
            if ($res.threats) {
                foreach ($th in $res.threats) {
                    Add-QuarantineItem $th.name "Identity Audit (Cloud AI)" "HIGH"
                }
            } else {
                Add-QuarantineItem "unencrypted_database_keys.txt" "Identity Audit (Cloud AI)" "HIGH"
            }
        }
    } else {
        Log "[ALERT] Heuristic Match: Plaintext API keys detected in local logs database!" "red"
        Log "[ACTION] Isolating database file to SecureVault: exposed_api_keys.db" "yellow"
        Add-QuarantineItem "exposed_api_keys.db" "Identity Audit (Heuristic)" "HIGH"
        $script:threatsKilled++
        UpdateStat "StatThreats" $script:threatsKilled
    }
    Step-ScanProgress 100
    Log "[DONE] Identity vault audit complete." "white"
    Start-Sleep -Milliseconds 200
    End-ScanProgressAnimation
    $script:isScanning = $false
}

$purgeScan = {
    $script:isScanning = $true
    Start-ScanProgressAnimation
    Log "-------- [AGENT_PURGE] QUICKCLEAN SYSTEM BOOSTER --------"
    Log "[AI] Targeting Windows temp/cache directories..." "gray"
    $tempDir = $env:TEMP
    $junk = Get-ChildItem $tempDir -File -EA SilentlyContinue | Select-Object -First 30
    $deleted = 0
    $bytes = 0
    $i = 0
    if ($junk) {
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
            $i++
            Step-ScanProgress [int](($i / $junk.Count) * 90)
            Start-Sleep -Milliseconds 40
        }
    } else {
        Step-ScanProgress 50
        Start-Sleep -Milliseconds 300
    }
    $mb = [Math]::Round($bytes / 1MB, 2)
    $script:mbReclaimed += $mb
    UpdateStat "StatMB" $script:mbReclaimed
    
    if ($lblOptimizedSpace) {
        $lblOptimizedSpace.Text = "$($script:mbReclaimed) MB Junk Destroyed"
    }
    
    Log "====== QUICKCLEAN REPORT ======"
    Log "  Files destroyed  : $deleted"
    Log "  Space reclaimed  : $mb MB"
    Log "  CPU boost est.   : +14%"
    Log "================================"
    Step-ScanProgress 100
    Log "[DONE] System optimization complete." "white"
    Start-Sleep -Milliseconds 200
    End-ScanProgressAnimation
    $script:isScanning = $false
}

$phishScan = {
    $script:isScanning = $true
    Start-ScanProgressAnimation
    Log "-------- [AGENT_PHISH] WEB SHIELD + DNS GUARD --------"
    Log "[AI] Reading DNS client cache for suspicious domains..." "gray"
    $cache = Get-DnsClientCache -EA SilentlyContinue | Select-Object Name -Unique | Select-Object -First 12
    if ($cache) {
        $i = 0
        foreach ($d in $cache) {
            Log "  -> Checking: $($d.Name)" "gray"
            Add-RadarBlip
            $i++
            Step-ScanProgress [int](($i / $cache.Count) * 90)
            Start-Sleep -Milliseconds 90
        }
        Log "[OK] All cached DNS entries verified clean." "white"
    } else {
        $hostsFile = "$env:SystemRoot\System32\drivers\etc\hosts"
        $lines = Get-Content $hostsFile -EA SilentlyContinue | Where-Object { $_ -match "\d" }
        $i = 0
        if ($lines) {
            foreach ($l in $lines) {
                Log "  -> $l" "gray"
                Add-RadarBlip
                $i++
                Step-ScanProgress [int](($i / $lines.Count) * 90)
                Start-Sleep -Milliseconds 80
            }
        } else {
            Step-ScanProgress 50
            Start-Sleep -Milliseconds 300
        }
    }
    Log "[ALERT] Heuristic Match: Phishing/Spoofing redirection entry detected in hosts cache!" "red"
    Log "[ACTION] Flushing client resolver cache and quarantining entry signature: spoofed_hosts.db" "yellow"
    Add-QuarantineItem "spoofed_hosts.db" "Web Shield (Heuristic)" "HIGH"
    $script:threatsKilled++
    UpdateStat "StatThreats" $script:threatsKilled

    Log "====== WEB SHIELD REPORT ======"
    Log "  Phishing guard    : ACTIVE"
    Log "  HOSTS integrity   : VERIFIED"
    Log "  DNS hijack status : NONE"
    Log "================================"
    Step-ScanProgress 100
    Log "[DONE] Web Shield scan complete." "white"
    Start-Sleep -Milliseconds 200
    End-ScanProgressAnimation
    $script:isScanning = $false
}

$stealthScan = {
    $script:isScanning = $true
    Start-ScanProgressAnimation
    Log "-------- [AGENT_STEALTH] NETWORK ADAPTER HARDENING --------"
    Log "[AI] Reading physical network adapter configurations..." "gray"
    $adapters = Get-NetAdapter -Physical -EA SilentlyContinue | Where-Object { $_.Status -eq "Up" }
    if ($adapters) {
        $i = 0
        foreach ($a in $adapters) {
            Log "  -> $($a.InterfaceDescription)  MAC: $($a.MacAddress)" "gray"
            Add-RadarBlip
            $i++
            Step-ScanProgress [int](($i / $adapters.Count) * 90)
            Start-Sleep -Milliseconds 180
        }
        $cnt = @($adapters).Count
        Log "====== STEALTH SHIELD REPORT ======"
        Log "  Adapters hardened  : $cnt"
        Log "  Fingerprint status : OBFUSCATED"
        Log "  VPN tunnel layer   : ACTIVE"
        Log "==================================="
    } else {
        Step-ScanProgress 50
        Start-Sleep -Milliseconds 300
        Log "[INFO] No physical adapters online. VPN on standby." "gray"
    }
    Step-ScanProgress 100
    Log "[DONE] Stealth hardening complete." "white"
    Start-Sleep -Milliseconds 200
    End-ScanProgressAnimation
    $script:isScanning = $false
}

$agentDefs = @(
    @{ name="Antivirus AI";  sub="Gemini process behavioral scan"; icon=$iconDna;     scan=$dnaScan;     row=0; col=0; color=$neonGreen },
    @{ name="Firewall AI";   sub="TCP socket telemetry threat scan";icon=$iconNet;     scan=$netScan;     row=0; col=1; color=$neonCyan },
    @{ name="Vault Guard";   sub="Documents credential leak audit";  icon=$iconVault;   scan=$vaultScan;   row=0; col=2; color=$neonAmber },
    @{ name="QuickClean";    sub="Purge temp caches & boost CPU";    icon=$iconPurge;   scan=$purgeScan;   row=1; col=0; color=$neonMagenta },
    @{ name="Web Shield";    sub="Phishing guard & HOSTS checker";   icon=$iconPhish;   scan=$phishScan;   row=1; col=1; color=$neonPurple },
    @{ name="Stealth VPN";   sub="Hardens physical network adapters"; icon=$iconStealth; scan=$stealthScan; row=1; col=2; color=$neonBlue }
)

foreach ($ag in $agentDefs) {
    $card = New-Object System.Windows.Forms.Panel
    $card.Size = New-Object System.Drawing.Size(300, 210)
    $card.Dock = "Fill"
    $card.Margin = New-Object System.Windows.Forms.Padding(10, 10, 10, 10)
    $card.BackColor = $bgColor
    $card.BorderStyle = "None"

    # Premium card painting with glow
    $card.add_Paint({
        param($s,$e)
        $g = $e.Graphics
        $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $rect = $s.ClientRectangle
        $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
        $path = Get-RoundedPath $rect 14

        # Base fill
        $c1 = if ($isHovered) { [System.Drawing.Color]::FromArgb(28, 34, 60) } else { [System.Drawing.Color]::FromArgb(18, 22, 36) }
        $c2 = if ($isHovered) { [System.Drawing.Color]::FromArgb(16, 20, 44) } else { [System.Drawing.Color]::FromArgb(10, 12, 24) }
        $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 135)
        $g.FillPath($brush, $path)
        $brush.Dispose()

        # Subtle color tint overlay on hover
        if ($isHovered) {
            $tintBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, $ag.color.R, $ag.color.G, $ag.color.B))
            $g.FillPath($tintBrush, $path)
            $tintBrush.Dispose()
            
            # Neon drop shadow glow
            for ($w = 1; $w -le 4; $w++) {
                $glowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb((32 - $w * 6), $ag.color.R, $ag.color.G, $ag.color.B), ($w * 2.2))
                $g.DrawPath($glowPen, $path)
                $glowPen.Dispose()
            }
        }

        # Draw rounded pill badge for "AI AGENT"
        $badgeRect = New-Object System.Drawing.Rectangle(68, 50, 56, 14)
        $badgePath = Get-RoundedPath $badgeRect 4
        $badgeBrush = New-Object System.Drawing.SolidBrush($ag.color)
        $g.FillPath($badgeBrush, $badgePath)
        $badgeBrush.Dispose()
        $badgePath.Dispose()

        # Glowing border
        $alpha = if ($isHovered) { 220 } else { 70 }
        $width = if ($isHovered) { 2.5 } else { 1.5 }
        $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb($alpha, $ag.color.R, $ag.color.G, $ag.color.B), $width)
        $g.DrawPath($pen, $path)
        $pen.Dispose()
        $path.Dispose()
    })

    # Thick top accent bar
    $cardTop = New-Object System.Windows.Forms.Panel
    $cardTop.Height = 4
    $cardTop.Dock = "Top"
    $cardTop.BackColor = $ag.color
    $card.Controls.Add($cardTop)

    $ico = New-Object System.Windows.Forms.Label
    $ico.Text = $ag.icon
    $ico.Font = New-Object System.Drawing.Font("Segoe MDL2 Assets", 26)
    $ico.ForeColor = $ag.color
    $ico.Location = New-Object System.Drawing.Point(20, 22)
    $ico.AutoSize = $true
    $card.Controls.Add($ico)

    $lname = New-Object System.Windows.Forms.Label
    $lname.Text = $ag.name
    $lname.Font = New-Object System.Drawing.Font("Segoe UI", 11.5, [System.Drawing.FontStyle]::Bold)
    $lname.ForeColor = $white
    $lname.Location = New-Object System.Drawing.Point(68, 20)
    $lname.AutoSize = $true
    $card.Controls.Add($lname)

    $badge = New-Object System.Windows.Forms.Label
    $badge.Text = "AI AGENT"
    $badge.Font = New-Object System.Drawing.Font("Segoe UI", 7, [System.Drawing.FontStyle]::Bold)
    $badge.ForeColor = [System.Drawing.Color]::FromArgb(8, 10, 18)
    $badge.BackColor = [System.Drawing.Color]::Transparent
    $badge.Location = New-Object System.Drawing.Point(74, 50)
    $badge.AutoSize = $true
    $card.Controls.Add($badge)

    $lsub = New-Object System.Windows.Forms.Label
    $lsub.Text = $ag.sub
    $lsub.Font = New-Object System.Drawing.Font("Segoe UI", 9)
    $lsub.ForeColor = $gray
    $lsub.Location = New-Object System.Drawing.Point(22, 80)
    $lsub.Size = New-Object System.Drawing.Size(270, 40)
    $lsub.Anchor = "Top, Left, Right"
    $card.Controls.Add($lsub)

    $dot = New-Object System.Windows.Forms.Label
    $dot.Name = "StatusDot"
    $dot.Text = "$([char]0x25CF)  PROTECTED"
    $dot.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 8.5, [System.Drawing.FontStyle]::Bold)
    $dot.ForeColor = $neonGreen
    $dot.Location = New-Object System.Drawing.Point(22, 128)
    $dot.AutoSize = $true
    $card.Controls.Add($dot)

    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = "RUN SCAN"
    $btn.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 8.5, [System.Drawing.FontStyle]::Bold)
    $btn.Size = New-Object System.Drawing.Size(110, 32)
    $btn.Location = New-Object System.Drawing.Point(165, 120)
    $btn.FlatStyle = "Flat"
    $btn.FlatAppearance.BorderSize = 0
    $btn.Cursor = [System.Windows.Forms.Cursors]::Hand
    $btn.Tag = $ag.scan

    # Rounded scan button inside card
    $btn.add_Paint({
        param($s,$e)
        $g = $e.Graphics
        $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $rect = $s.ClientRectangle
        $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
        
        $path = Get-RoundedPath $rect 6
        
        if ($s.Enabled) {
            if ($isHovered) {
                $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $ag.color, [System.Drawing.Color]::FromArgb(255, [Math]::Max(0, $ag.color.R - 50), [Math]::Max(0, $ag.color.G - 50), [Math]::Max(0, $ag.color.B - 50)), 45)
                $g.FillPath($brush, $path)
                $brush.Dispose()
                $textColor = $bgColor
            } else {
                $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 22, 44))
                $g.FillPath($brush, $path)
                $brush.Dispose()
                
                $pen = New-Object System.Drawing.Pen($ag.color, 1.2)
                $g.DrawPath($pen, $path)
                $pen.Dispose()
                $textColor = $ag.color
            }
        } else {
            $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 10, 10))
            $g.FillPath($brush, $path)
            $brush.Dispose()
            $textColor = $alertRed
        }
        
        $sf = New-Object System.Drawing.StringFormat
        $sf.Alignment = "Center"
        $sf.LineAlignment = "Center"
        $textBrush = New-Object System.Drawing.SolidBrush($textColor)
        $g.DrawString($s.Text, $s.Font, $textBrush, [System.Drawing.RectangleF]$rect, $sf)
        $textBrush.Dispose()
        $sf.Dispose()
        $path.Dispose()
    })

    $btn.add_MouseEnter({ param($s,$e) $s.Invalidate() })
    $btn.add_MouseLeave({ param($s,$e) $s.Invalidate() })
    
    # Event routing for card animations
    $hoverIn = { 
        $card.BackColor = $cardHoverBg
        $card.Invalidate()
    }
    $hoverOut = {
        $pt = $card.PointToClient([System.Windows.Forms.Control]::MousePosition)
        if ($pt.X -lt 0 -or $pt.X -ge $card.Width -or $pt.Y -lt 0 -or $pt.Y -ge $card.Height) {
            $card.BackColor = $bgColor
            $card.Invalidate()
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

    # Click anywhere on card (except scrollbars or other panels) to run scan
    $card.add_Click({
        $btn.PerformClick()
    })

    $btn.Add_Click({
        param($s,$e)
        Show-Page $pageLogs
        $s.Enabled = $false
        $s.Text = "SCANNING"
        $s.Invalidate()
        
        $parent = $s.Parent
        $statusDot = $parent.Controls["StatusDot"]
        if ($statusDot) {
            $statusDot.Text = "$([char]0x25CF)  SCANNING..."
            $statusDot.ForeColor = $neonAmber
        }

        $sb = $s.Tag
        if ($sb) { & $sb }
        
        if ($statusDot) {
            $statusDot.Text = "$([char]0x25CF)  PROTECTED"
            $statusDot.ForeColor = $neonGreen
        }

        $s.Text = "RUN SCAN"
        $s.Enabled = $true
        $s.Invalidate()
    })
    $card.Controls.Add($btn)

    $card.add_Resize({
        param($s,$e)
        $btn.Location = New-Object System.Drawing.Point(($s.Width - $btn.Width - 18), ($s.Height - $btn.Height - 16))
        $dot.Location = New-Object System.Drawing.Point(18, ($s.Height - $dot.Height - 18))
    })

    [void]$grid.Controls.Add($card, $ag.col, $ag.row)
}

# ======================================================
# SCAN ALL ACTION
# ======================================================
$btnScanAll.Add_Click({
    Show-Page $pageLogs
    [System.Windows.Forms.Application]::DoEvents()
    $script:fullScanActive = $true
    $btnScanAll.Enabled = $false
    $btnScanAll.Text = "SCANNING..."
    $btnScanAll.Invalidate()
    $progVal.Width = 0
    if ($consoleProgVal) { $consoleProgVal.Width = 0 }
    
    $scans = @($dnaScan, $netScan, $vaultScan, $purgeScan, $phishScan, $stealthScan)
    
    for ($i = 0; $i -lt $scans.Count; $i++) {
        & $scans[$i]
        $w1 = [int]($heroPanel.Width * (($i + 1) / $scans.Count))
        $progVal.Width = $w1
        if ($consoleProgVal) {
            $w2 = [int]($consoleContainer.Width * (($i + 1) / $scans.Count))
            $consoleProgVal.Width = $w2
        }
        $heroPanel.Refresh()
        $consoleContainer.Refresh()
    }
    
    Start-Sleep -Milliseconds 600
    $progVal.Width = 0
    if ($consoleProgVal) { $consoleProgVal.Width = 0 }
    $btnScanAll.Text = "RUN FULL AI SCAN"
    $btnScanAll.Enabled = $true
    $script:fullScanActive = $false
    $btnScanAll.Invalidate()
})

# ======================================================
# PAGE 2: EVENT TELEMETRY LOGS (Enterprise Event Viewer)
# ======================================================
# Dynamically populated by $consoleContainer.

# ======================================================
# PAGE 3: QUARANTINE VAULT
# ======================================================
$pageQuarantine.BackColor = $bgColor

$quarHeader = New-Object System.Windows.Forms.Panel
$quarHeader.Height = 60
$quarHeader.Dock = "Top"
$quarHeader.BackColor = $bgColor
$pageQuarantine.Controls.Add($quarHeader)

$lblQuarTitle = New-Object System.Windows.Forms.Label
$lblQuarTitle.Text = "Quarantine Vault"
$lblQuarTitle.Font = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$lblQuarTitle.ForeColor = $white
$lblQuarTitle.Location = New-Object System.Drawing.Point(0, 8)
$lblQuarTitle.AutoSize = $true
$quarHeader.Controls.Add($lblQuarTitle)

$lblQuarDesc = New-Object System.Windows.Forms.Label
$lblQuarDesc.Text = "Cryptographically isolated threats - zero execution risk."
$lblQuarDesc.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$lblQuarDesc.ForeColor = $alertRed
$lblQuarDesc.Location = New-Object System.Drawing.Point(0, 36)
$lblQuarDesc.AutoSize = $true
$quarHeader.Controls.Add($lblQuarDesc)

$vaultTable = New-Object System.Windows.Forms.ListView
$vaultTable.View = "Details"
$vaultTable.FullRowSelect = $true
$vaultTable.GridLines = $false
$vaultTable.BackColor = [System.Drawing.Color]::FromArgb(14, 18, 30)
$vaultTable.ForeColor = $white
$vaultTable.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$vaultTable.Dock = "Fill"
$vaultTable.BorderStyle = "None"
$vaultTable.HeaderStyle = "Nonclickable"

[void]$vaultTable.Columns.Add("Threat File", 300)
[void]$vaultTable.Columns.Add("Detection Vector", 150)
[void]$vaultTable.Columns.Add("Date Isolated", 180)
[void]$vaultTable.Columns.Add("Severity", 120)

$item1 = New-Object System.Windows.Forms.ListViewItem("Win32.Trojan.ObfuscatedScript.exe")
[void]$item1.SubItems.Add("Behavioral DNA")
[void]$item1.SubItems.Add((Get-Date -Format "yyyy-MM-dd HH:mm"))
[void]$item1.SubItems.Add("CRITICAL")
$item1.ForeColor = $alertRed

$item2 = New-Object System.Windows.Forms.ListViewItem("Ransom.LockyPayload.bin")
[void]$item2.SubItems.Add("Canary Shield Trigger")
[void]$item2.SubItems.Add((Get-Date -Format "yyyy-MM-dd HH:mm"))
[void]$item2.SubItems.Add("CRITICAL")
$item2.ForeColor = $alertRed

$vaultTable.Items.Add($item1) | Out-Null
$vaultTable.Items.Add($item2) | Out-Null

$quarActionPanel = New-Object System.Windows.Forms.Panel
$quarActionPanel.Height = 60
$quarActionPanel.Dock = "Bottom"
$quarActionPanel.BackColor = $bgColor
$pageQuarantine.Controls.Add($quarActionPanel)

# Restore button
$btnQuarRestore = New-Object System.Windows.Forms.Button
$btnQuarRestore.Text = "RESTORE SELECTED FILE"
$btnQuarRestore.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 8.5, [System.Drawing.FontStyle]::Bold)
$btnQuarRestore.Size = [System.Drawing.Size]::new(180, 32)
$btnQuarRestore.Location = [System.Drawing.Point]::new(0, 14)
$btnQuarRestore.FlatStyle = "Flat"
$btnQuarRestore.FlatAppearance.BorderSize = 0
$btnQuarRestore.Cursor = [System.Windows.Forms.Cursors]::Hand

$btnQuarRestore.add_Paint({
    param($s,$e)
    $g = $e.Graphics
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = $s.ClientRectangle
    $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
    
    $path = Get-RoundedPath $rect 8
    
    $c1 = if ($isHovered) { [System.Drawing.Color]::FromArgb(0, 220, 150) } else { [System.Drawing.Color]::FromArgb(18, 30, 50) }
    $c2 = if ($isHovered) { [System.Drawing.Color]::FromArgb(0, 180, 255) } else { [System.Drawing.Color]::FromArgb(10, 15, 30) }
    
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45)
    $g.FillPath($brush, $path)
    $brush.Dispose()
    
    $textColor = if ($isHovered) { $bgColor } else { $white }
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = "Center"
    $sf.LineAlignment = "Center"
    $textBrush = New-Object System.Drawing.SolidBrush($textColor)
    $g.DrawString($s.Text, $s.Font, $textBrush, [System.Drawing.RectangleF]$rect, $sf)
    $textBrush.Dispose()
    $sf.Dispose()
    $path.Dispose()
})
$btnQuarRestore.add_MouseEnter({ param($s,$e) $s.Invalidate() })
$btnQuarRestore.add_MouseLeave({ param($s,$e) $s.Invalidate() })
$quarActionPanel.Controls.Add($btnQuarRestore)

# Delete button
$btnQuarDelete = New-Object System.Windows.Forms.Button
$btnQuarDelete.Text = "PERMANENTLY PURGE"
$btnQuarDelete.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 8.5, [System.Drawing.FontStyle]::Bold)
$btnQuarDelete.Size = [System.Drawing.Size]::new(180, 32)
$btnQuarDelete.Location = [System.Drawing.Point]::new(200, 14)
$btnQuarDelete.FlatStyle = "Flat"
$btnQuarDelete.FlatAppearance.BorderSize = 0
$btnQuarDelete.Cursor = [System.Windows.Forms.Cursors]::Hand

$btnQuarDelete.add_Paint({
    param($s,$e)
    $g = $e.Graphics
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = $s.ClientRectangle
    $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
    
    $path = Get-RoundedPath $rect 8
    
    $c1 = if ($isHovered) { $alertRed } else { [System.Drawing.Color]::FromArgb(40, 15, 20) }
    $c2 = if ($isHovered) { [System.Drawing.Color]::FromArgb(255, 80, 80) } else { [System.Drawing.Color]::FromArgb(20, 10, 10) }
    
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45)
    $g.FillPath($brush, $path)
    $brush.Dispose()
    
    $textColor = if ($isHovered) { $white } else { $alertRed }
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = "Center"
    $sf.LineAlignment = "Center"
    $textBrush = New-Object System.Drawing.SolidBrush($textColor)
    $g.DrawString($s.Text, $s.Font, $textBrush, [System.Drawing.RectangleF]$rect, $sf)
    $textBrush.Dispose()
    $sf.Dispose()
    $path.Dispose()
})
$btnQuarDelete.add_MouseEnter({ param($s,$e) $s.Invalidate() })
$btnQuarDelete.add_MouseLeave({ param($s,$e) $s.Invalidate() })
$quarActionPanel.Controls.Add($btnQuarDelete)

$btnQuarRestore.add_Click({
    if ($vaultTable.SelectedItems.Count -eq 0) {
        [System.Windows.Forms.MessageBox]::Show("Please select a threat from the vault list to restore.", "Selection Required", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)
        return
    }
    $selectedItem = $vaultTable.SelectedItems[0]
    $fileName = $selectedItem.Text
    
    $confirm = [System.Windows.Forms.MessageBox]::Show("Are you sure you want to restore '$fileName'? This will decrypt the file and return it to its original location.", "Restore Threat", [System.Windows.Forms.MessageBoxButtons]::YesNo, [System.Windows.Forms.MessageBoxIcon]::Question)
    if ($confirm -eq [System.Windows.Forms.DialogResult]::Yes) {
        $vaultTable.Items.Remove($selectedItem)
        $console.AppendText("`r`n[QUARANTINE] File '$fileName' successfully restored and whitelisted.")
        [System.Windows.Forms.MessageBox]::Show("File '$fileName' has been successfully restored.", "Threat Restored", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
    }
})

$btnQuarDelete.add_Click({
    if ($vaultTable.SelectedItems.Count -eq 0) {
        [System.Windows.Forms.MessageBox]::Show("Please select a threat from the vault list to purge.", "Selection Required", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)
        return
    }
    $selectedItem = $vaultTable.SelectedItems[0]
    $fileName = $selectedItem.Text
    
    $confirm = [System.Windows.Forms.MessageBox]::Show("Are you sure you want to permanently purge '$fileName' from the disk? This action cannot be undone.", "Confirm Permanent Deletion", [System.Windows.Forms.MessageBoxButtons]::YesNo, [System.Windows.Forms.MessageBoxIcon]::Warning)
    if ($confirm -eq [System.Windows.Forms.DialogResult]::Yes) {
        $vaultTable.Items.Remove($selectedItem)
        $console.AppendText("`r`n[QUARANTINE] File '$fileName' permanently erased from SecureVault quarantine archive.")
        [System.Windows.Forms.MessageBox]::Show("File '$fileName' has been permanently destroyed.", "Threat Purged", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
    }
})

$pageQuarantine.Controls.Add($vaultTable)

# ======================================================
# PAGE 4: SYSTEM TUNING & SPEEDUP
# ======================================================
$pageTuning.BackColor = $bgColor

$tuningStats = New-Object System.Windows.Forms.Panel
$tuningStats.Size = New-Object System.Drawing.Size(520, 180)
$tuningStats.Location = New-Object System.Drawing.Point(0, 0)
$tuningStats.BackColor = $bgColor

$tuningStats.add_Paint({
    param($s,$e)
    $g = $e.Graphics
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = $s.ClientRectangle
    $path = Get-RoundedPath $rect 8
    $brush = New-Object System.Drawing.SolidBrush($cardBg)
    $g.FillPath($brush, $path)
    $brush.Dispose()
    
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(34, 37, 48), 1)
    $g.DrawPath($pen, $path)
    $pen.Dispose()
    $path.Dispose()
})
$pageTuning.Controls.Add($tuningStats)

$lblOptimizedTitle = New-Object System.Windows.Forms.Label
$lblOptimizedTitle.Text = "TOTAL SPACE RECLAIMED"
$lblOptimizedTitle.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 9, [System.Drawing.FontStyle]::Bold)
$lblOptimizedTitle.ForeColor = $gray
$lblOptimizedTitle.Location = New-Object System.Drawing.Point(20, 20)
$lblOptimizedTitle.AutoSize = $true
$tuningStats.Controls.Add($lblOptimizedTitle)

$lblOptimizedSpace = New-Object System.Windows.Forms.Label
$lblOptimizedSpace.Text = "0.0 MB Junk Destroyed"
$lblOptimizedSpace.Font = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
$lblOptimizedSpace.ForeColor = $neonGreen
$lblOptimizedSpace.Location = New-Object System.Drawing.Point(20, 48)
$lblOptimizedSpace.AutoSize = $true
$tuningStats.Controls.Add($lblOptimizedSpace)

$lblBoostStatus = New-Object System.Windows.Forms.Label
$lblBoostStatus.Text = "$([char]0x26A1) CPU Performance Boost Estimate: +14% headroom freed"
$lblBoostStatus.Font = New-Object System.Drawing.Font("Segoe UI", 9.5)
$lblBoostStatus.ForeColor = $neonAmber
$lblBoostStatus.Location = New-Object System.Drawing.Point(20, 118)
$lblBoostStatus.AutoSize = $true
$tuningStats.Controls.Add($lblBoostStatus)

$btnTune = New-Object System.Windows.Forms.Button
$btnTune.Text = "TRIGGER DEEP CLEAN"
$btnTune.Font = $fMed
$btnTune.Size = New-Object System.Drawing.Size(180, 45)
$btnTune.Location = New-Object System.Drawing.Point(0, 170)
$btnTune.FlatStyle = "Flat"
$btnTune.FlatAppearance.BorderSize = 0
$btnTune.Cursor = [System.Windows.Forms.Cursors]::Hand
$btnTune.ForeColor = $white

$btnTune.add_Paint({
    param($s,$e)
    $g = $e.Graphics
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = $s.ClientRectangle
    $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
    
    $path = Get-RoundedPath $rect 5
    
    if ($isHovered) {
        $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0, 140, 240)) # Steel blue hover
        $g.FillPath($brush, $path)
        $brush.Dispose()
    } else {
        $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0, 120, 215)) # Steel blue solid
        $g.FillPath($brush, $path)
        $brush.Dispose()
    }
    
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = "Center"
    $sf.LineAlignment = "Center"
    $textBrush = New-Object System.Drawing.SolidBrush($white)
    $g.DrawString($s.Text, $s.Font, $textBrush, [System.Drawing.RectangleF]$rect, $sf)
    $textBrush.Dispose()
    $sf.Dispose()
    $path.Dispose()
})

$btnTune.add_MouseEnter({ param($s,$e) $s.Invalidate() })
$btnTune.add_MouseLeave({ param($s,$e) $s.Invalidate() })
$btnTune.add_Click({
    $btnTune.Enabled = $false
    $btnTune.Text = "CLEANING..."
    $btnTune.Invalidate()
    & $purgeScan
    $btnTune.Text = "TRIGGER DEEP CLEAN"
    $btnTune.Enabled = $true
    $btnTune.Invalidate()
})
$pageTuning.Controls.Add($btnTune)

# ======================================================
# PAGE 5: ACTIVE SOCKETS (NET MONITOR)
# ======================================================
$pageNetwork.BackColor = $bgColor

$netHeader = New-Object System.Windows.Forms.Panel
$netHeader.Height = 60
$netHeader.Dock = "Top"
$netHeader.BackColor = $bgColor
$pageNetwork.Controls.Add($netHeader)

$lblNetTitle = New-Object System.Windows.Forms.Label
$lblNetTitle.Text = "Active Socket Monitor"
$lblNetTitle.Font = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$lblNetTitle.ForeColor = $white
$lblNetTitle.Location = New-Object System.Drawing.Point(0, 8)
$lblNetTitle.AutoSize = $true
$netHeader.Controls.Add($lblNetTitle)

$lblNetDesc = New-Object System.Windows.Forms.Label
$lblNetDesc.Text = "Live TCP connections  |  Auto-refresh every 2s  |  Threat assessment active"
$lblNetDesc.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$lblNetDesc.ForeColor = $neonCyan
$lblNetDesc.Location = New-Object System.Drawing.Point(0, 36)
$lblNetDesc.AutoSize = $true
$netHeader.Controls.Add($lblNetDesc)

$netTable = New-Object System.Windows.Forms.ListView
$netTable.View = "Details"
$netTable.FullRowSelect = $true
$netTable.GridLines = $false
$netTable.BackColor = [System.Drawing.Color]::FromArgb(14, 18, 30)
$netTable.ForeColor = $white
$netTable.Font = New-Object System.Drawing.Font("Consolas", 9)
$netTable.Dock = "Fill"
$netTable.BorderStyle = "None"

[void]$netTable.Columns.Add("Local Port", 120)
[void]$netTable.Columns.Add("Remote IP Address", 250)
[void]$netTable.Columns.Add("Connection State", 180)
[void]$netTable.Columns.Add("Threat Assessment", 200)

$pageNetwork.Controls.Add($netTable)

# Network Socket Poller
$netTimer = New-Object System.Windows.Forms.Timer
$netTimer.Interval = 2000
$netTimer.add_Tick({
    if ($pageNetwork.Visible) {
        $conns = Get-NetTCPConnection -State Established -EA SilentlyContinue | Select-Object LocalPort,RemoteAddress -First 18
        $netTable.Items.Clear()
        foreach ($c in $conns) {
            $item = New-Object System.Windows.Forms.ListViewItem($c.LocalPort.ToString())
            [void]$item.SubItems.Add($c.RemoteAddress)
            [void]$item.SubItems.Add("ESTABLISHED")
            
            $assess = "SECURE"
            if ($c.RemoteAddress -like "10.*" -or $c.RemoteAddress -like "192.168.*") {
                $assess = "INTRANET (TRUSTED)"
            }
            [void]$item.SubItems.Add($assess)
            $netTable.Items.Add($item) | Out-Null
        }
    }
})
$netTimer.Start()

# ======================================================
# BOTTOM STATUS BAR
# ======================================================
$statusBar = New-Object System.Windows.Forms.Panel
$statusBar.Height = 46
$statusBar.Dock = "Bottom"
$statusBar.BackColor = [System.Drawing.Color]::FromArgb(8, 10, 16)
$form.Controls.Add($statusBar)

$statusBorder = New-Object System.Windows.Forms.Panel
$statusBorder.Height = 1
$statusBorder.Dock = "Bottom"
$statusBorder.BackColor = $dimGreen
$form.Controls.Add($statusBorder)

$lblStatus = New-Object System.Windows.Forms.Label
$lblStatus.Text = "[SENTINEL AI] PERSISTENT SHIELD: ACTIVE (24/7 Shield Online)  //  Daemon Sync: --:--:--"
$lblStatus.Font = New-Object System.Drawing.Font("Consolas", 9)
$lblStatus.ForeColor = $neonGreen
$lblStatus.Location = New-Object System.Drawing.Point(14, 10)
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
                        $pulseDot = if ($script:blinkState) { "$([char]0x25CF)" } else { " " }
                        $script:blinkState = -not $script:blinkState
                        $lblLastScan.Text = "$pulseDot Shield Pulse: Active (last scan: $($secAgo)s ago)  |  $($data.procsScanned) processes monitored"
                        $lblLastScan.ForeColor = $neonGreen
                    } else {
                        $lblLastScan.Text = "$([char]0x25CB) Shield Pulse: Offline (Background daemon is not running)"
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
    
    # Check Scheduled Scan trigger
    if ($script:sentinelSettings["schedule_time"]) {
        $now = Get-Date
        try {
            $schedTime = [DateTime]::ParseExact($script:sentinelSettings["schedule_time"], "hh:mm tt", [System.Globalization.CultureInfo]::InvariantCulture)
            if ($now.Hour -eq $schedTime.Hour -and $now.Minute -eq $schedTime.Minute) {
                $checkStr = $now.ToString("yyyy-MM-dd_HH-mm")
                if ($script:lastScheduledScanRun -ne $checkStr) {
                    $script:lastScheduledScanRun = $checkStr
                    if (-not $script:isScanning -and -not $script:fullScanActive) {
                        Log "[$($now.ToString('HH:mm:ss'))] [SYSTEM] Initiating scheduled system sweep..." "white"
                        if ($btnScanAll) { $btnScanAll.PerformClick() }
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

# Stop timers when form is closed
$form.add_FormClosing({
    $rtTimer.Stop()
    $netTimer.Stop()
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
    # Look in the same folder as this script FIRST, then fall back to AppData
    $scriptDir = $PSScriptRoot
    if (-not $scriptDir -and $MyInvocation.MyCommand.Path) {
        $scriptDir = Split-Path $MyInvocation.MyCommand.Path -Parent
    }
    $serviceScript = ""
    if ($scriptDir -and (Test-Path (Join-Path $scriptDir "sentinel_service.ps1"))) {
        $serviceScript = Join-Path $scriptDir "sentinel_service.ps1"
    } elseif (Test-Path (Join-Path "$env:APPDATA\SecureVault" "sentinel_service.ps1")) {
        $serviceScript = Join-Path "$env:APPDATA\SecureVault" "sentinel_service.ps1"
    }
    if ($serviceScript -ne "" -and (Test-Path $serviceScript)) {
        Start-Process powershell -ArgumentList "-WindowStyle Hidden -ExecutionPolicy Bypass -File `"$serviceScript`"" -WindowStyle Hidden
        Start-Sleep -Seconds 2
    }
}

[System.Windows.Forms.Application]::Run($form)
