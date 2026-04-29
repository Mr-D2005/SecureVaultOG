const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
// Environment variables are loaded once in server.js
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});


const uploadToS3 = async (ciphertext) => {
    const bucket = process.env.AWS_S3_BUCKET || 'secvaults3';
    const key = `vault_payload_${crypto.randomUUID()}.enc`;

    try {
        await s3Client.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: ciphertext,
            ContentType: 'application/octet-stream',
        }));

        console.log(`--- [S3_UPLINK SUCCESS]: Asset deposited → s3://${bucket}/${key} ---`);
        return `s3://${bucket}/${key}`;
    } catch (err) {
        console.error('--- [S3_UPLINK_FAILURE] ---', err);
        throw new Error(`S3 Deposition Failed: ${err.message}`);
    }
};


const fetchFromS3 = async (s3Url) => {
    try {
        const urlParts = s3Url.replace('s3://', '').split('/');
        const bucket = urlParts[0];
        const key = urlParts.slice(1).join('/');

        const response = await s3Client.send(new GetObjectCommand({
            Bucket: bucket,
            Key: key
        }));

        const body = await response.Body.transformToString();
        return body;
    } catch (err) {
        console.error('--- [S3_RECOVERY_FAILURE] ---', err);
        throw new Error(`S3 Blacksite Retrieval Failed: ${err.message}`);
    }
};


module.exports = { uploadToS3, fetchFromS3 };
