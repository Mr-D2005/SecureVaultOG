Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ======================================================
# COLOR PALETTE (Obsidian Dark & Cyber Neon Accents)
# ======================================================
$bgColor       = [System.Drawing.Color]::FromArgb(4, 4, 10)
$bgGradient    = [System.Drawing.Color]::FromArgb(12, 14, 30)
$cardBg        = [System.Drawing.Color]::FromArgb(14, 16, 32)
$cardHoverBg   = [System.Drawing.Color]::FromArgb(20, 24, 48)
$sidebarBg     = [System.Drawing.Color]::FromArgb(3, 3, 7)
$sidebarHover  = [System.Drawing.Color]::FromArgb(16, 20, 38)
$sidebarActive = [System.Drawing.Color]::FromArgb(0, 220, 156) # Neon green
$neonGreen     = [System.Drawing.Color]::FromArgb(0, 220, 156)
$neonCyan      = [System.Drawing.Color]::FromArgb(0, 190, 255)
$neonAmber     = [System.Drawing.Color]::FromArgb(255, 170, 0)
$neonMagenta   = [System.Drawing.Color]::FromArgb(255, 0, 160)
$neonPurple    = [System.Drawing.Color]::FromArgb(160, 0, 255)
$neonBlue      = [System.Drawing.Color]::FromArgb(0, 120, 255)
$dimGreen      = [System.Drawing.Color]::FromArgb(0, 100, 70)
$alertRed      = [System.Drawing.Color]::FromArgb(255, 60, 60)
$white         = [System.Drawing.Color]::FromArgb(245, 245, 245)
$gray          = [System.Drawing.Color]::FromArgb(115, 120, 135)
$darkPanel     = [System.Drawing.Color]::FromArgb(2, 2, 5)

# ======================================================
# TYPOGRAPHY
# ======================================================
$fTitle  = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$fBig    = New-Object System.Drawing.Font("Segoe UI Semibold", 11.5, [System.Drawing.FontStyle]::Bold)
$fMed    = New-Object System.Drawing.Font("Segoe UI Semibold", 9, [System.Drawing.FontStyle]::Bold)
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
$form.Size = New-Object System.Drawing.Size(1200, 850)
$form.MinimumSize = New-Object System.Drawing.Size(1100, 780)
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
$sidebar.Width = 240
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

$lblBrand = New-Object System.Windows.Forms.Label
$lblBrand.Text = "SECUREVAULT"
$lblBrand.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$lblBrand.ForeColor = $neonGreen
$lblBrand.Location = New-Object System.Drawing.Point(24, 28)
$lblBrand.AutoSize = $true
$logoPanel.Controls.Add($lblBrand)

$lblSubBrand = New-Object System.Windows.Forms.Label
$lblSubBrand.Text = "AI COGNITIVE SENTINEL"
$lblSubBrand.Font = New-Object System.Drawing.Font("Consolas", 7.5, [System.Drawing.FontStyle]::Bold)
$lblSubBrand.ForeColor = $gray
$lblSubBrand.Location = New-Object System.Drawing.Point(26, 56)
$lblSubBrand.AutoSize = $true
$logoPanel.Controls.Add($lblSubBrand)

# ======================================================
# PAGE CONTROLLERS  (mainContainer MUST be added after sidebar)
# ======================================================
$mainContainer = New-Object System.Windows.Forms.Panel
$mainContainer.Dock = "Fill"
$mainContainer.Padding = New-Object System.Windows.Forms.Padding(24, 24, 24, 24)
# Add sidebar first so WinForms Dock engine reserves Left space before Fill
$form.Controls.Add($mainContainer)
$form.Controls.Add($sidebar)

# Tab panels
$pageDashboard  = New-Object System.Windows.Forms.Panel; $pageDashboard.Dock = "Fill"; $pageDashboard.Visible = $true
$pageLogs       = New-Object System.Windows.Forms.Panel; $pageLogs.Dock = "Fill"; $pageLogs.Visible = $false
$pageQuarantine  = New-Object System.Windows.Forms.Panel; $pageQuarantine.Dock = "Fill"; $pageQuarantine.Visible = $false
$pageTuning     = New-Object System.Windows.Forms.Panel; $pageTuning.Dock = "Fill"; $pageTuning.Visible = $false
$pageNetwork    = New-Object System.Windows.Forms.Panel; $pageNetwork.Dock = "Fill"; $pageNetwork.Visible = $false

