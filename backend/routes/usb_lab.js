const express = require('express');
const router = express.Router();
const path = require('path');
const usbController = require('../controllers/usb_agent_controller');

/**
 * @route   GET /api/usb-lab/audit
 * @desc    Triggers the full 10-agent Sentinel Council Audit
 */
router.get('/audit', usbController.performFullUsbAudit);

// --- CLOUD SYNC ENGINE ---
let latestExternalReport = null;

/**
 * @route   POST /api/usb-lab/external-report
 * @desc    Receives forensic data from local sentinel bridge
 */
router.post('/external-report', (req, res) => {
    console.log("--- [EXTERNAL_FORENSIC_DATA_RECEIVED] ---");
    latestExternalReport = req.body;
    res.json({ success: true, message: "Forensic data synced. Run 'Fetch Sync' on Dashboard." });
});

/**
 * @route   GET /api/usb-lab/latest-external
 * @desc    Fetches the latest data pushed from local hardware
 */
router.get('/latest-external', (req, res) => {
    res.json({ success: true, report: latestExternalReport });
});

/**
 * @route   GET /api/usb-lab/download-launcher
 * @desc    Downloads the one-click sentinel launcher
 */
router.get('/download-launcher', (req, res) => {
    const filePath = path.join(__dirname, '../sentinel_launcher.bat');
    res.download(filePath, 'sentinel_launcher.bat');
});

module.exports = router;
