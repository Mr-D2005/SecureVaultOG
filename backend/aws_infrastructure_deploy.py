import boto3
import time
import os
import uuid

# Auto-Loaded User Credentials
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.environ.get("AWS_REGION", "ap-south-1")


print("=========================================================")
print("  ♦ SECUREVAULT - AWS DEVOPS INFRASTRUCTURE PIPELINE ♦ ")
print("=========================================================")

session = boto3.Session(
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

try:
    # 1. IAM ROLE / USER 
    print("[1/5] Verifying IAM Status...")
    iam = session.client('iam')
    user = iam.get_user()['User']['UserName']
    print(f"      -> SUCCESS: Authenticated successfully as IAM Identity: '{user}'")

    # 2. KMS (ASYMMETRIC)
    print("\n[2/5] Provisioning AWS KMS Asymmetric RSA_2048 Master Key...")
    kms = session.client('kms')
    kms_resp = kms.create_key(
        Description='SecureVault Final Year Asymmetric Master Key',
        KeyUsage='ENCRYPT_DECRYPT',
        CustomerMasterKeySpec='RSA_2048',
        Origin='AWS_KMS'
    )
    key_id = kms_resp['KeyMetadata']['KeyId']
    print(f"      -> SUCCESS: New KMS Key ID: {key_id}")

    # 3. S3 BUCKET
    print("\n[3/5] Provisioning AWS S3 Blacksite Storage...")
    s3 = session.client('s3')
    bucket_name = f"securevault-blacksite-{uuid.uuid4().hex[:8]}"
    s3.create_bucket(Bucket=bucket_name, CreateBucketConfiguration={'LocationConstraint': AWS_REGION})
    print(f"      -> SUCCESS: New S3 Bucket Created: {bucket_name}")

    # 4. EC2 Security Group for RDS Access
    print("\n[4/5] Establishing Cyber-Firewall Rules (VPC Ingress)...")
    ec2 = session.client('ec2')
    vpc_response = ec2.describe_vpcs(Filters=[{'Name': 'isDefault', 'Values': ['true']}])
    vpc_id = vpc_response['Vpcs'][0]['VpcId']

    sg_name = f"securevault-sg-{uuid.uuid4().hex[:4]}"
    sg_desc = "Allow MySQL Port 3306 for SecureVault Architecture"
    sg_resp = ec2.create_security_group(GroupName=sg_name, Description=sg_desc, VpcId=vpc_id)
    sg_id = sg_resp['GroupId']

    ec2.authorize_security_group_ingress(
        GroupId=sg_id,
        IpPermissions=[{'IpProtocol': 'tcp', 'FromPort': 3306, 'ToPort': 3306, 'IpRanges': [{'CidrIp': '0.0.0.0/0'}]}]
    )
    print(f"      -> SUCCESS: Security Group Created (Port 3306 Opened to Public) -> {sg_id}")

    # 5. RDS DATABASE
    print("\n[5/5] Provisioning AWS RDS MySQL Core Ledger...")
    rds = session.client('rds')
    db_identifier = f"securevault-db-{uuid.uuid4().hex[:4]}"
    db_password = "SecureVault123!"
    db_username = "svadmin"

    rds.create_db_instance(
        DBName='securevault',
        DBInstanceIdentifier=db_identifier,
        AllocatedStorage=20,
        DBInstanceClass='db.t3.micro',  # Free tier eligible performance instance
        Engine='mysql',
        MasterUsername=db_username,
        MasterUserPassword=db_password,
        VpcSecurityGroupIds=[sg_id],
        PubliclyAccessible=True,
        SkipFinalSnapshot=True
    )
    print("      -> DB Instance Initialized! Connecting to Amazon Cloud servers...")
    print("\n      [⌛] ATTENTION: AWS requires 10-15 minutes to fully boot a new RDS Database Datacenter.")
    print("      [⌛] Please DO NOT CLOSE this terminal... polling AWS every 30 seconds for availability.")
    
    waiter = rds.get_waiter('db_instance_available')
    waiter.wait(DBInstanceIdentifier=db_identifier, WaiterConfig={'Delay': 30, 'MaxAttempts': 100})
    
    desc = rds.describe_db_instances(DBInstanceIdentifier=db_identifier)
    endpoint = desc['DBInstances'][0]['Endpoint']['Address']
    port = desc['DBInstances'][0]['Endpoint']['Port']
    print(f"\n      -> SUCCESS: RDS Engine Online @ {endpoint}:{port}")

    # Wrap up Env Variables
    print("\n=========================================================")
    print(" [SYSTEM] OVERWRITING LOCAL ENVIRONMENT VARIABLES ")
    print("=========================================================")
    
    db_url = f"mysql://{db_username}:{db_password}@{endpoint}:{port}/securevault"
    
    env_content = f"""PORT=5001

# DATABASE
DATABASE_URL="{db_url}"

# CLOUD ASSET SEALING ARCHITECTURE
AWS_ACCESS_KEY_ID={AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY={AWS_SECRET_ACCESS_KEY}
AWS_REGION={AWS_REGION}
KMS_KEY_ID={key_id}
AWS_S3_BUCKET={bucket_name}
"""
    with open("config.env", "w") as f:
        f.write(env_content)
        
    print(" -> SUCCESS: config.env updated internally.")
    print(" -> ALL CLOUD DEPLOYMENTS COMPLETE. THE VAULT IS LOCKED AND LOADED. 🚀")
    
except Exception as e:
    print(f"\n[CRITICAL DEPLOYMENT FAILURE] -> {e}")

print("\nPress any key to exit...")
os.system("pause")
