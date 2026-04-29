const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('--- [INITIATING STEALTH DISPATCH] ---');
  
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.error('❌ [CRITICAL] SMTP Credentials missing!');
    return;
  }

  // Use explicit host/port settings for maximum cloud compatibility
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
    pool: true, // Use persistent connections
    maxConnections: 1,
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
    tls: {
      rejectUnauthorized: false
    }
  });

  const message = {
    from: `"SecureVault" <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: `[SECUREVAULT] ${options.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: sans-serif; background-color: #050505; color: #ffffff; }
          .container { max-width: 600px; margin: 20px auto; background: #0a0a0a; border: 1px solid #333; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
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
            ${options.link ? `<a href="${options.link}" class="button">Access Secure Channel</a>` : ''}
          </div>
          <div class="footer">&copy; 2026 SecureVault Forensics Division</div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('🚀 [STEALTH_DISPATCH_SUCCESS]:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ [STEALTH_DISPATCH_FAILURE]:', err.message);
    // Log the full error to see if it's an IPv6 issue
    if (err.message.includes('ECONNREFUSED') || err.message.includes('ETIMEDOUT')) {
      console.error('--- HINT: This is a Render network firewall issue. ---');
    }
    throw err;
  }
};

module.exports = sendEmail;
