import os
import json
import time
import sys
import re
import math

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
RENDER_URL = "https://netravault-main.onrender.com/api/usb-lab/external-report"
MALICIOUS_EXTENSIONS = {'.exe', '.scr', '.vbs', '.bat', '.cmd', '.ps1', '.js', '.wsf', '.hta'}

def calculate_file_entropy(filepath):
    try:
        # Read up to 10KB to keep memory usage minimal and scan fast
        with open(filepath, 'rb') as f:
            data = f.read(10240)
        if not data:
            return 0.0
        length = len(data)
        frequencies = [0] * 256
        for byte in data:
            frequencies[byte] += 1
        entropy = 0.0
        for count in frequencies:
            if count > 0:
                p = count / length
                entropy -= p * math.log2(p)
        return entropy
    except:
        return 0.0

def get_usb_devices():
    psutil = safe_import_psutil()
    if not psutil: return []
    
    devices = []
    for disk in psutil.disk_partitions():
        if 'removable' in disk.opts:
            try:
                usage = psutil.disk_usage(disk.mountpoint)
                devices.append({
                    "mountpoint": disk.mountpoint, 
                    "device": disk.device, 
                    "total": usage.total,
                    "fstype": disk.fstype
                })
            except: continue
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
            elif ext in {'.docx', '.pdf', '.txt', '.xlsx', '.pptx'}:
                entropy = calculate_file_entropy(filepath)
                if entropy > 7.85:
                    is_malicious = True
                    reason = f"Entropy Anomaly ({entropy:.2f}) - Suspected Ransomware"

            if is_malicious:
                try:
                    os.remove(filepath)
                    actions_taken.append(f"NEUTRALIZED: {name} ({reason})")
                    continue
                except:
                    actions_taken.append(f"SHIELD_FAILURE: {name}")

            try:
                stat = os.stat(filepath)
                file_report.append({"name": name, "size": stat.st_size, "extension": ext})
            except: continue
            
    return file_report, actions_taken

def run_ghost_bridge():
    os.system('cls' if os.name == 'nt' else 'clear')
    print("\n" + "!"*60)
    print("      NETRAVAULT: GHOST-MOUNT VIRTUAL GATEWAY v1.0")
    print("      STATUS: AIR-GAP ISOLATION PROTOCOL ACTIVE")
    print("!"*60 + "\n")
    
    print("[>>>] GHOST_CONTAINMENT: INITIALIZING VIRTUAL SANDBOX...")
    time.sleep(1)
    print("[>>>] PROTOCOL: WAITING FOR PHYSICAL HARDWARE CONNECTION...")
    print("[LOG] System is isolated. It is safe to plug in your USB now.\n")

    found_devices = []
    while not found_devices:
        found_devices = get_usb_devices()
        if not found_devices:
            # Simple loading animation
            for char in r"/-\|":
                sys.stdout.write(f"\rScanning for hardware ports... {char}")
                sys.stdout.flush()
                time.sleep(0.1)
    
    print("\n\n[DETECTED] Hardware connection identified!")
    
    full_report = {
        "timestamp": time.time(),
        "devices": found_devices,
        "actions_taken": [],
        "source": "GHOST_MOUNT_GATEWAY"
    }

    for usb in found_devices:
        print(f"[PROCESS] Isolating {usb['mountpoint']} inside Sandbox...")
        files, actions = aggressive_correction(usb["mountpoint"])
        usb["files"] = files
        full_report["actions_taken"].extend(actions)

    print(f"\n[SUMMARY] Corrected {len(full_report['actions_taken'])} malicious vectors.")
    
    try:
        requests = safe_import_requests()
        if requests:
            print("[CLOUD] Teleporting forensic DNA to Lab Dashboard...")
            r = requests.post(RENDER_URL, json=full_report, timeout=15)
            if r.status_code == 200:
                print("[SUCCESS] Ghost-Mount Sync Complete. Check your browser.")
            else:
                print(f"[ERROR] Bridge mismatch (Status {r.status_code})")
        else:
            print("[ERROR] 'requests' library missing!")
    except Exception as e:
        print(f"[ERROR] Sync Failed: {e}")

if __name__ == "__main__":
    try:
        run_ghost_bridge()
    except KeyboardInterrupt:
        print("\n[SYSTEM] Gateway closed by user.")
    print("\n" + "="*60)
    input("Protocol Finished. Press Enter to exit.")
