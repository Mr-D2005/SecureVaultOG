const express = require('express');
const router = express.Router();
const { injectPayload, extractPayload, analyzeSteganographyAI, attemptThirdPartyExtraction } = require('../utils/stego');
const { EncryptedData } = require('../models/index');

/**
 * @route   POST /api/stego/inject
 * @desc    Deep bind a secret text or file payload into ANY media file using raw base64 JSON
 */
router.post('/inject', async (req, res) => {
    try {
        const { carrierBase64, carrierMime, carrierName, payloadBase64, payloadName, payloadText, password } = req.body;

        if (!carrierBase64) return res.status(400).json({ msg: 'No carrier media detected.' });
        if (!payloadBase64 && !payloadText) return res.status(400).json({ msg: 'No secret payload detected.' });

        // Convert Base64 back to Buffer
        const carrierBuffer = Buffer.from(carrierBase64.split(',')[1] || carrierBase64, 'base64');
        
        let payloadBuffer;
        if (payloadBase64) {
            // File Payload
            const fileData = Buffer.from(payloadBase64.split(',')[1] || payloadBase64, 'base64');
            const meta = Buffer.from(`FILE:${payloadName}|`, 'utf-8');
            payloadBuffer = Buffer.concat([meta, fileData]);
        } else {
            // Text Payload
            const meta = Buffer.from(`TEXT:|`, 'utf-8');
            payloadBuffer = Buffer.concat([meta, Buffer.from(payloadText, 'utf-8')]);
        }

        // Execute Deep Bind
        const finalBuffer = await injectPayload(carrierBuffer, payloadBuffer, password);

        // --- Log Activity (Non-blocking) ---
        EncryptedData.create({
            action: 'STEGO_INJECT',
            target: carrierName || 'Media Carrier',
            status: 'VERIFIED'
        }).catch(err => console.error('Logging failed:', err.message));


        // Send back the modified media directly for download
        res.set({
            'Content-Type': carrierMime || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="secured_${carrierName || 'stego.mp4'}"`,
        });
        
        res.send(finalBuffer);
    } catch (err) {
        console.error('--- [STEGO INJECTION FAULT] ---', err);
        res.status(500).json({ msg: 'Stego binding failed', details: err.message });
    }
});

/**
 * @route   POST /api/stego/extract
 * @desc    Extract a deep-bound payload from a secured media file simulating AI Steganalysis
 */
router.post('/extract', async (req, res) => {
    try {
        const { carrierBase64, carrierName } = req.body;

        if (!carrierBase64) return res.status(400).json({ msg: 'No media file detected.' });

        const carrierBuffer = Buffer.from(carrierBase64.split(',')[1] || carrierBase64, 'base64');

        // 1. Run AI Steganalysis Forensic Engine
        const aiAnalysis = analyzeSteganographyAI(carrierBuffer, carrierName);

        if (!aiAnalysis.isSVStego && !aiAnalysis.isThirdPartyStego) {
            return res.json({ success: true, stegoSource: 'clean', aiAnalysis });
        }

        // 2. Handle Third-Party or Foreign Stego
        if (aiAnalysis.isThirdPartyStego && !aiAnalysis.isSVStego) {
            const foreignPayload = attemptThirdPartyExtraction(carrierBuffer, aiAnalysis);
            
            return res.json({ 
                success: true, 
                stegoSource: 'third-party', 
                aiAnalysis,
                confidence: aiAnalysis.confidence,
                heuristics: aiAnalysis.heuristics,
                detectedAlgorithm: aiAnalysis.detectedAlgorithm,
                type: foreignPayload ? foreignPayload.type : 'locked',
                data: foreignPayload ? foreignPayload.data : null,
                method: foreignPayload ? foreignPayload.method : 'ENCRYPTED_UNKNOWN'
            });
        }

        // 3. Execute SecureVault Deep-Bind Extraction (SV Format)
        const keysToTry = ['sv_default', 'sv_default_stego_key'];
        let decryptedPayload = null;

        for (const key of keysToTry) {
            try {
                decryptedPayload = await extractPayload(carrierBuffer, key);
                break;
            } catch (e) {
                // Try next key
            }
        }

        // If SV signature found but decryption fails
        if (!decryptedPayload) {
            return res.json({
                success: true,
                stegoSource: 'securevault',
                aiAnalysis,
                confidence: aiAnalysis.confidence,
                heuristics: aiAnalysis.heuristics,
                detectedAlgorithm: aiAnalysis.detectedAlgorithm,
                type: 'locked',
                data: null
            });
        }

        // 4. Parse Metadata Header (FILE:name| OR TEXT:|)
        const payloadString = decryptedPayload.toString('utf-8');
        const sepIdx = payloadString.indexOf('|');
        if (sepIdx === -1) throw new Error("Metadata header corrupted.");

        const meta = payloadString.substring(0, sepIdx);
        const rawDataBuffer = decryptedPayload.subarray(sepIdx + 1);

        // --- Log Activity (Non-blocking) ---
        EncryptedData.create({
            action: 'STEGO_EXTRACT',
            target: carrierName || 'Forensic Target',
            status: aiAnalysis.isSVStego ? 'Active' : 'Flagged'
        }).catch(err => console.error('Logging failed:', err.message));


        if (meta.startsWith('FILE:')) {
            res.json({
                success: true,
                stegoSource: 'securevault',
                aiAnalysis,
                confidence: aiAnalysis.confidence,
                heuristics: aiAnalysis.heuristics,
                detectedAlgorithm: aiAnalysis.detectedAlgorithm,
                type: 'file',
                name: meta.replace('FILE:', ''),
                data: rawDataBuffer.toString('base64')
            });
        } else {
            res.json({
                success: true,
                stegoSource: 'securevault',
                aiAnalysis,
                confidence: aiAnalysis.confidence,
                heuristics: aiAnalysis.heuristics,
                detectedAlgorithm: aiAnalysis.detectedAlgorithm,
                type: 'text',
                data: rawDataBuffer.toString('utf-8')
            });
        }

    } catch (err) {
        console.error('--- [STEGO EXTRACTION FAULT] ---', err);
        res.status(400).json({ msg: 'Extraction failed: Clean media or invalid passkey', details: err.message });
    }
});

/**
 * @route   POST /api/stego/detect
 * @desc    Perform AI Steganalysis on a media file (Base64)
 */
router.post('/detect', async (req, res) => {
    try {
        const { imageBase64, name } = req.body;
        if (!imageBase64) return res.status(400).json({ msg: 'No media payload detected' });

        const buffer = Buffer.from(imageBase64.split(',')[1] || imageBase64, 'base64');
        const aiAnalysis = analyzeSteganographyAI(buffer, name || 'Forensic Scan');

        res.json({
            success: true,
            hasStego: aiAnalysis.isSVStego || aiAnalysis.isThirdPartyStego,
            confidence: aiAnalysis.confidence,
            heuristics: aiAnalysis.heuristics,
            aiAnalysis
        });
    } catch (err) {
        console.error('--- [STEGO DETECTION FAULT] ---', err);
        res.status(500).json({ msg: 'Stego detection failed', error: err.message });
    }
});


module.exports = router;
