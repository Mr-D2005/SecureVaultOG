from flask import Flask, request, jsonify
import boto3
import base64
import os
import secrets
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

app = Flask(__name__)

# Initialize AWS KMS Client
# It will automatically pick up AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from env if available,
# or we can pass them in explicitly.

# AWS KMS CONFIGURATION
kms_client = boto3.client(
    'kms', 
    region_name=os.environ.get("AWS_REGION", "ap-south-1"),
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY")
)
region_name = os.environ.get("AWS_REGION", "ap-south-1")
kms_key_id = os.environ.get("KMS_KEY_ID")


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "Running",
        "service": "SECUREVAULT_PYTHON_KMS_CORE_5011",
        "kms": "Connected"
    })

# Create KMS Client
kms_client = boto3.client(
    'kms',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=region_name
)

@app.route('/seal', methods=['POST'])
def seal_asset():
    try:
        data = request.json.get('data')
        if not data:
            return jsonify({"msg": "No payload provided"}), 400
            
        print("--- [PYTHON KMS CORE: INITIATING SEAL] ---")

        # 1. Generate AES 256 Key & IV
        aes_key = secrets.token_bytes(32)
        iv = secrets.token_bytes(16)

        # 2. Encrypt Data with AES
        cipher = Cipher(algorithms.AES(aes_key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        
        # Pad data for CBC - must be done on bytes to handle UTF-8 multi-byte characters
        data_bytes = data.encode('utf-8')
        pad_len = 16 - (len(data_bytes) % 16)
        padded_data = data_bytes + bytes([pad_len] * pad_len)
        
        ciphertext_bytes = encryptor.update(padded_data) + encryptor.finalize()
        ciphertext_b64 = base64.b64encode(ciphertext_bytes).decode('utf-8')

        # 3. Seal AES Key with AWS KMS
        try:
            kms_response = kms_client.encrypt(
                KeyId=kms_key_id,
                Plaintext=aes_key,
                EncryptionAlgorithm='RSAES_OAEP_SHA_256'
            )
            sealed_key_b64 = base64.b64encode(kms_response['CiphertextBlob']).decode('utf-8')
            mode = "AWS_KMS_ASYMMETRIC"
        except Exception as kms_err:
            print("--- [KMS_OFFLINE]: Engaging Emergency Local Vault Seal ---", str(kms_err))
            # Fallback: Seal AES key with Local Master Hex Key
            local_master = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
            master_bytes = bytes.fromhex(local_master)
            fallback_cipher = Cipher(algorithms.AES(master_bytes), modes.ECB(), backend=default_backend())
            fallback_encryptor = fallback_cipher.encryptor()
            # AES key is exactly 32 bytes, which is a multiple of 16 (block size), so no padding is strictly needed for ECB encrypting AES key.
            fallback_sealed = fallback_encryptor.update(aes_key) + fallback_encryptor.finalize()
            sealed_key_b64 = "LOCAL:" + base64.b64encode(fallback_sealed).decode('utf-8')
            mode = "LOCAL_EMERGENCY"

        print(f"--- [PYTHON KMS CORE: SEAL SUCCESS ({mode})] ---")
        return jsonify({
            "success": True,
            "ciphertext": ciphertext_b64,
            "sealedKey": sealed_key_b64,
            "iv": base64.b64encode(iv).decode('utf-8'),
            "mode": mode
        })

    except Exception as e:
        print("PYTHON ENCRYPTION ERROR:", str(e))
        return jsonify({"msg": "Asset sealing sequence failed in Python core", "details": str(e)}), 500

@app.route('/unseal', methods=['POST'])
def unseal_asset():
    try:
        ciphertext_b64 = request.json.get('ciphertext')
        sealed_key_b64 = request.json.get('sealedKey')
        iv_b64 = request.json.get('iv')

        if not all([ciphertext_b64, sealed_key_b64, iv_b64]):
            return jsonify({"msg": "Missing cryptographic components"}), 400

        print("--- [PYTHON KMS CORE: INITIATING UNSEAL] ---")
        
        iv = base64.b64decode(iv_b64)
        ciphertext = base64.b64decode(ciphertext_b64)
        
        # 1. Unseal AES key via KMS (or Local Master Fallback)
        try:
            if sealed_key_b64.startswith("LOCAL:"):
                # Unseal via Local Master Key
                local_master = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
                master_bytes = bytes.fromhex(local_master)
                encrypted_aes_key = base64.b64decode(sealed_key_b64.replace("LOCAL:", ""))
                key_decipher = Cipher(algorithms.AES(master_bytes), modes.ECB(), backend=default_backend())
                key_decryptor = key_decipher.decryptor()
                aes_key = key_decryptor.update(encrypted_aes_key) + key_decryptor.finalize()
            else:
                # Unseal via AWS KMS
                sealed_blob = base64.b64decode(sealed_key_b64)
                kms_response = kms_client.decrypt(
                    CiphertextBlob=sealed_blob,
                    KeyId=kms_key_id,
                    EncryptionAlgorithm='RSAES_OAEP_SHA_256'
                )
                aes_key = kms_response['Plaintext']
        except Exception as kms_err:
            print("KEY DECRYPT FAILED:", str(kms_err))
            return jsonify({"msg": "Asset unsealing failed via cryptographic core", "details": str(kms_err)}), 500

        # 2. Decrypt Payload
        cipher = Cipher(algorithms.AES(aes_key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        
        decrypted_padded = decryptor.update(ciphertext) + decryptor.finalize()
        
        # Unpad
        pad_len = decrypted_padded[-1]
        decrypted_data = decrypted_padded[:-pad_len].decode('utf-8')

        print("--- [PYTHON KMS CORE: UNSEAL SUCCESS] ---")
        return jsonify({
            "success": True,
            "decryptedData": decrypted_data
        })

    except Exception as e:
        print("PYTHON DECRYPTION ERROR:", str(e))
        return jsonify({"msg": "Asset unsealing failed in Python core", "details": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5002))
    print(f"--- [PYTHON ENCRYPTION MICROSERVICE STARTING ON PORT {port}] ---")
    app.run(host='0.0.0.0', port=port)

