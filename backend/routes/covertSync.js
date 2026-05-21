// backend/routes/covertSync.js
const express = require('express');
const router = express.Router();

// This endpoint simply returns the decoded secret (if any) that the middleware attached.
router.get('/', (req, res) => {
  if (req.covertSecret) {
    res.json({ success: true, secret: req.covertSecret, timestamp: req.covertTimestamp });
  } else {
    res.json({ success: false, message: 'No covert payload detected' });
  }
});

module.exports = router;
