const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('--- [INITIATING UNIVERSAL BYPASS DISPATCH] ---');
  
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.error('❌ [CRITICAL] SMTP Credentials missing!');
    return;
  }

  // Use Port 587 (STARTTLS) - The most compatible port for Cloud Providers
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Must be false for 587
    requireTLS: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
    family: 4, // Force IPv4
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    }
  });

  const message = {
    from: `"SecureVault" <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: `[SECUREVAULT] ${options.subject}`,
    html: `
      <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 12px; border: 1px solid #333; max-width: 600px; margin: auto;">
        <h1 style="color: #8b5cf6; border-bottom: 1px solid #333; padding-bottom: 20px;">SECUREVAULT</h1>
        <h2 style="margin-top: 30px;">${options.subject}</h2>
        <p style="color: #a1a1aa; line-height: 1.6; font-size: 16px;">${options.message.replace(/\n/g, '<br>')}</p>
        ${options.link ? `<a href="${options.link}" style="background: #8b5cf6; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 20px; font-weight: bold;">Access Vault</a>` : ''}
        <p style="margin-top: 40px; font-size: 12px; color: #555; border-top: 1px solid #222; padding-top: 20px;">&copy; 2026 SecureVault Forensics Division</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('🚀 [BYPASS_SUCCESS]:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ [BYPASS_FAILURE]:', err.message);
    console.error('ERROR_CODE:', err.code);
    console.error('SMTP_RESPONSE:', err.response);
    throw err;
  }
};

module.exports = sendEmail;
