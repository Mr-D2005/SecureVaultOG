import boto3
import json
import os

AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.environ.get("AWS_REGION", "eu-north-1")


print("--- [INITIALIZING SECUREVAULT AWS INFRASTRUCTURE] ---")

try:
    # 1. Initialize boto3 KMS client
    kms = boto3.client(
        'kms',
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )

    # 2. Provision New Symmetric Encryption Key
    print("[1/2] Provisioning new AWS KMS Envelope Encryption Key...")
    response = kms.create_key(
        Description='SecureVault Final Year Master Key',
        KeyUsage='ENCRYPT_DECRYPT',
        Origin='AWS_KMS'
    )
    
    key_id = response['KeyMetadata']['KeyId']
    print(f"      -> SUCCESS: Created KMS Key [{key_id}]")

    # 3. Create an alias for easy identification
    try:
        kms.create_alias(
            AliasName='alias/SecureVaultMaster',
            TargetKeyId=key_id
        )
    except Exception as alias_e:
        pass # Alias might already exist or permission issue

    # 4. Update the config.env file automatically
    print("[2/2] Injecting new AWS credentials and Key ID into config.env...")
    env_path = 'config.env'
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            lines = f.readlines()
        
        with open(env_path, 'w') as f:
            for line in lines:
                if line.startswith('AWS_ACCESS_KEY_ID='):
                    f.write(f"AWS_ACCESS_KEY_ID={AWS_ACCESS_KEY_ID}\n")
                elif line.startswith('AWS_SECRET_ACCESS_KEY='):
                    f.write(f"AWS_SECRET_ACCESS_KEY={AWS_SECRET_ACCESS_KEY}\n")
                elif line.startswith('AWS_REGION='):
                    f.write(f"AWS_REGION={AWS_REGION}\n")
                elif line.startswith('KMS_KEY_ID='):
                    f.write(f"KMS_KEY_ID={key_id}\n")
                else:
                    f.write(line)
        print("      -> SUCCESS: Env file synced.")
    else:
        print("      -> ERROR: config.env not found.")

    print("\n--- [AWS INFRASTRUCTURE DEPLOYMENT COMPLETE] ---")
    print(f"NEW_KMS_KEY={key_id}")

except Exception as e:
    print(f"--- [AWS DEPLOYMENT FAILED] ---")
    print(f"Details: {str(e)}")
