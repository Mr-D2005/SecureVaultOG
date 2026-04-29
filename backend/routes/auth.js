const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, verifyOtp, resetPassword, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/update-profile', auth, updateProfile);

module.exports = router;
