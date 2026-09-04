const express = require('express');
const router = express.Router();
const { injectPayload, extractPayload, analyzeSteganographyAI, attemptThirdPartyExtraction } = require('../utils/stego');
const { EncryptedData } = require('../models/index');

const generateAIForensicReport = async (aiAnalysis, carrierName) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return `Offline Heuristic Mode: Potential steganographic signature detected for ${carrierName} matching ${aiAnalysis.detectedAlgorithm}. Entropy matches data pattern signature ${aiAnalysis.heuristics.entropy}. LSB variance calculated at ${aiAnalysis.heuristics.variance}.`;
    }

    try {
        const prompt = `
            You are the Ravan AI Forensic Engine. Analyze the following steganography telemetry metrics for the file "${carrierName}":
            - Detected Algorithm/Signature: ${aiAnalysis.detectedAlgorithm}
            - Confidence Level: ${aiAnalysis.confidence}%
            - Scanned Layers Matching: ${aiAnalysis.detectionMethods.join(', ')}
            - Shannon Entropy Score: ${aiAnalysis.heuristics.entropy} (Standard clean threshold: ~7.0-7.5, high stego: >7.9)
            - LSB Variance Deviation: ${aiAnalysis.heuristics.variance} (Close to 0 indicates high randomization)
            
            Based on these stats, write a concise, premium 2-3 sentence forensic explanation highlighting the signature threat, how it hides data, and why the engine flagged it. Use professional, clinical cybersecurity terminology. Make it feel highly advanced and expert.
        `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: 'You are a cybersecurity forensics expert agent. Return ONLY the 2-3 sentence explanation text. No introductions, no signatures.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.5,
                max_tokens: 150
            }),
            signal: AbortSignal.timeout(6000)
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || "AI Forensics failed to generate explanation. Local heuristics verify payload presence.";
    } catch (e) {
        console.error("AI Forensic Report Error:", e.message);
        return `Heuristic Engine Verdict: Steganography detected. Entropy: ${aiAnalysis.heuristics.entropy}. LSB Variance: ${aiAnalysis.heuristics.variance}. The file metadata and headers deviate from standard baseline specifications.`;
    }
};

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

        if (aiAnalysis.isSVStego || aiAnalysis.isThirdPartyStego) {
            aiAnalysis.aiExplanation = await generateAIForensicReport(aiAnalysis, carrierName || 'Forensic Target');
        }

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

        // 3. Execute NetraVault Deep-Bind Extraction (SV Format)
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
                stegoSource: 'netravault',
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
                stegoSource: 'netravault',
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
                stegoSource: 'netravault',
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

        if (aiAnalysis.isSVStego || aiAnalysis.isThirdPartyStego) {
            aiAnalysis.aiExplanation = await generateAIForensicReport(aiAnalysis, name || 'Forensic Scan');
        }

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
