const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const usbController = require('../controllers/usb_agent_controller');

const SYNC_FILE = path.join(__dirname, '../sync_data.json');

/**
 * @route   GET /api/usb-lab/audit
 */
router.get('/audit', usbController.performFullUsbAudit);
router.post('/audit', usbController.performFullUsbAudit);

/**
 * @route   POST /api/usb-lab/external-report
 * @desc    Saves data to a physical file for cross-worker persistence
 */
router.post('/external-report', (req, res) => {
    try {
        console.log("--- [SYNC_ROOM: WRITING_DATA_TO_DISK] ---");
        fs.writeFileSync(SYNC_FILE, JSON.stringify(req.body));
        res.json({ success: true, message: "Forensic data secured on server disk." });
    } catch (err) {
        res.status(500).json({ success: false, error: "Disk Write Failed" });
    }
});

/**
 * @route   GET /api/usb-lab/latest-external
 */
router.get('/latest-external', (req, res) => {
    try {
        if (fs.existsSync(SYNC_FILE)) {
            const data = fs.readFileSync(SYNC_FILE, 'utf8');
            res.json({ success: true, report: JSON.parse(data) });
        } else {
            res.json({ success: true, report: null });
        }
    } catch (err) {
        res.json({ success: true, report: null });
    }
});

router.get('/download-launcher', (req, res) => {
    const filePath = path.join(__dirname, '../sentinel_launcher.bat');
    res.download(filePath, 'sentinel_launcher.bat');
});

module.exports = router;
