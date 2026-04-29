const http = require('https');

const postData = JSON.stringify({
  email: 'final_audit_v7@test.com',
  password: 'SecureVault123!',
  username: 'Auditor'
});

const options = {
  hostname: 'securevault-main.onrender.com',
  port: 443,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

console.log('--- [INITIATING LIVE REGISTRATION AUDIT] ---');

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('RESPONSE:', body);
    if (res.statusCode === 201 || res.statusCode === 200) {
      console.log('✅ REGISTRATION SUCCESSFUL');
    } else {
      console.log('❌ REGISTRATION FAILED');
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ AUDIT CRASHED: ${e.message}`);
});

req.write(postData);
req.end();
