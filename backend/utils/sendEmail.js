const https = require('https');

const sendEmail = async (options) => {
  console.log('--- [INITIATING NATIVE_HTTPS DISPATCH] ---');
  
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ [CRITICAL] RESEND_API_KEY IS MISSING IN RENDER!');
    return;
  }

  const data = JSON.stringify({
    from: process.env.RESEND_FROM || 'SecureVault <onboarding@resend.dev>',
    to: [options.email],
    subject: `[SECUREVAULT] ${options.subject}`,
    html: `
      <div style="background:#050505; color:#fff; padding:40px; font-family:sans-serif; border:1px solid #333; border-radius:12px;">
        <h1 style="color:#8b5cf6;">SECUREVAULT</h1>
        <p style="color:#a1a1aa; font-size:16px;">${options.message.replace(/\n/g, '<br>')}</p>
        ${options.link ? `<a href="${options.link}" style="background:#8b5cf6; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; display:inline-block; margin-top:20px;">Access Vault</a>` : ''}
        <p style="margin-top:40px; font-size:11px; color:#555; border-top:1px solid #222; padding-top:20px;">&copy; 2026 SecureVault Forensics Division</p>
      </div>
    `
  });

  const reqOptions = {
    hostname: 'api.resend.com',
    path: '/emails',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(reqOptions, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        const parsed = JSON.parse(responseBody);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('🚀 [NATIVE_SUCCESS]:', parsed.id);
          resolve(parsed);
        } else {
          console.error('❌ [NATIVE_FAILURE]:', parsed);
          reject(new Error(parsed.message || 'Resend API Error'));
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ [SOCKET_ERROR]:', err.message);
      reject(err);
    });

    req.write(data);
    req.end();
  });
};

module.exports = sendEmail;
