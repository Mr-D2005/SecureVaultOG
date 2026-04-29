const http = require('https');

async function test(name, path, payload) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(payload);
    const options = {
      hostname: 'securevault-main.onrender.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData ? postData.length : 0
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log(`[${name}] STATUS: ${res.statusCode}`);
        console.log(`[${name}] RESPONSE: ${body.substring(0, 200)}...`);
        resolve(res.statusCode < 400);
      });
    });
    req.on('error', (e) => {
      console.log(`[${name}] ERROR: ${e.message}`);
      resolve(false);
    });
    if (postData) req.write(postData);
    req.end();
  });
}

async function runAudit() {
  console.log('--- [STARTING SUPER AUDIT: SECUREVAULT LIVE] ---');
  
  await test('REGISTRATION', '/api/auth/register', { 
    email: `audit_${Date.now()}@test.com`, 
    password: 'Password123!', 
    username: 'Auditor' 
  });

  await test('RAVAN_AI', '/api/ravan/chat', { 
    message: 'Are you online?' 
  });

  await test('THREAT_SCAN', '/api/threat/scan', { 
    url: 'https://google.com' 
  });

  console.log('--- [SUPER AUDIT COMPLETE] ---');
}

runAudit();
