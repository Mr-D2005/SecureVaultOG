const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('--- [INITIATING MAILTRAP SANDBOX DISPATCH] ---');
  
  // Use Mailtrap for Zero-Verification Testing (Port 2525)
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '1902c632d49786',
      pass: 'c56f957af2e81d'
    }
  });

  const message = {
    from: '"SecureVault Test" <test@securevault.io>',
    to: options.email,
    subject: `[SECUREVAULT] ${options.subject}`,
    html: `
      <div style="background:#050505; color:#fff; padding:40px; font-family:sans-serif; border:1px solid #8b5cf6; border-radius:12px;">
        <h1 style="color:#8b5cf6;">SECUREVAULT SANDBOX</h1>
        <p style="color:#a1a1aa; font-size:16px;">${options.message.replace(/\n/g, '<br>')}</p>
        ${options.link ? `<a href="${options.link}" style="background:#8b5cf6; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; display:inline-block; margin-top:20px;">Access Vault</a>` : ''}
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('🚀 [MAILTRAP_SUCCESS]:', info.messageId);
    console.log('--- CHECK YOUR MAILTRAP DASHBOARD TO SEE THE OTP ---');
    return info;
  } catch (err) {
    console.error('❌ [MAILTRAP_FAILURE]:', err.message);
    throw err;
  }
};

module.exports = sendEmail;
