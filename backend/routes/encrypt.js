const express = require('express');
const router = express.Router();
const { EncryptedData } = require('../models/index');
const { uploadToS3, fetchFromS3 } = require('../utils/s3_vault');

const PYTHON_INTERNAL_URL = 'http://securevault-python-core:5002';
const PYTHON_PUBLIC_URL = 'https://securevault-python-core.onrender.com';
const PYTHON_MICROSERVICE_URL = process.env.PYTHON_MICROSERVICE_URL || PYTHON_INTERNAL_URL;

// --- ROBUST FETCH GATEWAY (With Dual-Link Failover) ---
const robustFetch = async (endpoint, options, retries = 2) => {
    // Endpoints: /seal, /unseal, /health
    const urls = [PYTHON_MICROSERVICE_URL, PYTHON_PUBLIC_URL];
    
    for (const baseUrl of urls) {
        const fullUrl = `${baseUrl}${endpoint}`;
        for (let i = 0; i < retries; i++) {
            try {
                console.log(`--- [SENTINEL LINK ATTEMPT]: ${fullUrl} (Try ${i+1}) ---`);
                const res = await fetch(fullUrl, options);
                if (res.ok) return res;
            } catch (err) {
                console.error(`--- [LINK_FAULT]: ${fullUrl} → ${err.message} ---`);
                if (i === retries - 1 && baseUrl === urls[urls.length - 1]) throw err;
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }
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

        // Phase 2: Seal the S3 URL via Python (Envelope Encryption)
        const pyRes = await robustFetch(`${PYTHON_MICROSERVICE_URL}/seal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: s3Url, type: 'url', name })
        });

        const pyData = await pyRes.json();


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

        // Phase 1: Unseal S3 Link via Python
        const pyRes = await robustFetch('/unseal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ciphertext: sealedUrl, sealedKey, iv })
        });


        const pyData = await pyRes.json();


        const resolvedS3Url = pyData.decryptedData;

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
