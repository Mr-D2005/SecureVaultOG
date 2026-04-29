const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
const sendEmail = require('../utils/sendEmail');

// --- Register: Create Identity Context ---
exports.register = async (req, res) => {
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
        subject: 'Welcome to SecureVault',
        message: `Your operator identity has been successfully registered in the AWS RDS Ledger. Access Code: ${token.substring(0, 8)}...`,
        html: `
          <div style="background:#f9fafb; padding:20px; font-family:sans-serif; color:#1f2937; border:1px solid #e5e7eb; border-radius:8px;">
            <h2 style="color:#4f46e5; margin-bottom:16px;">Identity Manifest Initiated</h2>
            <p>Welcome Operator. Your vault credentials have been etched into the secure cloud ledger.</p>
            <p style="margin-top:20px; font-size:14px; font-weight:600; color:#4338ca;">OPERATOR_EMAIL: ${user.email}</p>
            <p style="font-size:12px; color:#6b7280; margin-top:30px;">This is an automated system dispatch. Do not respond.</p>
          </div>
        `
      });
    } catch (e) {
      console.error('Welcome email dispatch failed during registration', e);
    }

    res.status(201).json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Registration sequence failed' });
  }
};

// --- Login: Identity Handshake ---
exports.login = async (req, res) => {
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
      message: `Your 6-digit verification code: ${otp}. Expires in 10 minutes.`,
      html: `
        <div style="background:#fef2f2; padding:20px; font-family:sans-serif; color:#991b1b; border:1px solid #fecaca; border-radius:8px;">
          <h2 style="color:#dc2626; margin-bottom:16px;">Recovery Code Dispatch</h2>
          <p>An identity recovery scan was initiated. Use the following code to re-seal your vault:</p>
          <div style="background:#ffffff; padding:15px; border:1px solid #f87171; text-align:center; font-size:32px; letter-spacing:8px; font-weight:700; margin:20px 0;">
            ${otp}
          </div>
          <p style="font-size:12px; color:#b91c1c;">TIMEOUT: 10 MINUTES | PORT_SOURCE: WEB_GATEWAY</p>
        </div>
      `
    });

    res.status(200).json({ msg: 'Recovery code dispatched' });
  } catch (err) {
    res.status(500).json({ msg: 'Recovery dispatch failed' });
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
