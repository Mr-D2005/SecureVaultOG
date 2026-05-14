const { spawn } = require('child_process');
const path = require('path');

/**
 * Runs the Python Hardware Bridge and returns raw data
 */
const getRawUsbData = () => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [path.join(__dirname, '../usb_bridge.py')]);
        let dataStr = '';
        let errorStr = '';

        pythonProcess.stdout.on('data', (data) => {
            dataStr += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorStr += data.toString();
        });

        pythonProcess.on('close', (code) => {
            try {
                if (code !== 0) throw new Error(`Python process exited with code ${code}. Error: ${errorStr}`);
                resolve(JSON.parse(dataStr));
            } catch (err) {
                reject(err);
            }
        });
    });
};

const STRIKE_TEAMS = {
    "HARDWARE_TEAM": "Analyze for HID keyboard emulation, 'Fake Capacity' scams, and physical 'USB Killer' signatures. (Agents: HID-Shield, Integrity-Vigil, Power-Sentry)",
    "SOFTWARE_TEAM": "Scan for hidden worms, script hijacking, malicious .lnk shortcuts, and firmware partitioning anomalies. (Agents: Script-Slayer, Malware-Probe, Firmware-Auditor)",
    "CYBER_SENTRY_TEAM": "Detect psychological baiting (bait files), unauthorized data copying, and steganographic payloads. (Agents: Bait-Analyst, Siphon-Guard, Stego-Scanner, Purifier)"
};

/**
 * Orchestrates the "Strike Teams" for maximum speed
 */
exports.performFullUsbAudit = async (req, res) => {
    try {
        let auditData;
        if (req.method === 'POST' && req.body && req.body.devices) {
            auditData = req.body;
        } else {
            auditData = await getRawUsbData();
        }

        if (!auditData.devices || auditData.devices.length === 0) {
            return res.json({ success: true, devices: [], reports: [] });
        }

        const apiKey = process.env.GROQ_API_KEY;
        const teamNames = Object.keys(STRIKE_TEAMS);
        
        const auditPromises = teamNames.map(async (team) => {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant', // High-speed flash model
                    messages: [
                        { role: 'system', content: `You are the ${team}. ${STRIKE_TEAMS[team]}. Provide a concise forensic report.` },
                        { role: 'user', content: `FORENSIC_DATA: ${JSON.stringify(auditData)}` }
                    ],
                    temperature: 0.1
                })
            });
            const data = await response.json();
            return { agent: team, report: data.choices?.[0]?.message?.content || "No data reported." };
        });

        const reports = await Promise.all(auditPromises);

        res.json({
            success: true,
            devices: auditData.devices,
            reports: reports
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
