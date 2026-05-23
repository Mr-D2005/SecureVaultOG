const express = require('express');
const router = express.Router();
const { CovertDrop } = require('../models/index');

// GET /api/covert-drops
// Retrieves all intercepted S3 URLs from the dead drop
router.get('/', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  try {
    const drops = await CovertDrop.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json({ success: true, drops });
  } catch (err) {
    console.error('[CovertDrops API] Error fetching drops:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch drops: ' + err.message, stack: err.stack });
  }
});

module.exports = router;
