const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'eu-north-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const uploadToS3 = async (ciphertext) => {
    const bucket = process.env.AWS_S3_BUCKET || 'secvaults3';
    const key = `vault_payload_${crypto.randomUUID()}.enc`;

    await s3Client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: ciphertext,
        ContentType: 'application/octet-stream',
    }));

    console.log(`--- [S3_UPLINK SUCCESS]: Asset deposited → s3://${bucket}/${key} ---`);
    return `s3://${bucket}/${key}`;
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
        throw new Error('Could not retrieve asset from S3 Blacksite');
    }
};

module.exports = { uploadToS3, fetchFromS3 };
