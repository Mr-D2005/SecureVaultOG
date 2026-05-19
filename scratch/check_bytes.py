with open(r"C:\Users\hp\Desktop\SecureVaultOG\backend\sentinel_gui.ps1", "rb") as f:
    content = f.read()

# Let's search for "Cryptographically isolated"
idx = content.find(b"Cryptographically isolated")
if idx != -1:
    print(content[idx:idx+100])
else:
    print("Not found")