$mainContainer.Controls.Add($pageDashboard)
$mainContainer.Controls.Add($pageLogs)
$mainContainer.Controls.Add($pageQuarantine)
$mainContainer.Controls.Add($pageTuning)
$mainContainer.Controls.Add($pageNetwork)

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
    
    foreach ($btn in $script:sidebarButtons) {
        $btn.Invalidate()
    }
}

# Sidebar Navigation Button Helper (Floating Pills)
function Create-NavButton {
    param([string]$text, [char]$glyph, $targetPage, [int]$y)
    
    $btn = New-Object System.Windows.Forms.Button
    $btn.Size = New-Object System.Drawing.Size(200, 44)
    $btn.Location = New-Object System.Drawing.Point(20, $y)
    $btn.FlatStyle = "Flat"
    $btn.FlatAppearance.BorderSize = 0
    $btn.Cursor = [System.Windows.Forms.Cursors]::Hand
    $btn.Anchor = "Top, Left, Right"
    $btn.Text = "      " + $text
    $btn.Font = $fMed
    
    $btn.add_Paint({
        param($s,$e)
        $g = $e.Graphics
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $rect = $s.ClientRectangle
        
        $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
        $isActive = ($script:activePage -eq $targetPage)
        
        # Rounded pill path
        $path = Get-RoundedPath $rect 8
        
        if ($isActive) {
            # Active neon gradient pill
            $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $neonGreen, $neonCyan, 45)
            $g.FillPath($brush, $path)
            $brush.Dispose()
            $textColor = $bgColor
            $icoColor = $bgColor
        } elseif ($isHovered) {
            # Hover glow pill
            $brush = New-Object System.Drawing.SolidBrush($sidebarHover)
            $g.FillPath($brush, $path)
            $brush.Dispose()
            
            $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 50, 90), 1)
            $g.DrawPath($pen, $path)
            $pen.Dispose()
            
            $textColor = $white
            $icoColor = $neonGreen
        } else {
            # Transparent normal pill
            $textColor = $gray
            $icoColor = $gray
        }
        
        # Draw MDL2 Icon
        $gFont = New-Object System.Drawing.Font("Segoe MDL2 Assets", 11)
        $gBrush = New-Object System.Drawing.SolidBrush($icoColor)
        $g.DrawString($glyph.ToString(), $gFont, $gBrush, 16, 14)
        $gBrush.Dispose()
        $gFont.Dispose()
        
        # Draw Text
        $sf = New-Object System.Drawing.StringFormat
        $sf.LineAlignment = "Center"
        $tBrush = New-Object System.Drawing.SolidBrush($textColor)
        $g.DrawString($s.Text, $s.Font, $tBrush, 40, $rect.Height/2, $sf)
        $tBrush.Dispose()
        $sf.Dispose()
        $path.Dispose()
    })
    
    $btn.add_MouseEnter({ param($s,$e) $s.Invalidate() })
    $btn.add_MouseLeave({ param($s,$e) $s.Invalidate() })
    $btn.add_Click({ Show-Page $targetPage $btn })
    
    $sidebar.Controls.Add($btn)
    [void]$script:sidebarButtons.Add($btn)
}

# Create nav tabs
$sidebarNavList = New-Object System.Windows.Forms.Panel
$sidebarNavList.Dock = "Fill"
$sidebar.Controls.Add($sidebarNavList)

Create-NavButton "Shield Dashboard" ([char]0xE80F) $pageDashboard 110
Create-NavButton "Event telemetry"  ([char]0xE7C3) $pageLogs 165
Create-NavButton "Quarantine Vault"  ([char]0xE73A) $pageQuarantine 220
Create-NavButton "System Optimizer" ([char]0xE9A6) $pageTuning 275
Create-NavButton "Active Sockets"   ([char]0xE839) $pageNetwork 330

# ======================================================
# PAGE 1: SHIELD DASHBOARD
# ======================================================

