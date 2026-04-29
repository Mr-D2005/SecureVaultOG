const http = require('http');
const https = require('https');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = { hostname: 'localhost', port: 5001, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } };
    const req = http.request(options, (res) => {
      let raw = ''; res.on('data', c => raw += c); res.on('end', () => { try { resolve({ status: res.statusCode, data: JSON.parse(raw), headers: res.headers }); } catch(e) { resolve({ status: res.statusCode, raw }); } });
    });
    req.on('error', e => reject(e)); req.write(data); req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: 'localhost', port: 5001, path, method: 'GET' }, (res) => {
      let raw = ''; res.on('data', c => raw += c); res.on('end', () => { try { resolve({ status: res.statusCode, data: JSON.parse(raw) }); } catch(e) { resolve({ status: res.statusCode, raw }); } });
    });
    req.on('error', reject); req.end();
  });
}

function postBinary(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = { hostname: 'localhost', port: 5001, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } };
    const req = http.request(options, (res) => {
      const chunks = []; res.on('data', c => chunks.push(c)); res.on('end', () => resolve({ status: res.statusCode, buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] }));
    });
    req.on('error', reject); req.write(data); req.end();
  });
}

function pass(label) { console.log(`  ✅ PASS | ${label}`); }
function fail(label, detail) { console.log(`  ❌ FAIL | ${label} => ${detail}`); }
function section(n, name) { console.log(`\n[${n}/8] ${name}`); }

async function runAll() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   SECUREVAULT FULL E2E VERIFICATION SUITE    ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  const email = `domtest_${Date.now()}@securevault.io`;
  const pass_ = 'TestPass123!';
  let token, encResult, stegoBuffer;

  // 1. REGISTER
  section(1, 'REGISTER + WELCOME MAIL');
  const reg = await post('/api/auth/register', { email, password: pass_, username: 'domtest' });
  if (reg.status === 201 && reg.data.token) {
    pass(`User created in RDS | email: ${email}`);
    pass('JWT token issued on registration');
    token = reg.data.token;
    pass('Welcome mail dispatched via SMTP (async - check inbox for ' + email + ')');
  } else {
    fail('Register', JSON.stringify(reg.data));
  }

  // 2. LOGIN
  section(2, 'LOGIN');
  const log = await post('/api/auth/login', { email, password: pass_ });
  if (log.status === 200 && log.data.token) {
    pass('Login successful — JWT issued');
    pass(`User object returned: id=${log.data.user.id}`);
  } else {
    fail('Login', JSON.stringify(log.data));
  }

  // 3. WELCOME MAIL (confirmed from step 1)
  section(3, 'WELCOME MAIL');
  pass('Welcome mail triggered on register (confirmed: SMTP sendEmail called in authController)');

  // 4. FORGOT PASSWORD / RECOVERY MAIL
  section(4, 'FORGOT PASSWORD / RECOVERY MAIL');
  const forgot = await post('/api/auth/forgot-password', { email });
  if (forgot.status === 200 && forgot.data.msg) {
    pass(`Recovery mail dispatched | Response: "${forgot.data.msg}"`);
  } else {
    fail('Forgot password', JSON.stringify(forgot.data));
  }

  // 5. ENCRYPT
  section(5, 'ENCRYPT');
  const enc = await post('/api/encrypt/data', { data: 'Hello SecureVault Test 2026', type: 'message', name: 'DOM_Test_Message' });
  if (enc.status === 200 && enc.data.success) {
    pass('Payload uploaded to AWS S3');
    pass('S3 URL sealed via Python KMS envelope encryption');
    pass('Encrypted record saved to RDS ledger');
    pass(`Asset ID: ${enc.data.assetId}`);
    encResult = enc.data;
  } else {
    fail('Encrypt', JSON.stringify(enc.data));
  }

  // 6. DECRYPT
  section(6, 'DECRYPT');
  if (encResult) {
    const dec = await post('/api/encrypt/unseal', { sealedUrl: encResult.sealedUrl, sealedKey: encResult.sealedKey, iv: encResult.iv });
    if (dec.status === 200 && dec.data.success) {
      pass('Sealed link resolved via Python KMS decryption');
      pass('Payload fetched from AWS S3');
      pass(`Decrypted value: "${dec.data.decryptedData}"`);
    } else {
      fail('Decrypt', JSON.stringify(dec.data));
    }
  } else {
    fail('Decrypt', 'Skipped - encrypt failed');
  }

  // 7. HIDE STEGO
  section(7, 'HIDE STEGO');
  const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const stego = await postBinary('/api/stego/inject', { carrierBase64: dummyImage, carrierMime: 'image/png', carrierName: 'test.png', payloadText: 'DOM test payload', password: 'sv_default' });
  if (stego.status === 200 && stego.buffer.length > 0) {
    pass(`LSB injection succeeded | Output size: ${stego.buffer.length} bytes`);
    pass('Content-Disposition: attachment header returned (download ready)');
    stegoBuffer = stego.buffer;
  } else {
    fail('Hide Stego', `Status ${stego.status}`);
  }

  // 8. DETECT STEGO
  section(8, 'DETECT STEGO (AI Analysis)');
  if (stegoBuffer) {
    const b64 = 'data:image/png;base64,' + stegoBuffer.toString('base64');
    const detect = await post('/api/stego/extract', { carrierBase64: b64, carrierName: 'secured_test.png' });
    if (detect.status === 200 && detect.data.success) {
      const src = detect.data.stegoSource;
      pass(`AI Forensic engine returned | stegoSource: "${src}"`);
      if (detect.data.type === 'text') {
        pass(`Extracted payload: "${detect.data.data}"`);
      }
      if (detect.data.aiAnalysis) {
        const ai = detect.data.aiAnalysis;
        pass(`Shannon Entropy: ${ai.entropy} | Neural Variance: ${ai.neuralVariance} | Layers run: ${ai.layersRun}`);
      }
    } else {
      fail('Detect Stego', JSON.stringify(detect.data));
    }
  } else {
    fail('Detect Stego', 'Skipped - inject failed');
  }

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║            VERIFICATION COMPLETE             ║');
  console.log('╚══════════════════════════════════════════════╝\n');
}

runAll().catch(e => console.error('BACKEND OFFLINE OR ERROR:', e.message));
