const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter with forensic logging enabled
  const transporter = nodemailer.createTransport({
    service: 'gmail', // This is much more reliable for Gmail accounts
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
    debug: true,   // Show SMTP traffic in logs
    logger: true,  // Log information to console
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify connection configuration immediately
  transporter.verify(function (error, success) {
    if (error) {
      console.error('--- [SMTP CONNECTION FAILURE] ---');
      console.error('ERROR:', error.message);
      console.error('USER:', process.env.SMTP_EMAIL ? 'PROVIDED' : 'MISSING');
      console.error('PASS:', process.env.SMTP_PASSWORD ? 'PROVIDED' : 'MISSING');
    } else {
      console.log('--- [SMTP CONNECTION ESTABLISHED: UPLINK READY] ---');
    }
  });


  // 2. Define the email options with premium cinematic branding
  const message = {
    from: process.env.SMTP_EMAIL,

    to: options.email,
    subject: `[SECUREVAULT] ${options.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #050505; color: #ffffff; }
          .container { max-width: 600px; margin: 40px auto; background: linear-gradient(145deg, #0a0a0a, #111111); border: 1px solid #222; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
          .header { background: #000; padding: 40px 20px; text-align: center; border-bottom: 1px solid #333; }
          .logo { color: #8b5cf6; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
          .content { padding: 40px; line-height: 1.6; }
          .title { font-size: 22px; font-weight: 600; margin-bottom: 20px; color: #fff; }
          .text { color: #a1a1aa; margin-bottom: 30px; }
          .button-zone { text-align: center; margin: 40px 0; }
          .button { background: #8b5cf6; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; transition: all 0.3s ease; }
          .footer { background: #000; padding: 20px; text-align: center; font-size: 12px; color: #52525b; border-top: 1px solid #111; }
          .warning { font-size: 11px; color: #ef4444; margin-top: 20px; opacity: 0.7; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">SECUREVAULT</div>
          </div>
          <div class="content">
            <div class="title">${options.subject}</div>
            <div class="text">${options.message.replace(/\n/g, '<br>')}</div>
            ${options.link ? `
            <div class="button-zone">
              <a href="${options.link}" class="button">Access Secure Channel</a>
            </div>` : ''}
            <div class="warning">
              This is an automated security transmission. If you did not request this, please initiate a Forensic Lockdown immediately.
            </div>
          </div>
          <div class="footer">
            &copy; 2026 SecureVault Forensics Division. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `
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
