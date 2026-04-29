const https = require('https');

const sendEmail = (options) => {
  return new Promise((resolve, reject) => {
    console.log('--- [INITIATING BREVO HTTP DISPATCH] ---');
    console.log(`Sending to: ${options.email}`);

    // Fetch the API Key from Environment Variables (To avoid GitHub blocks)
    const API_KEY = process.env.BREVO_API_KEY;
    
    if (!API_KEY) {
      console.error('❌ [CRITICAL] BREVO_API_KEY is not set in Render Environment Variables!');
      return reject(new Error('BREVO_API_KEY is missing'));
    }

    // The Verified Sender Email (From your Brevo profile)
    const SENDER_EMAIL = 'divyanshusajnani@gmail.com'; 

    const payload = JSON.stringify({
      sender: {
        name: 'SecureVault System',
        email: SENDER_EMAIL
      },
      to: [
        {
          email: options.email
        }
      ],
      subject: options.subject,
      htmlContent: `
        <div style="font-family: monospace; background-color: #050505; color: #00ffcc; padding: 30px; border: 1px solid #333; max-width: 600px; margin: 0 auto; border-radius: 8px;">
          <h2 style="color: #00ffcc; border-bottom: 1px solid #333; padding-bottom: 10px;">[SECUREVAULT_DISPATCH]</h2>
          <p style="font-size: 16px; color: #ccc;">${options.message.replace(/\n/g, '<br>')}</p>
          ${options.link ? `<div style="margin-top: 30px;"><a href="${options.link}" style="background-color: #00ffcc; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Access Vault Sequence</a></div>` : ''}
          <div style="margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #333; padding-top: 10px;">
            End of Transmission.<br>
            SecureVault Quantum Ledger System
          </div>
        </div>
      `
    });

    const requestOptions = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('🚀 [BREVO_SUCCESS]: Email delivered to actual inbox!');
          resolve();
        } else {
          console.error('❌ [BREVO_FAILED]:', res.statusCode, data);
          reject(new Error(`Brevo HTTP Error: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ [BREVO_NETWORK_ERROR]:', error.message);
      reject(error);
    });

    // Send the payload
    req.write(payload);
    req.end();
  });
};

module.exports = sendEmail;
