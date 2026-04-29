const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 5001,
      path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };
    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(raw) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function test() {
  console.log('--- AUTH LIVE TEST ---\n');
  
  const reg = await post('/api/auth/register', { email: 'livetest2@securevault.io', password: 'TestPass123!' });
  console.log('REGISTER:', reg.status, JSON.stringify(reg.data));

  const log = await post('/api/auth/login', { email: 'livetest2@securevault.io', password: 'TestPass123!' });
  console.log('LOGIN OK :', log.status, log.data.token ? 'JWT ISSUED' : JSON.stringify(log.data));

  const bad = await post('/api/auth/login', { email: 'livetest2@securevault.io', password: 'WrongPass!' });
  console.log('LOGIN BAD:', bad.status, JSON.stringify(bad.data));

  // Test with your default account
  const me = await post('/api/auth/login', { email: 'mrd1322005@gmail.com', password: 'Password123!' });
  console.log('LOGIN MAIN ACCT:', me.status, me.data.token ? 'JWT ISSUED' : JSON.stringify(me.data));
}

test().catch(e => console.error('CONNECTION ERROR (backend offline?):', e.message));
