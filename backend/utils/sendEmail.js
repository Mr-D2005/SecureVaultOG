const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('--- [INITIATING SECURE DISPATCH] ---');
  console.log('RECIPIENT:', options.email);
  
  // Verify credentials exist
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.error('❌ [CRITICAL] SMTP Credentials missing from environment!');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // 1. Verify connection (Await for it to be sure)
  try {
    await transporter.verify();
    console.log('✅ [SMTP UPLINK ESTABLISHED]');
  } catch (err) {
    console.error('❌ [SMTP UPLINK FAILED]:', err.message);
    throw new Error('Email gateway unreachable');
  }

  // 2. Define message
  const message = {
    from: process.env.SMTP_EMAIL,
    to: options.email,
    subject: `[SECUREVAULT] ${options.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: sans-serif; background-color: #050505; color: #ffffff; }
          .container { max-width: 600px; margin: 20px auto; background: #0a0a0a; border: 1px solid #333; border-radius: 12px; overflow: hidden; }
          .header { background: #000; padding: 30px; text-align: center; border-bottom: 1px solid #8b5cf6; }
          .content { padding: 40px; color: #a1a1aa; line-height: 1.6; }
          .title { color: #fff; font-size: 20px; margin-bottom: 20px; font-weight: bold; }
          .button { background: #8b5cf6; color: #fff !important; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 20px 0; }
          .footer { background: #000; padding: 15px; text-align: center; font-size: 11px; color: #555; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color:#8b5cf6; margin:0; font-size:24px;">SECUREVAULT</h1>
          </div>
          <div class="content">
            <div class="title">${options.subject}</div>
            <p>${options.message.replace(/\n/g, '<br>')}</p>
            ${options.link ? `<a href="${options.link}" class="button">Access Vault</a>` : ''}
          </div>
          <div class="footer">&copy; 2026 SecureVault Forensics</div>
        </div>
      </body>
      </html>
    `
  };

  // 3. Dispatch
  try {
    const info = await transporter.sendMail(message);
    console.log('🚀 [DISPATCH SUCCESSFUL]:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ [DISPATCH FAILED]:', err.message);
    throw err;
  }
};

module.exports = sendEmail;
