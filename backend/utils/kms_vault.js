const { KMSClient, EncryptCommand, DecryptCommand } = require("@aws-sdk/client-kms");
const crypto = require("crypto");
const dotenv = require("dotenv");
const { EncryptedData } = require("../models/index");

dotenv.config({ path: "./config.env" });

// --- CONFIGURE KMS HANDSHAKE ---
const kmsClient = new KMSClient({
    region: process.env.AWS_REGION || "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const KMS_KEY_ID = process.env.KMS_KEY_ID;
const LOCAL_MASTER_KEY = process.env.ENCRYPTION_KEY || "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

/**
 * SEAL PROTOCOL: AES-256 + AWS KMS + RDS
 * 1. Generate local AES key
 * 2. Encrypt payload with AES
 * 3. Seal AES key with AWS KMS
 * 4. Archive in RDS
 */
async function sealAsset(data, type = "message", targetName = "Untitled Asset") {
    try {
        console.log(`--- [INITIATING SEAL PROTOCOL: ${targetName}] ---`);

        // 1. Generate Atomic AES Metadata
        const iv = crypto.randomBytes(16);
        const aesKey = crypto.randomBytes(32);

        // 2. Encrypt Payload (AES-256-CBC)
        const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
        let ciphertext = cipher.update(data, "utf8", "base64");
        ciphertext += cipher.final("base64");

        let sealedKeyBase64;
        let sealMode = "AWS_KMS";

        try {
            // 3. Seal AES Key via AWS KMS Hub
            const command = new EncryptCommand({
                KeyId: KMS_KEY_ID,
                Plaintext: aesKey,
            });
            const response = await kmsClient.send(command);
            sealedKeyBase64 = Buffer.from(response.CiphertextBlob).toString("base64");
        } catch (kmsErr) {
            console.warn("--- [KMS_OFFLINE]: Engaging Emergency Local Vault Seal ---", kmsErr.message);
            // Fallback: Seal AES key with Local Master Hex Key
            const masterBuffer = Buffer.from(LOCAL_MASTER_KEY, "hex");
            const keyCipher = crypto.createCipheriv("aes-256-ecb", masterBuffer, null);
            let fallbackSealed = keyCipher.update(aesKey, null, "base64");
            fallbackSealed += keyCipher.final("base64");
            sealedKeyBase64 = `LOCAL:${fallbackSealed}`;
            sealMode = "LOCAL_EMERGENCY";
        }

        // 4. Archive in RDS Ledger
        const asset = await EncryptedData.create({
            action: type === "file" ? "ENCRYPT_FILE" : "ENCRYPT_MESSAGE",
            target: targetName,
            ciphertext: ciphertext,
            sealedKey: sealedKeyBase64,
            iv: iv.toString("base64"),
            status: sealMode
        });

        return {
            success: true,
            assetId: asset.id,
            mode: sealMode
        };

    } catch (err) {
        console.error("--- [SEAL_PROTOCOL_CRITICAL_FAILURE] ---", err);
        throw err;
    }
}

/**
 * UNSEAL PROTOCOL: RDS + AWS KMS + AES-256
 * 1. Fetch metadata from RDS
 * 2. Unseal AES key via KMS (or Local)
 * 3. Decrypt ciphertext
 */
async function unsealAsset(ciphertext, sealedKey, iv) {
    try {
        console.log("--- [INITIATING UNSEAL PROTOCOL] ---");

        let aesKey;
        if (sealedKey.startsWith("LOCAL:")) {
            // Unseal via Local Master Key
            const encryptedAesKey = Buffer.from(sealedKey.replace("LOCAL:", ""), "base64");
            const masterBuffer = Buffer.from(LOCAL_MASTER_KEY, "hex");
            const keyDecipher = crypto.createDecipheriv("aes-256-ecb", masterBuffer, null);
            let decryptedKey = keyDecipher.update(encryptedAesKey, null, null);
            decryptedKey = Buffer.concat([decryptedKey, keyDecipher.final()]);
            aesKey = decryptedKey;
        } else {
            // Unseal via AWS KMS Hub
            const command = new DecryptCommand({
                CiphertextBlob: Buffer.from(sealedKey, "base64"),
            });
            const response = await kmsClient.send(command);
            aesKey = Buffer.from(response.Plaintext);
        }

        // Decrypt Payload (AES-256-CBC)
        const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, Buffer.from(iv, "base64"));
        let decryptedData = decipher.update(ciphertext, "base64", "utf8");
        decryptedData += decipher.final("utf8");

        return decryptedData;

    } catch (err) {
        console.error("--- [UNSEAL_PROTOCOL_CRITICAL_FAILURE] ---", err);
        throw err;
    }
}

module.exports = { sealAsset, unsealAsset };
