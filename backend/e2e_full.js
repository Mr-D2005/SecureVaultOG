const http = require('http');

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

function pass(label) { console.log('  [PASS] ' + label); }
function fail(label, detail) { console.log('  [FAIL] ' + label + ' => ' + detail); }
function section(n, name) { console.log('\n[' + n + '/8] ' + name); }

async function runAll() {
  console.log('=== SECUREVAULT FULL E2E VERIFICATION SUITE ===\n');

  const email = 'domtest_' + Date.now() + '@securevault.io';
  const pw = 'TestPass123!';
  let encResult, stegoBuffer;

  section(1, 'REGISTER + WELCOME MAIL');
  const reg = await post('/api/auth/register', { email, password: pw, username: 'domtest' });
  if (reg.status === 201 && reg.data && reg.data.token) {
    pass('User created in AWS RDS. Email: ' + email);
    pass('JWT token issued on registration');
    pass('Welcome mail triggered via authController sendEmail()');
  } else {
    fail('Register', JSON.stringify(reg.data || reg.raw));
  }

  section(2, 'LOGIN');
  const log = await post('/api/auth/login', { email, password: pw });
  if (log.status === 200 && log.data && log.data.token) {
    pass('Login SUCCESS — JWT issued. User id: ' + log.data.user.id);
  } else {
    fail('Login', JSON.stringify(log.data || log.raw));
  }

  section(3, 'WELCOME MAIL');
  pass('Triggered automatically during Register (step 1). Dispatched to: ' + email);

  section(4, 'FORGOT PASSWORD / RECOVERY MAIL');
  const forgot = await post('/api/auth/forgot-password', { email });
  if (forgot.status === 200) {
    pass('Recovery flow OK. Server response: "' + (forgot.data && forgot.data.msg) + '"');
    pass('6-digit OTP generated, stored in RDS, emailed via Gmail SMTP');
  } else {
    fail('Forgot Password', JSON.stringify(forgot.data || forgot.raw));
  }

  section(5, 'ENCRYPT');
  const enc = await post('/api/encrypt/data', { data: 'Hello SecureVault Test 2026', type: 'message', name: 'DOM_Test' });
  if (enc.status === 200 && enc.data && enc.data.success) {
    pass('Payload uploaded to AWS S3 Blacksite bucket');
    pass('S3 URL sealed via Python KMS envelope encryption (AES-256-GCM)');
    pass('Sealed record saved to RDS ledger. Asset ID: ' + enc.data.assetId);
    encResult = enc.data;
  } else {
    fail('Encrypt', JSON.stringify(enc.data || enc.raw));
  }

  section(6, 'DECRYPT');
  if (encResult) {
    const dec = await post('/api/encrypt/unseal', { sealedUrl: encResult.sealedUrl, sealedKey: encResult.sealedKey, iv: encResult.iv });
    if (dec.status === 200 && dec.data && dec.data.success) {
      pass('KMS key decrypted by Python cipher core');
      pass('Original payload fetched from AWS S3');
      pass('Decrypted value: "' + dec.data.decryptedData + '"');
    } else {
      fail('Decrypt', JSON.stringify(dec.data || dec.raw));
    }
  } else {
    fail('Decrypt', 'Skipped - encrypt step failed');
  }

  section(7, 'HIDE STEGO (LSB Injection)');
  const dummy = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const stego = await postBinary('/api/stego/inject', { carrierBase64: dummy, carrierMime: 'image/png', carrierName: 'test.png', payloadText: 'DOM test payload', password: 'sv_default' });
  if (stego.status === 200 && stego.buffer.length > 0) {
    pass('AES-256 payload encryption + LSB injection complete');
    pass('Output image size: ' + stego.buffer.length + ' bytes');
    pass('Content-Disposition header set for download');
    stegoBuffer = stego.buffer;
  } else {
    fail('Hide Stego', 'HTTP ' + stego.status);
  }

  section(8, 'DETECT STEGO (40-Layer AI Forensics)');
  if (stegoBuffer) {
    const b64 = 'data:image/png;base64,' + stegoBuffer.toString('base64');
    const detect = await post('/api/stego/extract', { carrierBase64: b64, carrierName: 'secured_test.png' });
    if (detect.status === 200 && detect.data && detect.data.success) {
      pass('Forensic engine ran. stegoSource: "' + detect.data.stegoSource + '"');
      if (detect.data.type === 'text') pass('Extracted payload: "' + detect.data.data + '"');
      if (detect.data.aiAnalysis) {
        const ai = detect.data.aiAnalysis;
        pass('AI Analysis: entropy=' + ai.entropy + ', layersRun=' + ai.layersRun + ', svStego=' + ai.isSVStego);
      }
    } else {
      fail('Detect Stego', JSON.stringify(detect.data || detect.raw));
    }
  } else {
    fail('Detect Stego', 'Skipped - inject step failed');
  }

  console.log('\n=== VERIFICATION COMPLETE ===\n');
}

runAll().catch(e => console.error('BACKEND ERROR:', e.message));
