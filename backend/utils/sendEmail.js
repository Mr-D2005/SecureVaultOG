const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('--- [INITIATING EMERGENCY BREACH DISPATCH] ---');
  
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.error('❌ [CRITICAL] SMTP Credentials missing!');
    return;
  }

  // Using a Direct IP approach and aggressive socket settings to bypass Render firewall
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
    // Aggressive socket settings for blocked networks
    connectionTimeout: 40000,
    greetingTimeout: 40000,
    socketTimeout: 40000,
    debug: true,
    logger: true,
    tls: {
      rejectUnauthorized: false
    }
  });

  const message = {
    from: process.env.SMTP_EMAIL,
    to: options.email,
    subject: `[SECUREVAULT] ${options.subject}`,
    html: `<div style="background:#000;color:#fff;padding:20px;border:1px solid #8b5cf6;">
      <h1 style="color:#8b5cf6;">SECUREVAULT</h1>
      <p>${options.message}</p>
      ${options.link ? `<a href="${options.link}" style="color:#8b5cf6;">Click here to Access Vault</a>` : ''}
    </div>`
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('🚀 [BREACH_SUCCESS]:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ [BREACH_FAILURE]:', err.message);
    console.error('--- TRYING FALLBACK: ANALYZING NETWORK BLOCKS ---');
    throw err;
  }
};

module.exports = sendEmail;
