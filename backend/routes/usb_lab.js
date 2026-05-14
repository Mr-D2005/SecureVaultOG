const express = require('express');
const router = express.Router();
const usbController = require('../controllers/usb_agent_controller');

/**
 * @route   GET /api/usb-lab/audit
 * @desc    Triggers the full 10-agent Sentinel Council Audit
 */
router.get('/audit', usbController.performFullUsbAudit);

/**
 * @route   POST /api/usb-lab/remediate
 * @desc    Executes cleaning/formatting actions (Handled by Agent Purifier)
 */
router.post('/remediate', (req, res) => {
    // Logic for actual file deletion would go here, 
    // calling the Python bridge's cleanup functions.
    res.json({ success: true, message: "Remediation command issued to hardware." });
});

module.exports = router;
