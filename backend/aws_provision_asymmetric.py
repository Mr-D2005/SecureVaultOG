import boto3
import os

AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.environ.get("AWS_REGION", "ap-south-1")


try:
    kms = boto3.client(
        'kms',
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )

    response = kms.create_key(
        Description='SecureVault Final Year Asymmetric Master Key',
        KeyUsage='ENCRYPT_DECRYPT',
        CustomerMasterKeySpec='RSA_2048',
        Origin='AWS_KMS'
    )
    
    key_id = response['KeyMetadata']['KeyId']
    
    # Update config.env
    env_path = 'config.env'
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            lines = f.readlines()
        with open(env_path, 'w') as f:
            for line in lines:
                if line.startswith('KMS_KEY_ID='):
                    f.write(f"KMS_KEY_ID={key_id}\n")
                else:
                    f.write(line)
                    
    # Update encryption_core.py inline
    core_path = 'encryption_core.py'
    if os.path.exists(core_path):
        with open(core_path, 'r') as f:
            core_content = f.read()
        
        import re
        updated_content = re.sub(
            r'kms_key_id = os.environ.get\("KMS_KEY_ID", ".*?"\)',
            f'kms_key_id = os.environ.get("KMS_KEY_ID", "{key_id}")',
            core_content
        )
        
        with open(core_path, 'w') as f:
            f.write(updated_content)

    print(f"ASYMMETRIC KEY CREATED AND INJECTED: {key_id}")

except Exception as e:
    print(f"ERROR: {e}")
