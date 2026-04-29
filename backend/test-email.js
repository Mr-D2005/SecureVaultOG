const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, 'config.env') });

async function test() {
  console.log('--- [INITIATING STANDALONE SMTP PROBE] ---');
  console.log('TARGET:', process.env.SMTP_EMAIL);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
    debug: true,
    logger: true
  });

  const message = {
    from: process.env.SMTP_EMAIL, // Simplest possible sender
    to: process.env.SMTP_EMAIL,   // Send to self for test
    subject: 'SECUREVAULT_DIAGNOSTIC_TEST',
    text: 'If you receive this, the SMTP pipeline is 100% operational.'
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('✅ TEST SUCCESSFUL!');
    console.log('Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ TEST FAILED!');
    console.error('ERROR TYPE:', err.code);
    console.error('FULL ERROR:', err.message);
  }
}

test();