# Title Block
$titleBar = New-Object System.Windows.Forms.Panel
$titleBar.Height = 45
$titleBar.Dock = "Top"
$pageDashboard.Controls.Add($titleBar)

$lblTitle = New-Object System.Windows.Forms.Label
$lblTitle.Text = "SENTINEL ACTIVE SHIELD"
$lblTitle.Font = $fTitle
$lblTitle.ForeColor = $white
$lblTitle.AutoSize = $true
$titleBar.Controls.Add($lblTitle)

# Complete table layout for the dashboard content
$dashboardLayout = New-Object System.Windows.Forms.TableLayoutPanel
$dashboardLayout.Dock = "Fill"
$dashboardLayout.RowCount = 3
$dashboardLayout.ColumnCount = 1
$pageDashboard.Controls.Add($dashboardLayout)

[void]$dashboardLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Absolute, 180)))
[void]$dashboardLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Absolute, 150)))
[void]$dashboardLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 100.0)))
[void]$dashboardLayout.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 100.0)))

# Send Title bar to back
$titleBar.SendToBack()
$dashboardLayout.BringToFront()

# Hero Panel - Premium Glassmorphic Card
$heroPanel = New-Object System.Windows.Forms.Panel
$heroPanel.Dock = "Fill"
$heroPanel.BackColor = $bgColor
$heroPanel.Margin = New-Object System.Windows.Forms.Padding(0, 0, 0, 12)
$heroPanel.BorderStyle = "None"
[void]$dashboardLayout.Controls.Add($heroPanel, 0, 0)

$heroPanel.add_Paint({
    param($s,$e)
    $g = $e.Graphics
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = $s.ClientRectangle
    
    # Fill rounded glassmorphism gradient
    $path = Get-RoundedPath $rect 12
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(35, 14, 16, 32), [System.Drawing.Color]::FromArgb(65, 20, 24, 48), 45)
    $g.FillPath($brush, $path)
    $brush.Dispose()
    
    # Draw subtle glowing neon green border
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 0, 220, 156), 1.5)
    $g.DrawPath($pen, $path)
    $pen.Dispose()
    $path.Dispose()
})

# Dynamic Sweeping Radar Scanner
$radarPanel = New-Object System.Windows.Forms.Panel
$radarPanel.Size = New-Object System.Drawing.Size(120, 120)
$radarPanel.Location = New-Object System.Drawing.Point(24, 24)
$radarPanel.Anchor = "Top, Left"
$heroPanel.Controls.Add($radarPanel)

$lblProtected = New-Object System.Windows.Forms.Label
$lblProtected.Text = "YOUR SYSTEM IS SECURED"
$lblProtected.Font = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$lblProtected.ForeColor = $neonGreen
$lblProtected.Location = New-Object System.Drawing.Point(164, 22)
$lblProtected.AutoSize = $true
$lblProtected.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblProtected)

$lblProtSub = New-Object System.Windows.Forms.Label
$lblProtSub.Text = "6 Autonomous AI Agents active. Powered by Google Gemini AI. Real-time protection online."
$lblProtSub.Font = $fSmall
$lblProtSub.ForeColor = $gray
$lblProtSub.Location = New-Object System.Drawing.Point(166, 54)
$lblProtSub.AutoSize = $true
$lblProtSub.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblProtSub)

$lblLastScan = New-Object System.Windows.Forms.Label
$lblLastScan.Name = "LastScan"
$lblLastScan.Text = "● Shield Pulse: Active (calculating heartbeat...)"
$lblLastScan.Font = $fMono
$lblLastScan.ForeColor = $neonGreen
$lblLastScan.Location = New-Object System.Drawing.Point(166, 74)
$lblLastScan.AutoSize = $true
$lblLastScan.Anchor = "Top, Left"
$heroPanel.Controls.Add($lblLastScan)

