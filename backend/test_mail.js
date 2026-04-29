const sendEmail = require('./utils/sendEmail');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

async function test() {
  console.log('--- [SMTP_TEST_INIT] ---');
  await sendEmail({
    email: 'mrd1322005@gmail.com',
    subject: '[SECURE-TEST] System Handshake',
    message: 'Testing mail dispatch from SecureVault Backend Node.',
    html: '<h1>System Handshake Nominal</h1><p>The SMTP relay is functional.</p>'
  });
  console.log('--- [SMTP_TEST_DONE] ---');
}

test();
