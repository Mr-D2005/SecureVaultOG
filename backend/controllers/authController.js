const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
const sendEmail = require('../utils/sendEmail');

// --- Register: Create Identity Context ---
exports.register = async (req, res) => {
  console.log('--- [REGISTRATION ATTEMPT RECEIVED] ---');
  console.log('BODY:', req.body);
  try {
    const { email, password, username } = req.body;
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ msg: 'Identity already exists. Initiate Login sequence.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({ email, password: hashedPassword, username: username || email.split('@')[0] });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });

    // --- Dispatch Welcome Signature ---
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to SecureVault Protocol',
        message: `Welcome Operator. Your identity manifest has been successfully etched into the AWS RDS Ledger. Your vault is now ready for deployment.`,
        link: `${process.env.FRONTEND_URL || 'https://securevault-omega.vercel.app'}/login`
      });
    } catch (e) {
      console.error('Welcome email dispatch failed during registration', e);
    }

    res.status(201).json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    console.error('REGISTRATION_ERROR:', err);
    res.status(500).json({ 
      msg: 'Registration sequence failed', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
  }
};


// --- Login: Identity Handshake ---
exports.login = async (req, res) => {
  console.log('--- [LOGIN ATTEMPT RECEIVED] ---');
  console.log('BODY:', req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ msg: 'Login sequence failed' });
  }
};

// --- Forgot Password: Code Dispatch ---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(200).json({ msg: 'If this email exists, a code will be sent' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Identity Recovery Protocol',
      message: `An identity recovery scan was initiated. Use the following 6-digit synchronization code to re-seal your vault:\n\nCODE: ${otp}\n\nThis code will expire in 10 minutes.`,
      link: `${process.env.FRONTEND_URL || 'https://securevault-omega.vercel.app'}/reset-password`
    });


    res.status(200).json({ msg: 'Recovery code dispatched' });
  } catch (err) {
    console.error('FORGOT_PASSWORD_ERROR:', err);
    res.status(500).json({ msg: 'Recovery dispatch failed', error: err.message });
  }
};


// --- Verify OTP: Protocol Handshake ---
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email, otp } });
    if (!user || user.otpExpiry < new Date()) {
      return res.status(400).json({ msg: 'Invalid or expired code pulse' });
    }
    res.status(200).json({ msg: 'Identity Verified' });
  } catch (err) {
    res.status(500).json({ msg: 'Verification sequence failed' });
  }
};

// --- Reset Password: Ledger Overwrite ---
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ where: { email, otp } });
    if (!user || user.otpExpiry < new Date()) {
      return res.status(400).json({ msg: 'Invalid or expired code pulse' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ msg: 'Master Password Overwritten Successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Reset protocol failed' });
  }
};
// --- Update Profile: Master Identity Management ---
exports.updateProfile = async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    const user = await User.findByPk(req.user.userId);

    if (!user) return res.status(404).json({ msg: 'Operator not found' });

    if (username) user.username = username;
    
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.status(200).json({ 
      msg: 'Identity manifest updated', 
      user: { id: user.id, email: user.email, username: user.username } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Profile update protocol failed' });
  }
};