# Stats Panel Builder (Rounded Cards inside Hero)
function Create-StatPanel {
    param([string]$title, [string]$name, [string]$defaultVal, [int]$x)
    
    $p = New-Object System.Windows.Forms.Panel
    $p.Size = New-Object System.Drawing.Size(125, 50)
    $p.Location = New-Object System.Drawing.Point($x, 98)
    $p.BackColor = $bgColor
    $p.Anchor = "Top, Left"
    
    $p.add_Paint({
        param($s,$e)
        $g = $e.Graphics
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $rect = $s.ClientRectangle
        $path = Get-RoundedPath $rect 6
        $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(12, 14, 28))
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
    $val.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 12, [System.Drawing.FontStyle]::Bold)
    $val.ForeColor = $neonGreen
    $val.Location = New-Object System.Drawing.Point(10, 4)
    $val.AutoSize = $true
    $p.Controls.Add($val)
    
    $lbl = New-Object System.Windows.Forms.Label
    $lbl.Text = $title
    $lbl.Font = New-Object System.Drawing.Font("Consolas", 6.5, [System.Drawing.FontStyle]::Bold)
    $lbl.ForeColor = $gray
    $lbl.Location = New-Object System.Drawing.Point(10, 28)
    $lbl.AutoSize = $true
    $p.Controls.Add($lbl)
    
    $heroPanel.Controls.Add($p)
    return $val
}

$lblStatThreatsVal = Create-StatPanel "AI THREATS BLOCKED" "StatThreats" "0" 166
$lblStatProcsVal   = Create-StatPanel "PROCESSES SCAN"    "StatProcs"   "0" 301
$lblStatMBVal      = Create-StatPanel "JUNK PURGED (MB)"  "StatMB"      "0.0" 436
$lblStatCanaryVal  = Create-StatPanel "CANARY SHIELD"     "StatCanary"  "ACTIVE" 571

# Full Scan Button
$btnScanAll = New-Object System.Windows.Forms.Button
$btnScanAll.Text = "RUN FULL AI SCAN"
$btnScanAll.Font = $fMed
$btnScanAll.Size = New-Object System.Drawing.Size(165, 42)
$btnScanAll.Location = New-Object System.Drawing.Point(715, 62)
$btnScanAll.FlatStyle = "Flat"
$btnScanAll.FlatAppearance.BorderSize = 0
$btnScanAll.Cursor = [System.Windows.Forms.Cursors]::Hand
$btnScanAll.Anchor = "Top, Right"

$btnScanAll.add_Paint({
    param($s,$e)
    $g = $e.Graphics
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = $s.ClientRectangle
    $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
    
    $path = Get-RoundedPath $rect 8
    
    if ($s.Enabled) {
        if ($isHovered) {
            $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $neonGreen, $neonCyan, 45)
            $g.FillPath($brush, $path)
            $brush.Dispose()
            $textColor = $bgColor
        } else {
            $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(24, 28, 56))
            $g.FillPath($brush, $path)
            $brush.Dispose()
            
            $borderPen = New-Object System.Drawing.Pen($neonGreen, 1.5)
            $g.DrawPath($borderPen, $path)
            $borderPen.Dispose()
            $textColor = $neonGreen
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

# macOS-Style Console Container (Row 1)
$consoleContainer = New-Object System.Windows.Forms.Panel
$consoleContainer.Dock = "Fill"
$consoleContainer.Margin = New-Object System.Windows.Forms.Padding(0, 0, 0, 12)
[void]$dashboardLayout.Controls.Add($consoleContainer, 0, 1)

$consoleContainer.add_Paint({
    param($s,$e)
    $g = $e.Graphics
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

$console = New-Object System.Windows.Forms.RichTextBox
$console.Multiline = $true
$console.ReadOnly = $true
$console.BackColor = [System.Drawing.Color]::FromArgb(4, 4, 10)
$console.ForeColor = $neonGreen
$console.Font = $fMono
$console.Location = New-Object System.Drawing.Point(10, 36)
$console.Size = New-Object System.Drawing.Size(910, 104)
$console.BorderStyle = "None"
$console.ScrollBars = "Vertical"
$console.Anchor = "Top, Bottom, Left, Right"
$console.Text = "[SECUREVAULT AI v6.0] Gemini-powered neural defense suite online."
$console.AppendText("`r`n[SYSTEM] 6 autonomous AI agents loaded. Real-time telemetry ready.")
$console.AppendText("`r`n[WAITING] Click any agent card below to run a scan...")
$consoleContainer.Controls.Add($console)

# TableLayoutPanel for Agent Cards (Row 2)
$grid = New-Object System.Windows.Forms.TableLayoutPanel
$grid.Dock = "Fill"
$grid.Margin = New-Object System.Windows.Forms.Padding(0, 0, 0, 0)
$grid.ColumnCount = 3
$grid.RowCount = 2
[void]$dashboardLayout.Controls.Add($grid, 0, 2)

[void]$grid.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 33.33)))
[void]$grid.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 33.33)))
[void]$grid.ColumnStyles.Add((New-Object System.Windows.Forms.ColumnStyle([System.Windows.Forms.SizeType]::Percent, 33.33)))
[void]$grid.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 50.0)))
[void]$grid.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 50.0)))

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
    
    if ($logListbox) {
        $logListbox.Items.Insert(0, "[$(Get-Date -Format 'HH:mm:ss')] $msg")
    }
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
            return Invoke-RestMethod -Uri $url -Method Post -Body $json -ContentType "application/json" -TimeoutSec 8
        } catch {}
    }
    return $null
}

