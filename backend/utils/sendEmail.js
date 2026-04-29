const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('--- [INITIATING IPv4 DISPATCH] ---');
  
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.error('❌ [CRITICAL] SMTP Credentials missing!');
    return;
  }

  // Force IPv4 to bypass Render's IPv6 reputation issues
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
    family: 4, // <--- FORCE IPv4
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false
    }
  });

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
          .header { background: #000; padding: 30px; text-align: center; border-bottom: 2px solid #8b5cf6; }
          .content { padding: 40px; color: #a1a1aa; line-height: 1.6; }
          .title { color: #fff; font-size: 22px; margin-bottom: 20px; font-weight: bold; }
          .button { background: #8b5cf6; color: #fff !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 25px 0; font-weight: bold; }
          .footer { background: #000; padding: 20px; text-align: center; font-size: 11px; color: #555; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color:#8b5cf6; margin:0; font-size:26px; letter-spacing:2px;">SECUREVAULT</h1>
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

  try {
    const info = await transporter.sendMail(message);
    console.log('🚀 [IPv4_DISPATCH_SUCCESS]:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ [IPv4_DISPATCH_FAILURE]:', err.message);
    console.error('ERROR_CODE:', err.code);
    throw err;
  }
};

module.exports = sendEmail;
