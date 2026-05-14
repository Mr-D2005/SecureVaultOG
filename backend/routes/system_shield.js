const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

/**
 * @route   GET /api/system-shield/download
 * @desc    Downloads the AI Total Defense Installer
 */
router.get('/download', (req, res) => {
    const filePath = path.join(__dirname, '../SecureVault_Antivirus.zip');
    if (fs.existsSync(filePath)) {
        res.download(filePath, 'SecureVault_Antivirus.zip');
    } else {
        res.status(404).json({ success: false, error: "Installer not found." });
    }
});

/**
 * @route   GET /api/system-shield/stats
 * @desc    Returns simulated global AI protection stats
 */
router.get('/stats', (req, res) => {
    res.json({
        success: true,
        globalThreatsBlocked: 1284920,
        activeSentinels: 4521,
        systemStatus: "STABLE"
    });
});

module.exports = router;