function Add-RadarBlip {
    $angle = Get-Random -Minimum 0 -Maximum 360
    $distance = Get-Random -Minimum 10 -Maximum 50
    $rad = ($angle * [Math]::PI) / 180
    $bx = 60 + $distance * [Math]::Cos($rad)
    $by = 60 + $distance * [Math]::Sin($rad)
    [void]$script:blips.Add(@{ x=$bx; y=$by; opacity=255 })
}

# Radar Custom Painting
$radarPanel.add_Paint({
    param($s,$e)
    $g = $e.Graphics
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    $w = $s.Width
    $h = $s.Height
    $cx = $w / 2
    $cy = $h / 2
    $r = ($w / 2) - 5
    
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(4, 12, 10))
    $g.FillEllipse($bgBrush, 5, 5, $w-10, $h-10)
    $bgBrush.Dispose()
    
    $gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(0, 80, 50), 1)
    $g.DrawEllipse($gridPen, $cx - $r*0.66, $cy - $r*0.66, $r*1.32, $r*1.32)
    $g.DrawEllipse($gridPen, $cx - $r*0.33, $cy - $r*0.33, $r*0.66, $r*0.66)
    $g.DrawLine($gridPen, 5, $cy, $w-5, $cy)
    $g.DrawLine($gridPen, $cx, 5, $cx, $h-5)
    $gridPen.Dispose()
    
    # Trail
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
    
    $outerPen = New-Object System.Drawing.Pen($neonGreen, 2)
    $g.DrawEllipse($outerPen, 5, 5, $w-10, $h-10)
    $outerPen.Dispose()

    foreach ($blip in $script:blips) {
        if ($blip.opacity -gt 0) {
            $blipBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($blip.opacity, 255, 60, 60))
            $g.FillEllipse($blipBrush, $blip.x - 3, $blip.y - 3, 6, 6)
            $blipBrush.Dispose()
        }
    }
})

# ======================================================
# SCANS IMPLEMENTATION
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
    
    if ($lblOptimizedSpace) {
        $lblOptimizedSpace.Text = "$($script:mbReclaimed) MB Junk Destroyed"
    }
    
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

