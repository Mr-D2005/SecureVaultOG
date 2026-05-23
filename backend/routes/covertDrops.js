const express = require('express');
const router = express.Router();
const { CovertDrop } = require('../models/index');

// GET /api/covert-drops
// Retrieves all intercepted S3 URLs from the dead drop
router.get('/', async (req, res) => {
  // Disable ALL caching to prevent 304 responses
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.removeHeader('ETag');
  res.removeHeader('Last-Modified');

  try {
    const drops = await CovertDrop.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json({ success: true, drops, timestamp: Date.now() });
  } catch (err) {
    console.error('[CovertDrops API] Error fetching drops:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch drops: ' + err.message });
  }
});

// POST /api/covert-drops/test
// Debug: manually insert a test drop to verify DB is working
router.post('/test', async (req, res) => {
  try {
    const drop = await CovertDrop.create({
      s3_url: 'https://s3.amazonaws.com/TEST_DROP_' + Date.now(),
      status: 'TEST',
      temporal_bits: null
    });
    res.json({ success: true, drop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
