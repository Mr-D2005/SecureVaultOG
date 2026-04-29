const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('--- [INITIATING SMTP2GO STEALTH DISPATCH] ---');
  
  // Use SMTP2GO on Port 2525 (Bypasses Render Firewall)
  const transporter = nodemailer.createTransport({
    host: 'mail.smtp2go.com',
    port: 2525,
    secure: false, // Must be false for 2525/587
    auth: {
      user: process.env.SMTP_USER || '20230801002@dypiu.ac.in',
      pass: process.env.SMTP_PASS || 'Divanshu@123'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const message = {
    from: '"SecureVault Support" <20230801002@dypiu.ac.in>', // Testing with authorized ID
    to: options.email,


    subject: `[SECUREVAULT] ${options.subject}`,
    html: `
      <div style="background:#050505; color:#fff; padding:40px; font-family:sans-serif; border:1px solid #333; border-radius:12px;">
        <h1 style="color:#8b5cf6;">SECUREVAULT</h1>
        <p style="color:#a1a1aa; font-size:16px;">${options.message.replace(/\n/g, '<br>')}</p>
        ${options.link ? `<a href="${options.link}" style="background:#8b5cf6; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; display:inline-block; margin-top:20px;">Access Vault</a>` : ''}
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('🚀 [SMTP2GO_SUCCESS]:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ [SMTP2GO_FAILURE]:', err.message);
    throw err;
  }
};

module.exports = sendEmail;
