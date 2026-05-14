import os
import json
import time
import sys
import re

# --- SAFE IMPORTS ---
def safe_import_requests():
    try:
        import requests
        return requests
    except ImportError:
        return None

def safe_import_psutil():
    try:
        import psutil
        return psutil
    except ImportError:
        return None

# --- CONFIGURATION ---
RENDER_URL = "https://securevault-main.onrender.com/api/usb-lab/external-report"
MALICIOUS_EXTENSIONS = {'.exe', '.scr', '.vbs', '.bat', '.cmd', '.ps1', '.js', '.wsf', '.hta'}

def get_usb_devices():
    psutil = safe_import_psutil()
    if not psutil:
        print("[ERROR] psutil library missing!")
        return []
    
    devices = []
    print("[SYSTEM] Probing all connected drives...")
    
    for disk in psutil.disk_partitions():
        # AGGRESSIVE DETECTION: 
        # Scan anything that isn't the C: drive or a CD-ROM
        if disk.mountpoint.upper() != 'C:\\' and 'cdrom' not in disk.opts:
            try:
                usage = psutil.disk_usage(disk.mountpoint)
                print(f"[FOUND] Drive {disk.mountpoint} ({disk.fstype}) - {round(usage.total / (1024**3))}GB")
                devices.append({
                    "mountpoint": disk.mountpoint, 
                    "device": disk.device, 
                    "total": usage.total,
                    "fstype": disk.fstype
                })
            except Exception as e:
                print(f"[SKIP] Could not access {disk.mountpoint}: {e}")
                continue
    return devices

def aggressive_correction(mountpoint):
    file_report = []
    actions_taken = []
    print(f"[AUDIT] Deep-scanning {mountpoint} for malicious patterns...")
    
    for root, dirs, files in os.walk(mountpoint):
        for name in files:
            filepath = os.path.join(root, name)
            lower_name = name.lower()
            ext = os.path.splitext(lower_name)[1]
            
            is_malicious = False
            reason = ""

            if re.search(r'\.(jpg|png|pdf|docx|txt|xlsx)\.(exe|scr|bat|vbs|cmd)$', lower_name):
                is_malicious = True
                reason = "Double-Extension Malware"
            elif lower_name in ['autorun.inf', 'desktop.ini'] or lower_name.startswith('~$'):
                is_malicious = True
                reason = "Hidden System/Autorun Hijacker"
            elif root == mountpoint and ext in MALICIOUS_EXTENSIONS:
                is_malicious = True
                reason = "Suspicious Root-Level Executable"
            elif ext == '.lnk':
                is_malicious = True
                reason = "Shortcut Bomb / LNK Exploit"

            if is_malicious:
                try:
                    os.remove(filepath)
                    actions_taken.append(f"NEUTRALIZED: {name} ({reason})")
                    continue
                except Exception:
                    actions_taken.append(f"SHIELD_FAILURE: {name}")

            try:
                stat = os.stat(filepath)
                file_report.append({"name": name, "size": stat.st_size, "extension": ext})
            except Exception: continue
            
    return file_report, actions_taken

def run_sentinel_vanguard():
    print("\n" + "="*50)
    print("      SECUREVAULT SENTINEL VANGUARD v5.0")
    print("="*50 + "\n")
    
    devices = get_usb_devices()
    
    if not devices:
        print("[!] NO EXTERNAL DRIVES DETECTED.")
        print("[!] Please plug in your USB and try again.")
        return

    full_report = {
        "timestamp": time.time(),
        "devices": devices,
        "actions_taken": [],
        "source": "SENTINEL_VANGUARD_PC"
    }

    for usb in devices:
        files, actions = aggressive_correction(usb["mountpoint"])
        usb["files"] = files
        full_report["actions_taken"].extend(actions)

    print(f"\n[SUMMARY] Corrected {len(full_report['actions_taken'])} threats.")
    
    try:
        requests = safe_import_requests()
        if requests:
            print("[CLOUD] Syncing to SecureVault Render...")
            r = requests.post(RENDER_URL, json=full_report, timeout=15)
            if r.status_code == 200:
                print("[SUCCESS] Forensic data pushed to Cloud Dashboard.")
            else:
                print(f"[ERROR] Server returned {r.status_code}")
        else:
            print("[ERROR] 'requests' library missing!")
    except Exception as e:
        print(f"[ERROR] Sync Failed: {e}")

if __name__ == "__main__":
    run_sentinel_vanguard()
    print("\n" + "="*50)
    input("Audit Complete. Press Enter to exit.")
