const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter with explicit settings for Gmail
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // 2. Define the email options with premium cinematic branding
  const message = {
    from: `"SecureVault" <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: `[SECURE-UPLINK] ${options.subject}`,
    text: options.message,
    html: options.html || `<div style="background:#07050a; color:#fff; padding:20px; font-family:sans-serif; border:1px solid #8b5cf6;">${options.message}</div>`
  };

  // 3. Actually send the email
  try {
    await transporter.sendMail(message);
    console.log(`--- [SMTP_DISPATCH_COMPLETE: ${options.email}] ---`);
  } catch (err) {
    console.error(`--- [SMTP_DISPATCH_FAILURE: ${options.email}] ---`, err);
  }
};

module.exports = sendEmail;