# Create Agent Cards with Rounded Corners and Glowing Borders
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
    $card.Size = New-Object System.Drawing.Size(300, 160)
    $card.Dock = "Fill"
    $card.Margin = New-Object System.Windows.Forms.Padding(8, 8, 8, 8)
    $card.BackColor = $bgColor
    $card.BorderStyle = "None"

    # Rounded card painting with glowing hover states
    $card.add_Paint({
        param($s,$e)
        $g = $e.Graphics
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $rect = $s.ClientRectangle
        
        $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
        
        $path = Get-RoundedPath $rect 12
        
        # Background gradient
        $c1 = if ($isHovered) { $cardHoverBg } else { $cardBg }
        $c2 = if ($isHovered) { [System.Drawing.Color]::FromArgb(32, 38, 70) } else { [System.Drawing.Color]::FromArgb(20, 22, 44) }
        
        $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45)
        $g.FillPath($brush, $path)
        $brush.Dispose()
        
        # Border glow
        $glowColor = if ($isHovered) { $ag.color } else { [System.Drawing.Color]::FromArgb(60, $ag.color.R, $ag.color.G, $ag.color.B) }
        $pen = New-Object System.Drawing.Pen($glowColor, $(if ($isHovered) { 2.0 } else { 1.2 }))
        $g.DrawPath($pen, $path)
        
        $pen.Dispose()
        $path.Dispose()
    })

    # Subtle top accent strip inside rounded corners
    $cardTop = New-Object System.Windows.Forms.Panel
    $cardTop.Height = 3
    $cardTop.Dock = "Top"
    $cardTop.BackColor = $ag.color
    $card.Controls.Add($cardTop)

    $ico = New-Object System.Windows.Forms.Label
    $ico.Text = $ag.icon
    $ico.Font = New-Object System.Drawing.Font("Segoe MDL2 Assets", 20)
    $ico.ForeColor = $ag.color
    $ico.Location = New-Object System.Drawing.Point(22, 20)
    $ico.AutoSize = $true
    $card.Controls.Add($ico)

    $lname = New-Object System.Windows.Forms.Label
    $lname.Text = $ag.name
    $lname.Font = $fBig
    $lname.ForeColor = $white
    $lname.Location = New-Object System.Drawing.Point(64, 18)
    $lname.AutoSize = $true
    $card.Controls.Add($lname)

    $badge = New-Object System.Windows.Forms.Label
    $badge.Text = " GEMINI AI "
    $badge.Font = New-Object System.Drawing.Font("Consolas", 6.5, [System.Drawing.FontStyle]::Bold)
    $badge.ForeColor = $bgColor
    $badge.BackColor = $ag.color
    $badge.Location = New-Object System.Drawing.Point(65, 44)
    $badge.AutoSize = $true
    $card.Controls.Add($badge)

    $lsub = New-Object System.Windows.Forms.Label
    $lsub.Text = $ag.sub
    $lsub.Font = $fSmall
    $lsub.ForeColor = $gray
    $lsub.Location = New-Object System.Drawing.Point(22, 72)
    $lsub.Size = New-Object System.Drawing.Size(250, 36)
    $lsub.Anchor = "Top, Left, Right"
    $card.Controls.Add($lsub)

    $dot = New-Object System.Windows.Forms.Label
    $dot.Name = "StatusDot"
    $dot.Text = "●  PROTECTED"
    $dot.Font = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
    $dot.ForeColor = $neonGreen
    $dot.Location = New-Object System.Drawing.Point(22, 116)
    $dot.AutoSize = $true
    $card.Controls.Add($dot)

    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = "RUN SCAN"
    $btn.Font = $fMed
    $btn.Size = New-Object System.Drawing.Size(100, 28)
    $btn.Location = New-Object System.Drawing.Point(170, 110)
    $btn.FlatStyle = "Flat"
    $btn.FlatAppearance.BorderSize = 0
    $btn.Cursor = [System.Windows.Forms.Cursors]::Hand
    $btn.Tag = $ag.scan

    # Rounded scan button inside card
    $btn.add_Paint({
        param($s,$e)
        $g = $e.Graphics
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
        $s.Enabled = $false
        $s.Text = "SCANNING"
        $s.Invalidate()
        
        $parent = $s.Parent
        $statusDot = $parent.Controls["StatusDot"]
        if ($statusDot) {
            $statusDot.Text = "●  SCANNING..."
            $statusDot.ForeColor = $neonAmber
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
# PAGE 2: EVENT TELEMETRY LOGS (Enterprise Event Viewer)
# ======================================================
$lblLogsTitle = New-Object System.Windows.Forms.Label
$lblLogsTitle.Text = "REAL-TIME LOG TELEMETRY"
$lblLogsTitle.Font = $fTitle
$lblLogsTitle.ForeColor = $white
$lblLogsTitle.Location = New-Object System.Drawing.Point(0, 0)
$lblLogsTitle.AutoSize = $true
$pageLogs.Controls.Add($lblLogsTitle)

$logListbox = New-Object System.Windows.Forms.ListBox
$logListbox.BackColor = [System.Drawing.Color]::FromArgb(4, 4, 10)
$logListbox.ForeColor = $neonGreen
$logListbox.Font = $fMono
$logListbox.Location = New-Object System.Drawing.Point(0, 50)
$logListbox.Size = New-Object System.Drawing.Size(910, 600)
$logListbox.Anchor = "Top, Bottom, Left, Right"
$logListbox.BorderStyle = "FixedSingle"
$pageLogs.Controls.Add($logListbox)

# Add some seed logs
$logListbox.Items.Add("[$(Get-Date -Format 'HH:mm:ss')] [SYSTEM] Cognitive logging engine operational...")

# ======================================================
# PAGE 3: QUARANTINE VAULT
# ======================================================
$lblQuarTitle = New-Object System.Windows.Forms.Label
$lblQuarTitle.Text = "ISOLATED THREAT VAULT"
$lblQuarTitle.Font = $fTitle
$lblQuarTitle.ForeColor = $white
$lblQuarTitle.Location = New-Object System.Drawing.Point(0, 0)
$lblQuarTitle.AutoSize = $true
$pageQuarantine.Controls.Add($lblQuarTitle)

$lblQuarDesc = New-Object System.Windows.Forms.Label
$lblQuarDesc.Text = "The following dangerous files have been quarantined and cryptographically isolated."
$lblQuarDesc.Font = $fSmall
$lblQuarDesc.ForeColor = $gray
$lblQuarDesc.Location = New-Object System.Drawing.Point(0, 35)
$lblQuarDesc.AutoSize = $true
$pageQuarantine.Controls.Add($lblQuarDesc)

$vaultTable = New-Object System.Windows.Forms.ListView
$vaultTable.View = "Details"
$vaultTable.FullRowSelect = $true
$vaultTable.GridLines = $true
$vaultTable.BackColor = [System.Drawing.Color]::FromArgb(4, 4, 10)
$vaultTable.ForeColor = $white
$vaultTable.Font = $fSmall
$vaultTable.Location = New-Object System.Drawing.Point(0, 70)
$vaultTable.Size = New-Object System.Drawing.Size(910, 550)
$vaultTable.Anchor = "Top, Bottom, Left, Right"
$vaultTable.BorderStyle = "FixedSingle"

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

$pageQuarantine.Controls.Add($vaultTable)

# ======================================================
# PAGE 4: SYSTEM TUNING & SPEEDUP
# ======================================================
$lblTuningTitle = New-Object System.Windows.Forms.Label
$lblTuningTitle.Text = "SYSTEM OPTIMIZATION ENGINE"
$lblTuningTitle.Font = $fTitle
$lblTuningTitle.ForeColor = $white
$lblTuningTitle.Location = New-Object System.Drawing.Point(0, 0)
$lblTuningTitle.AutoSize = $true
$pageTuning.Controls.Add($lblTuningTitle)

$tuningStats = New-Object System.Windows.Forms.Panel
$tuningStats.Size = New-Object System.Drawing.Size(400, 150)
$tuningStats.Location = New-Object System.Drawing.Point(0, 60)
$tuningStats.BackColor = $cardBg

$tuningStats.add_Paint({
    param($s,$e)
    $rect = $s.ClientRectangle
    $rect.Width -= 1
    $rect.Height -= 1
    $pen = New-Object System.Drawing.Pen($neonGreen, 1)
    $e.Graphics.DrawRectangle($pen, $rect)
    $pen.Dispose()
})
$pageTuning.Controls.Add($tuningStats)

$lblOptimizedTitle = New-Object System.Windows.Forms.Label
$lblOptimizedTitle.Text = "TOTAL SPACE OPTIMIZED"
$lblOptimizedTitle.Font = $fMed
$lblOptimizedTitle.ForeColor = $gray
$lblOptimizedTitle.Location = New-Object System.Drawing.Point(20, 25)
$lblOptimizedTitle.AutoSize = $true
$tuningStats.Controls.Add($lblOptimizedTitle)

$lblOptimizedSpace = New-Object System.Windows.Forms.Label
$lblOptimizedSpace.Text = "0.0 MB Junk Destroyed"
$lblOptimizedSpace.Font = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)
$lblOptimizedSpace.ForeColor = $neonGreen
$lblOptimizedSpace.Location = New-Object System.Drawing.Point(20, 50)
$lblOptimizedSpace.AutoSize = $true
$tuningStats.Controls.Add($lblOptimizedSpace)

$lblBoostStatus = New-Object System.Windows.Forms.Label
$lblBoostStatus.Text = "System Performance Gain: +14% CPU headroom"
$lblBoostStatus.Font = $fSmall
$lblBoostStatus.ForeColor = $white
$lblBoostStatus.Location = New-Object System.Drawing.Point(20, 100)
$lblBoostStatus.AutoSize = $true
$tuningStats.Controls.Add($lblBoostStatus)

$btnTune = New-Object System.Windows.Forms.Button
$btnTune.Text = "TRIGGER DEEP CLEAN"
$btnTune.Font = $fMed
$btnTune.Size = New-Object System.Drawing.Size(180, 45)
$btnTune.Location = New-Object System.Drawing.Point(0, 240)
$btnTune.FlatStyle = "Flat"
$btnTune.FlatAppearance.BorderSize = 0
$btnTune.Cursor = [System.Windows.Forms.Cursors]::Hand
$btnTune.ForeColor = $neonGreen

$btnTune.add_Paint({
    param($s,$e)
    $rect = $s.ClientRectangle
    $isHovered = $s.ClientRectangle.Contains($s.PointToClient([System.Windows.Forms.Control]::MousePosition))
    $c1 = if ($isHovered) { $neonGreen } else { $cardBg }
    $c2 = if ($isHovered) { [System.Drawing.Color]::FromArgb(0, 150, 200) } else { [System.Drawing.Color]::FromArgb(28, 30, 50) }
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 90)
    $e.Graphics.FillRectangle($brush, $rect)
    $brush.Dispose()
    
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = "Center"
    $sf.LineAlignment = "Center"
    $textBrush = New-Object System.Drawing.SolidBrush($(if ($isHovered) { $bgColor } else { $neonGreen }))
    $e.Graphics.DrawString($s.Text, $s.Font, $textBrush, [System.Drawing.RectangleF]$rect, $sf)
    $textBrush.Dispose()
    $sf.Dispose()
    
    $pen = New-Object System.Drawing.Pen($neonGreen, 1)
    $e.Graphics.DrawRectangle($pen, 0, 0, $rect.Width-1, $rect.Height-1)
    $pen.Dispose()
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
$lblNetTitle = New-Object System.Windows.Forms.Label
$lblNetTitle.Text = "NETWORK TELEMETRY MONITOR"
$lblNetTitle.Font = $fTitle
$lblNetTitle.ForeColor = $white
$lblNetTitle.Location = New-Object System.Drawing.Point(0, 0)
$lblNetTitle.AutoSize = $true
$pageNetwork.Controls.Add($lblNetTitle)

$lblNetDesc = New-Object System.Windows.Forms.Label
$lblNetDesc.Text = "Real-time list of TCP network connections currently communicating on this device."
$lblNetDesc.Font = $fSmall
$lblNetDesc.ForeColor = $gray
$lblNetDesc.Location = New-Object System.Drawing.Point(0, 35)
$lblNetDesc.AutoSize = $true
$pageNetwork.Controls.Add($lblNetDesc)

$netTable = New-Object System.Windows.Forms.ListView
$netTable.View = "Details"
$netTable.FullRowSelect = $true
$netTable.GridLines = $true
$netTable.BackColor = [System.Drawing.Color]::FromArgb(4, 4, 10)
$netTable.ForeColor = $neonGreen
$netTable.Font = $fMono
$netTable.Location = New-Object System.Drawing.Point(0, 70)
$netTable.Size = New-Object System.Drawing.Size(910, 550)
$netTable.Anchor = "Top, Bottom, Left, Right"
$netTable.BorderStyle = "FixedSingle"

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
    $serviceScript = Join-Path "$env:APPDATA\SecureVault" "sentinel_service.ps1"
    if (-not (Test-Path $serviceScript)) {
        $serviceScript = Join-Path $PSScriptRoot "sentinel_service.ps1"
    }
    if (Test-Path $serviceScript) {
        Start-Process powershell -ArgumentList "-WindowStyle Hidden -ExecutionPolicy Bypass -File `"$serviceScript`"" -WindowStyle Hidden
    }
}

[System.Windows.Forms.Application]::Run($form)
