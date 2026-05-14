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

# --- AGGRESSIVE THREAT PATTERNS ---
MALICIOUS_EXTENSIONS = {'.exe', '.scr', '.vbs', '.bat', '.cmd', '.ps1', '.js', '.wsf', '.hta'}
OFFICE_MACRO_EXTENSIONS = {'.docm', '.xlsm', '.pptm'}

def get_usb_devices():
    psutil = safe_import_psutil()
    if not psutil:
        return []
    devices = []
    for disk in psutil.disk_partitions():
        if 'removable' in disk.opts or disk.fstype == '':
            try:
                usage = psutil.disk_usage(disk.mountpoint)
                devices.append({"mountpoint": disk.mountpoint, "device": disk.device, "total": usage.total})
            except Exception: continue
    return devices

def aggressive_correction(mountpoint):
    file_report = []
    actions_taken = []
    
    for root, dirs, files in os.walk(mountpoint):
        for name in files:
            filepath = os.path.join(root, name)
            lower_name = name.lower()
            ext = os.path.splitext(lower_name)[1]
            
            is_malicious = False
            reason = ""

            # 1. Double Extension Detection (e.g. image.jpg.exe)
            if re.search(r'\.(jpg|png|pdf|docx|txt|xlsx)\.(exe|scr|bat|vbs|cmd)$', lower_name):
                is_malicious = True
                reason = "Double-Extension Malware"

            # 2. Hidden System Files / Autoruns
            elif lower_name in ['autorun.inf', 'desktop.ini', 'thumbs.db'] or lower_name.startswith('~$'):
                is_malicious = True
                reason = "Hidden System/Autorun Hijacker"

            # 3. Risky Scripts in Root
            elif root == mountpoint and ext in MALICIOUS_EXTENSIONS:
                is_malicious = True
                reason = "Suspicious Root-Level Executable"

            # 4. LNK Files (Shortcut Bombs)
            elif ext == '.lnk':
                is_malicious = True
                reason = "Shortcut Bomb / LNK Exploit"

            # --- EXECUTE CORRECTION ---
            if is_malicious:
                try:
                    os.remove(filepath)
                    actions_taken.append(f"NEUTRALIZED: {name} ({reason})")
                    continue
                except Exception as e:
                    actions_taken.append(f"SHIELD_FAILURE: Could not delete {name}")

            # Report safe files
            try:
                stat = os.stat(filepath)
                file_report.append({"name": name, "size": stat.st_size, "extension": ext})
            except Exception: continue
            
    return file_report, actions_taken

def run_sentinel_vanguard():
    print("--- [SENTINEL VANGUARD: EXHAUSTIVE CORRECTION ACTIVE] ---")
    devices = get_usb_devices()
    
    if not devices:
        print("No hardware detected. Connect USB to begin...")
        return

    full_report = {
        "timestamp": time.time(),
        "devices": devices,
        "actions_taken": [],
        "source": "SENTINEL_VANGUARD_LOCAL"
    }

    for usb in devices:
        print(f"Auditing Drive {usb['mountpoint']}...")
        files, actions = aggressive_correction(usb["mountpoint"])
        usb["files"] = files
        full_report["actions_taken"].extend(actions)

    print(f"\n--- FORENSIC SUMMARY ---")
    print(f"Threats Corrected: {len(full_report['actions_taken'])}")
    for action in full_report["actions_taken"]:
        print(f" >> {action}")

    try:
        requests = safe_import_requests()
        if requests:
            requests.post(RENDER_URL, json=full_report, timeout=15)
            print("\nSYNC_SUCCESS: Data pushed to SecureVault Cloud.")
        else:
            print("\nSYNC_ERROR: 'requests' library not found locally.")
    except Exception as e:
        print(f"\nSYNC_ERROR: {e}")

if __name__ == "__main__":
    run_sentinel_vanguard()
    input("\nAudit and Correction complete. Press Enter to exit.")
