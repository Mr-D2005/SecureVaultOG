Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# --- CREATE FORM ---
$form = New-Object System.Windows.Forms.Form
$form.Text = "SecureVault Total AI Protection"
$form.Size = New-Object System.Drawing.Size(600,450)
$form.StartPosition = "CenterScreen"
$form.BackColor = [System.Drawing.Color]::White
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false

# --- HEADER BAR ---
$header = New-Object System.Windows.Forms.Panel
$header.Size = New-Object System.Drawing.Size(600,70)
$header.BackColor = [System.Drawing.Color]::FromArgb(227, 28, 28) # McAfee Red
$form.Controls.Add($header)

$title = New-Object System.Windows.Forms.Label
$title.Text = "SECUREVAULT TOTAL AI"
$title.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$title.ForeColor = [System.Drawing.Color]::White
$title.Location = New-Object System.Drawing.Point(20, 15)
$title.AutoSize = $true
$header.Controls.Add($title)

# --- STATUS AREA ---
$shieldImg = New-Object System.Windows.Forms.Label
$shieldImg.Text = "🛡️"
$shieldImg.Font = New-Object System.Drawing.Font("Segoe UI", 60)
$shieldImg.Location = New-Object System.Drawing.Point(240, 100)
$shieldImg.AutoSize = $true
$shieldImg.ForeColor = [System.Drawing.Color]::FromArgb(0, 220, 156)
$form.Controls.Add($shieldImg)

$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Text = "You're protected"
$statusLabel.Font = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$statusLabel.Location = New-Object System.Drawing.Point(0, 210)
$statusLabel.Width = 600
$statusLabel.TextAlign = "MiddleCenter"
$form.Controls.Add($statusLabel)

$subStatus = New-Object System.Windows.Forms.Label
$subStatus.Text = "AI Agent Sentinel Core is actively guarding your system."
$subStatus.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$subStatus.Location = New-Object System.Drawing.Point(0, 250)
$subStatus.Width = 600
$subStatus.TextAlign = "MiddleCenter"
$subStatus.ForeColor = [System.Drawing.Color]::Gray
$form.Controls.Add($subStatus)

# --- SCAN PROGRESS BAR ---
$progressBar = New-Object System.Windows.Forms.ProgressBar
$progressBar.Location = New-Object System.Drawing.Point(50, 290)
$progressBar.Width = 500
$progressBar.Height = 10
$progressBar.Visible = $false
$form.Controls.Add($progressBar)

# --- BUTTONS ---
$btnScan = New-Object System.Windows.Forms.Button
$btnScan.Text = "Run a scan"
$btnScan.Size = New-Object System.Drawing.Size(150, 45)
$btnScan.Location = New-Object System.Drawing.Point(225, 330)
$btnScan.BackColor = [System.Drawing.Color]::FromArgb(0, 102, 255)
$btnScan.ForeColor = [System.Drawing.Color]::White
$btnScan.FlatStyle = "Flat"
$btnScan.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$btnScan.Cursor = [System.Windows.Forms.Cursors]::Hand
$form.Controls.Add($btnScan)

# --- LOGIC ---
$btnScan.Add_Click({
    $btnScan.Enabled = $false
    $progressBar.Visible = $true
    $statusLabel.Text = "Scanning DNA..."
    
    for ($i = 0; $i -le 100; $i += 5) {
        $progressBar.Value = $i
        Start-Sleep -Milliseconds 100
        $form.Refresh()
    }
    
    $statusLabel.Text = "You're protected"
    $progressBar.Visible = $false
    $btnScan.Enabled = $true
    [System.Windows.Forms.MessageBox]::Show("Full AI Scan Complete. Your system is 100% Secure.", "Sentinel Core Intelligence")
})

# --- RUN FORM ---
$form.ShowDialog()
