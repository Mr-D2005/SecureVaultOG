const { KMSClient, EncryptCommand } = require("@aws-sdk/client-kms");
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config({ path: './config.env' });

const client = new KMSClient({
    region: process.env.AWS_REGION || 'eu-north-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

async function test() {
    let report = '';
    try {
        console.log('--- KMS TEST START ---');
        const encryptCommand = new EncryptCommand({
            KeyId: process.env.KMS_KEY_ID,
            Plaintext: Buffer.from('TEST_DATA')
        });
        const response = await client.send(encryptCommand);
        report = `SUCCESS: ${response.KeyId}`;
        console.log(report);
    } catch (err) {
        report = `FAILURE: ${err.name} - ${err.message}`;
        console.error(report);
    }
    fs.writeFileSync('diagnostic_report.txt', report);
}
test();
