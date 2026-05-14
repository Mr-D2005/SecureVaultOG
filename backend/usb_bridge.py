import os
import json
import time
import sys
import requests

# --- CONFIGURATION ---
# Replace this with your actual Render backend URL
RENDER_URL = "https://securevault-main.onrender.com/api/usb/external-report"

HAS_PSUTIL = False
try:
    import psutil
    HAS_PSUTIL = True
except ImportError:
    print("ERROR: 'psutil' library not found. Run 'pip install psutil' first.")

def get_usb_devices():
    devices = []
    if HAS_PSUTIL:
        for disk in psutil.disk_partitions():
            if 'removable' in disk.opts or disk.fstype == '':
                try:
                    usage = psutil.disk_usage(disk.mountpoint)
                    devices.append({
                        "mountpoint": disk.mountpoint,
                        "device": disk.device,
                        "fstype": disk.fstype,
                        "total": usage.total,
                        "used": usage.used
                    })
                except Exception:
                    continue
    return devices

def scan_files(mountpoint):
    file_report = []
    for root, dirs, files in os.walk(mountpoint):
        for name in files:
            filepath = os.path.join(root, name)
            try:
                stat = os.stat(filepath)
                file_report.append({
                    "name": name,
                    "size": stat.st_size,
                    "extension": os.path.splitext(name)[1].lower()
                })
            except Exception: continue
        if len(file_report) > 50: break # Limit for speed
    return file_report

def run_local_sentinel():
    print("--- [SENTINEL LOCAL BRIDGE ACTIVE] ---")
    print("Scanning hardware...")
    
    report = {
        "timestamp": time.time(),
        "devices": get_usb_devices(),
        "source": "LOCAL_HARDWARE_BRIDGE"
    }
    
    for usb in report["devices"]:
        usb["files"] = scan_files(usb["mountpoint"])

    print(f"Found {len(report['devices'])} device(s). Pushing to SecureVault Cloud...")
    
    try:
        response = requests.post(RENDER_URL, json=report, timeout=10)
        if response.status_code == 200:
            print("SUCCESS: Forensic data synced to Render!")
        else:
            print(f"FAILED: Server returned {response.status_code}")
    except Exception as e:
        print(f"CONNECTION_ERROR: Could not reach Render. {e}")

if __name__ == "__main__":
    run_local_sentinel()
    input("\nPress Enter to close...")
