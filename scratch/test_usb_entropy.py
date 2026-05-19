import os
import sys

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from usb_bridge import aggressive_correction, calculate_file_entropy

# Create a temporary directory for testing
test_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'temp_usb_test'))
if not os.path.exists(test_dir):
    os.makedirs(test_dir)

print("--- STARTING USB ENTROPY ANOMALY TESTS ---")

# 1. Create a safe, low entropy document (plain text repeating)
safe_txt_path = os.path.join(test_dir, 'safe_report.txt')
with open(safe_txt_path, 'w') as f:
    f.write("A" * 1000) # Pure repeating character, entropy = 0.0

# 2. Create a mock ransomware file (random/scrambled bytes disguised as a .txt file)
ransomware_txt_path = os.path.join(test_dir, 'ransomware_leak.txt')
with open(ransomware_txt_path, 'wb') as f:
    f.write(os.urandom(2000))

# Print raw calculated entropy directly
print(f"Safe File Calculated Entropy: {calculate_file_entropy(safe_txt_path):.4f}")
print(f"Ransomware File Calculated Entropy: {calculate_file_entropy(ransomware_txt_path):.4f}")

print("[STEP] Running aggressive_correction on temporary USB partition...")
file_report, actions = aggressive_correction(test_dir)

print("\n--- RESULTS ---")
print("Actions Taken:")
for act in actions:
    print(f" - {act}")

print("\nFiles Remaining:")
for f in file_report:
    print(f" - {f['name']} (Ext: {f['extension']})")

# Clean up
if os.path.exists(safe_txt_path):
    os.remove(safe_txt_path)
if os.path.exists(ransomware_txt_path):
    os.remove(ransomware_txt_path)
try:
    os.rmdir(test_dir)
except:
    pass

# Verify results
contains_ransomware_neutralized = any("Entropy Anomaly" in a and "ransomware_leak.txt" in a for a in actions)
safe_file_remained = any(f['name'] == 'safe_report.txt' for f in file_report)

if contains_ransomware_neutralized and safe_file_remained:
    print("\nSUCCESS: ENTROPY DETECTOR TEST PASSED!")
else:
    print("\nFAILURE: TEST FAILED!")
    sys.exit(1)
