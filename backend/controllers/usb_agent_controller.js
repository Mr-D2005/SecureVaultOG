const { spawn } = require('child_process');
const path = require('path');

// Specialized System Prompts for the 10 Sentinels
const AGENT_PROMPTS = {
    "HID-Shield": "You are Agent HID-Shield. Analyze USB hardware descriptors for unauthorized keyboard/mouse emulation (BadUSB/Rubber Ducky). Look for anomalies in Class IDs and Device IDs.",
    "Script-Slayer": "You are Agent Script-Slayer. Your specialty is hunting for worms and malicious scripts (.lnk, .bat, .ps1, autorun.inf). Look for hidden scripts that trigger on plug-in.",
    "Malware-Probe": "You are Agent Malware-Probe. Scan file lists for disguised extensions (e.g., .pdf.exe), zip-bombs, and known malicious payload signatures.",
    "Firmware-Auditor": "You are Agent Firmware-Auditor. Analyze device metadata to detect firmware-level rootkits, persistent storage anomalies, or phantom partitions.",
    "Siphon-Guard": "You are Agent Siphon-Guard. Detect 'Data Siphoning' scripts designed to automatically search for and copy user documents (.docx, .pdf, .key) once connected.",
    "Bait-Analyst": "You are Agent Bait-Analyst. Use Social Engineering forensics to flag baiting filenames (e.g., 'CEO_Bonus.xlsx', 'Passwords.txt') that trick users into clicking.",
    "Integrity-Vigil": "You are Agent Integrity-Vigil. Detect 'Fake Capacity' scams and filesystem corruption. Compare reported sector sizes with actual usable storage.",
    "Power-Sentry": "You are Agent Power-Sentry. Analyze electrical and descriptor data to identify potential 'USB Killer' hardware signatures (Physical Destruction).",
    "Stego-Scanner": "You are Agent Stego-Scanner. Scan media files on the drive for unusual entropy or size mismatches that suggest hidden data payloads (Steganography).",
    "Purifier": "You are Agent Purifier (Omega), the council's executioner. \n        Analyze the 'actions_taken' list from the hardware bridge. \n        If threats were deleted, certify the cleanup. If threats remain, provide instructions for manual removal.\n        Be stern, efficient, and final. Your goal is a 0-threat state."
};

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
            console.error(`--- [USB_BRIDGE_STDERR] ---`, data.toString());
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

/**
 * Calls a single AI Agent for its specific forensic audit
 */
const callAgent = async (agentName, usbData) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return { agent: agentName, report: "Agent Offline (API Key Missing)" };

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: AGENT_PROMPTS[agentName] },
                    { role: 'user', content: `Analyze this USB forensic data: ${JSON.stringify(usbData)}` }
                ],
                temperature: 0.1
            }),
            signal: AbortSignal.timeout(10000)
        });

        const data = await response.json();
        return { 
            agent: agentName, 
            report: data.choices?.[0]?.message?.content || "Audit incomplete." 
        };
    } catch (err) {
        return { agent: agentName, report: `Audit Failed: ${err.message}` };
    }
};

/**
 * Orchestrates the "Council of Sentinels" (Parallel Agent Audit)
 */
exports.performFullUsbAudit = async (req, res) => {
    try {
        let auditData;
        
        // --- CASE 1: Data is pushed from the External Local Bridge (req.body) ---
        if (req.method === 'POST' && req.body && req.body.devices) {
            console.log("--- [PERFORMING_AUDIT_ON_SYNCED_DATA] ---");
            auditData = req.body;
        } 
        // --- CASE 2: Local Hardware Check (fallback) ---
        else {
            auditData = await getRawUsbData();
        }
        
        if (!auditData.devices || auditData.devices.length === 0) {
            return res.json({ 
                success: true, 
                message: "No physical USB devices detected on the bus.", 
                devices: [], 
                reports: [],
                is_simulated: false 
            });
        }

        // Trigger all 10 agents in parallel
        const agentNames = Object.keys(AGENT_PROMPTS);
        const auditPromises = agentNames.map(name => callAgent(name, auditData));
        
        const reports = await Promise.all(auditPromises);

        res.json({
            success: true,
            timestamp: Date.now() / 1000,
            devices: auditData.devices,
            reports: reports,
            is_simulated: false
        });

    } catch (err) {
        console.error('--- [SENTINEL_COUNCIL_CRITICAL_FAILURE] ---', err);
        res.status(500).json({ success: false, error: err.message });
    }
};
