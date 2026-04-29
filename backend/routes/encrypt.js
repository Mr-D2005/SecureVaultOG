const express = require('express');
const router = express.Router();
const { EncryptedData } = require('../models/index');
const { uploadToS3, fetchFromS3 } = require('../utils/s3_vault');
const crypto = require('crypto');
const { KMSClient, EncryptCommand, DecryptCommand } = require('@aws-sdk/client-kms');

// --- INITIALIZE AWS KMS CLIENT ---
const kmsClient = new KMSClient({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// --- NATIVE NODE.JS SEALING PROTOCOL (Replaces Python Microservice) ---
const localSeal = async (payloadString) => {
    // 1. Generate AES 256 Key & IV
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // 2. Encrypt Data with AES-256-CBC
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    let ciphertext = cipher.update(payloadString, 'utf8', 'base64');
    ciphertext += cipher.final('base64');

    // 3. Seal AES Key with AWS KMS
    let sealedKeyB64;
    try {
        const command = new EncryptCommand({
            KeyId: process.env.KMS_KEY_ID,
            Plaintext: aesKey,
            EncryptionAlgorithm: 'RSAES_OAEP_SHA_256'
        });
        const response = await kmsClient.send(command);
        sealedKeyB64 = Buffer.from(response.CiphertextBlob).toString('base64');
    } catch (err) {
        console.error("--- [KMS_OFFLINE]: Engaging Emergency Local Vault Seal ---", err.message);
        // Fallback: Seal AES key with Local Master Hex Key
        const localMaster = Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", 'hex');
        const fallbackCipher = crypto.createCipheriv('aes-256-ecb', localMaster, null);
        fallbackCipher.setAutoPadding(false); // Key is exactly 32 bytes
        let fallbackSealed = fallbackCipher.update(aesKey);
        fallbackSealed = Buffer.concat([fallbackSealed, fallbackCipher.final()]);
        sealedKeyB64 = "LOCAL:" + fallbackSealed.toString('base64');
    }

    return {
        ciphertext: ciphertext,
        sealedKey: sealedKeyB64,
        iv: iv.toString('base64')
    };
};

// --- NATIVE NODE.JS UNSEALING PROTOCOL ---
const localUnseal = async (ciphertextB64, sealedKeyB64, ivB64) => {
    const iv = Buffer.from(ivB64, 'base64');
    let aesKey;

    // 1. Unseal AES Key
    try {
        if (sealedKeyB64.startsWith("LOCAL:")) {
            const localMaster = Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", 'hex');
            const encryptedAesKey = Buffer.from(sealedKeyB64.replace("LOCAL:", ""), 'base64');
            const decipher = crypto.createDecipheriv('aes-256-ecb', localMaster, null);
            decipher.setAutoPadding(false); 
            aesKey = Buffer.concat([decipher.update(encryptedAesKey), decipher.final()]);
        } else {
            const command = new DecryptCommand({
                CiphertextBlob: Buffer.from(sealedKeyB64, 'base64'),
                KeyId: process.env.KMS_KEY_ID,
                EncryptionAlgorithm: 'RSAES_OAEP_SHA_256'
            });
            const response = await kmsClient.send(command);
            aesKey = Buffer.from(response.Plaintext);
        }
    } catch (err) {
        throw new Error("Asset unsealing failed via cryptographic core: " + err.message);
    }

    // 2. Decrypt Payload
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
    let decryptedData = decipher.update(ciphertextB64, 'base64', 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
};


/**
 * @route   POST /api/encrypt/data
 * @desc    Shielded Link Protocol: Upload to S3, Seal the Link
 */
router.post('/data', async (req, res) => {
    try {
        const { data, type, name } = req.body;
        if (!data) return res.status(400).json({ msg: 'No asset payload detected' });

        // Phase 1: Upload PLAIN Asset to S3 Blacksite
        const s3Url = await uploadToS3(data);
        const downloadUrl = null;

        // Phase 2: Seal the S3 URL natively in Node.js (Bypasses Python 429 Errors)
        const pyData = await localSeal(s3Url);

        // Phase 3: Archive Shielded Metadata in RDS Ledger
        const entry = await EncryptedData.create({
            userId: null, 
            action: type === 'file' ? 'SHIELD_FILE' : 'SHIELD_MESSAGE',
            target: name || 'Shielded Asset',
            ciphertext: pyData.ciphertext, // Encrypted S3 URL
            sealedKey: pyData.sealedKey,
            iv: pyData.iv,
            s3_url: s3Url,
            status: 'LINK_SEALED'
        });

        res.json({
            success: true,
            assetId: entry.id,
            s3_url: s3Url,
            downloadUrl: downloadUrl,
            sealedUrl: pyData.ciphertext,
            sealedKey: pyData.sealedKey,
            iv: pyData.iv,
            kmsPublicKey: process.env.KMS_KEY_ID, // Use Key ID as Public ID
            msg: `Asset successfully shielded in S3. Link is sealed.`
        });
    } catch (err) {
        console.error('--- [SHIELD_GATEWAY_FAILURE] ---', err);
        res.status(500).json({ msg: 'Shielding Protocol Failed', details: err.message });
    }
});

/**
 * @route   POST /api/encrypt/unseal
 * @desc    Resolve Shielded Link and Retrieve Asset
 */
router.post('/unseal', async (req, res) => {
    try {
        const { sealedUrl, sealedKey, iv } = req.body;

        if (!sealedUrl || !sealedKey || !iv) {
            return res.status(400).json({ msg: 'Cryptographic signature incomplete' });
        }

        // Phase 1: Unseal S3 Link natively
        const resolvedS3Url = await localUnseal(sealedUrl, sealedKey, iv);

        // Phase 2: Follow the resolved link and Fetch Payload from S3
        const finalPayload = await fetchFromS3(resolvedS3Url);

        res.json({
            success: true,
            decryptedData: finalPayload,
            resolvedUrl: resolvedS3Url
        });
    } catch (err) {
        console.error('--- [UNSEAL_GATEWAY_FAILURE] ---', err);
        res.status(500).json({ msg: 'Shielded link resolution failed.', details: err.message });
    }
});

/**
 * @route   GET /api/encrypt/list
 * @desc    Retrieve the audit trail of sealed assets
 */
router.get('/list', async (req, res) => {
    try {
        const assets = await EncryptedData.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, assets: assets });
    } catch (err) {
        console.error('--- [LEDGER_RETRIEVAL_FAILURE] ---', err);
        res.status(500).json({ msg: 'Vault inventory retrieval failed' });
    }
});

module.exports = router;
