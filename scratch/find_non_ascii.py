with open(r"C:\Users\hp\Desktop\SecureVaultOG\backend\sentinel_gui.ps1", "rb") as f:
    content = f.read()

for i, byte in enumerate(content):
    if byte >= 128:
        # Find which line this is
        line_num = content[:i].count(b"\n") + 1
        # Print context
        start = max(0, i - 30)
        end = min(len(content), i + 30)
        print(f"Line {line_num}: Byte {byte} at index {i}. Context: {content[start:end]}")
