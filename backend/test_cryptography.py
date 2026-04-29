import requests
import base64
import json

BASE_URL = "http://localhost:5002"

def test_seal_unseal():
    print("--- [STARTING CRYPTOGRAPHIC HANDSHAKE TEST] ---")
    
    # Payload
    payload = {"msg": "Top Secret Ghost Protocol", "id": 1337}
    print(f">> Payload: {payload}")
    
    # STEP 1: SEAL (ENCRYPT)
    print(">> Action: SEALING ASSET...")
    res = requests.post(f"{BASE_URL}/seal", json={"data": payload})
    
    if res.status_code != 200:
        print(f"!! SEAL FAILURE: {res.text}")
        return
        
    data = res.json()
    ciphertext = data['ciphertext']
    sealed_key = data['sealedKey']
    iv = data['iv']
    
    print(">> Seal Status: SUCCESS")
    print(f">> Sealed Key: {sealed_key[:32]}...")
    
    # STEP 2: UNSEAL (DECRYPT)
    print(">> Action: UNSEALING ASSET...")
    res_dec = requests.post(f"{BASE_URL}/unseal", json={
        "ciphertext": ciphertext,
        "sealedKey": sealed_key,
        "iv": iv
    })
    
    if res_dec.status_code != 200:
        print(f"!! UNSEAL FAILURE: {res_dec.text}")
        return
        
    decrypted_str = res_dec.json()['decryptedData']
    print(f">> Unseal Status: SUCCESS")
    print(f">> Recovered Data: {decrypted_str}")
    
    # Verify
    decoded_data = json.loads(decrypted_str)
    if decoded_data == payload:
        print("--- [VAULT INTEGRITY VERIFIED: RSA+KMS+AES CHAIN SECURE] ---")
    else:
        print("!! INTEGRITY VOID: Data mismatch")

if __name__ == "__main__":
    test_seal_unseal()
