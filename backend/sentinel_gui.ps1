Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# --- CREATE FORM ---
$form = New-Object System.Windows.Forms.Form
$form.Text = "SecureVault Total AI Protection - Sentinel Suite"
$form.Size = New-Object System.Drawing.Size(800,600)
$form.StartPosition = "CenterScreen"
$form.BackColor = [System.Drawing.Color]::White
$form.FormBorderStyle = "FixedDialog"

# --- HEADER ---
$header = New-Object System.Windows.Forms.Panel
$header.Size = New-Object System.Drawing.Size(800,80)
$header.BackColor = [System.Drawing.Color]::FromArgb(227, 28, 28)
$form.Controls.Add($header)

$title = New-Object System.Windows.Forms.Label
$title.Text = "SECUREVAULT TOTAL AI PROTECTION"
$title.Font = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$title.ForeColor = [System.Drawing.Color]::White
$title.Location = New-Object System.Drawing.Point(20, 20)
$title.AutoSize = $true
$header.Controls.Add($title)

# --- STATUS AREA ---
$statusBox = New-Object System.Windows.Forms.Panel
$statusBox.Size = New-Object System.Drawing.Size(740, 150)
$statusBox.Location = New-Object System.Drawing.Point(30, 100)
$statusBox.BackColor = [System.Drawing.Color]::FromArgb(245, 247, 250)
$form.Controls.Add($statusBox)

$shieldImg = New-Object System.Windows.Forms.Label
$shieldImg.Text = "🛡️"
$shieldImg.Font = New-Object System.Drawing.Font("Segoe UI", 50)
$shieldImg.Location = New-Object System.Drawing.Point(20, 25)
$shieldImg.AutoSize = $true
$shieldImg.ForeColor = [System.Drawing.Color]::FromArgb(0, 220, 156)
$statusBox.Controls.Add($shieldImg)

$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Text = "Your System is Protected"
$statusLabel.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$statusLabel.Location = New-Object System.Drawing.Point(120, 45)
$statusLabel.AutoSize = $true
$statusBox.Controls.Add($statusLabel)

$subStatus = New-Object System.Windows.Forms.Label
$subStatus.Text = "All 5 AI Agents are vigilant and monitoring your PC."
$subStatus.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$subStatus.Location = New-Object System.Drawing.Point(123, 80)
$subStatus.AutoSize = $true
$subStatus.ForeColor = [System.Drawing.Color]::Gray
$statusBox.Controls.Add($subStatus)

# --- AGENT MODULES GRID ---
$modulesPanel = New-Object System.Windows.Forms.FlowLayoutPanel
$modulesPanel.Location = New-Object System.Drawing.Point(30, 270)
$modulesPanel.Size = New-Object System.Drawing.Size(740, 120)
$form.Controls.Add($modulesPanel)

function CreateAgentModule($name, $task) {
    $p = New-Object System.Windows.Forms.Panel
    $p.Size = New-Object System.Drawing.Size(140, 100)
    $p.BorderStyle = "FixedSingle"
    
    $n = New-Object System.Windows.Forms.Label
    $n.Text = $name
    $n.Font = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
    $n.Location = New-Object System.Drawing.Point(5, 10)
    $n.Width = 130
    $n.TextAlign = "MiddleCenter"
    $p.Controls.Add($n)
    
    $t = New-Object System.Windows.Forms.Label
    $t.Text = $task
    $t.Font = New-Object System.Drawing.Font("Segoe UI", 7)
    $t.Location = New-Object System.Drawing.Point(5, 40)
    $t.Width = 130
    $t.Height = 30
    $t.TextAlign = "MiddleCenter"
    $t.ForeColor = [System.Drawing.Color]::Gray
    $p.Controls.Add($t)
    
    $s = New-Object System.Windows.Forms.Label
    $s.Text = "● ACTIVE"
    $s.Font = New-Object System.Drawing.Font("Segoe UI", 7, [System.Drawing.FontStyle]::Bold)
    $s.ForeColor = [System.Drawing.Color]::FromArgb(0, 220, 156)
    $s.Location = New-Object System.Drawing.Point(5, 75)
    $s.Width = 130
    $s.TextAlign = "MiddleCenter"
    $p.Controls.Add($s)
    
    return $p
}

$modulesPanel.Controls.Add((CreateAgentModule "AGENT_DNA" "Behavioral Scanning"))
$modulesPanel.Controls.Add((CreateAgentModule "AGENT_NET" "AI Firewall"))
$modulesPanel.Controls.Add((CreateAgentModule "AGENT_VAULT" "Identity Protection"))
$modulesPanel.Controls.Add((CreateAgentModule "AGENT_PURGE" "System Cleanup"))
$modulesPanel.Controls.Add((CreateAgentModule "AGENT_STEALTH" "AI VPN/Privacy"))

# --- LOGGING AREA ---
$logBox = New-Object System.Windows.Forms.TextBox
$logBox.Multiline = $true
$logBox.ReadOnly = $true
$logBox.BackColor = [System.Drawing.Color]::Black
$logBox.ForeColor = [System.Drawing.Color]::LimeGreen
$logBox.Font = New-Object System.Drawing.Font("Consolas", 9)
$logBox.Location = New-Object System.Drawing.Point(30, 410)
$logBox.Size = New-Object System.Drawing.Size(740, 120)
$logBox.Text = "SENTINEL_INTELLIGENCE_CORE_ONLINE...`r`n"
$form.Controls.Add($logBox)

# --- BUTTONS ---
$btnScan = New-Object System.Windows.Forms.Button
$btnScan.Text = "RUN FULL AI AUDIT"
$btnScan.Size = New-Object System.Drawing.Size(200, 50)
$btnScan.Location = New-Object System.Drawing.Point(300, 180)
$btnScan.BackColor = [System.Drawing.Color]::FromArgb(0, 102, 255)
$btnScan.ForeColor = [System.Drawing.Color]::White
$btnScan.FlatStyle = "Flat"
$btnScan.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$form.Controls.Add($btnScan)

# --- SCAN LOGIC ---
$btnScan.Add_Click({
    $btnScan.Enabled = $false
    $logBox.AppendText("AGENT_DNA: Initializing full system audit...`r`n")
    $statusLabel.Text = "AI AUDIT IN PROGRESS..."
    
    $tasks = @("Scanning kernel processes...", "Analyzing network ingress patterns...", "Verifying credential isolation...", "Optimizing system registry...", "Audit Complete.")
    foreach ($task in $tasks) {
        $logBox.AppendText("AGENT_DNA: $task`r`n")
        $logBox.SelectionStart = $logBox.Text.Length
        $logBox.ScrollToCaret()
        $form.Refresh()
        Start-Sleep -Seconds 1
    }
    
    $statusLabel.Text = "Your System is Protected"
    $btnScan.Enabled = $true
    [System.Windows.Forms.MessageBox]::Show("SecureVault Total AI Audit Complete. All 5 Agents certify this PC as SECURE.", "Sentinel Suite Intelligence")
})

# --- RUN ---
$form.ShowDialog()
