import os
import psutil
import json
import hashlib
import time
import sys

def get_usb_devices():
    """
    Scans for removable drives and extracts metadata.
    """
    devices = []
    for disk in psutil.disk_partitions():
        if 'removable' in disk.opts or disk.fstype == '':
            try:
                usage = psutil.disk_usage(disk.mountpoint)
                devices.append({
                    "mountpoint": disk.mountpoint,
                    "device": disk.device,
                    "fstype": disk.fstype,
                    "total": usage.total,
                    "used": usage.used,
                    "free": usage.free,
                    "percent": usage.percent
                })
            except Exception:
                # Handle cases where drive is plugged in but not accessible
                devices.append({
                    "mountpoint": disk.mountpoint,
                    "device": disk.device,
                    "status": "Inaccessible/Protected"
                })
    return devices

def scan_files(mountpoint):
    """
    Performs a deep scan of the filesystem for the agents.
    """
    file_report = []
    for root, dirs, files in os.walk(mountpoint):
        for name in files:
            filepath = os.path.join(root, name)
            try:
                stat = os.stat(filepath)
                # Check for hidden files (Windows-specific attribute check)
                is_hidden = False
                if sys.platform == 'win32':
                    try:
                        import ctypes
                        attrs = ctypes.windll.kernel32.GetFileAttributesW(filepath)
                        is_hidden = bool(attrs & 2)
                    except Exception:
                        is_hidden = False

                file_report.append({
                    "name": name,
                    "path": filepath,
                    "size": stat.st_size,
                    "extension": os.path.splitext(name)[1].lower(),
                    "is_hidden": is_hidden or name.startswith('.'),
                    "modified": time.ctime(stat.st_mtime)
                })
            except Exception:
                continue
    return file_report

def audit_usb():
    """
    Main entry point for the Sentinel Audit.
    """
    report = {
        "timestamp": time.time(),
        "devices": [],
        "audit_logs": []
    }
    
    usb_list = get_usb_devices()
    report["devices"] = usb_list
    
    for usb in usb_list:
        if "mountpoint" in usb and usb["mountpoint"]:
            report["audit_logs"].append(f"Scanning mountpoint: {usb['mountpoint']}")
            usb["files"] = scan_files(usb["mountpoint"])
            
    return report

if __name__ == "__main__":
    # If run directly, output JSON for the Node.js backend to consume
    try:
        final_report = audit_usb()
        print(json.dumps(final_report))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
