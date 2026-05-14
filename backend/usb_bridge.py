import os
import json
import time
import sys

# Try to import psutil, but don't crash if it's missing (Cloud/Render fallback)
HAS_PSUTIL = False
try:
    import psutil
    HAS_PSUTIL = True
except ImportError:
    HAS_PSUTIL = False

def get_usb_devices():
    """
    Scans for removable drives. Uses psutil if available, otherwise basic OS check.
    """
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
                        "used": usage.used,
                        "free": usage.free,
                        "percent": usage.percent
                    })
                except Exception:
                    devices.append({"mountpoint": disk.mountpoint, "device": disk.device, "status": "Inaccessible"})
    else:
        # Fallback for environments without psutil (like Render)
        # We can't really see USBs here, so we return an empty list but NO ERROR.
        pass

    return devices

def scan_files(mountpoint):
    file_report = []
    if not mountpoint or not os.path.exists(mountpoint):
        return file_report
        
    for root, dirs, files in os.walk(mountpoint):
        for name in files:
            filepath = os.path.join(root, name)
            try:
                stat = os.stat(filepath)
                file_report.append({
                    "name": name,
                    "path": filepath,
                    "size": stat.st_size,
                    "extension": os.path.splitext(name)[1].lower()
                })
            except Exception:
                continue
    return file_report

def audit_usb():
    report = {
        "timestamp": time.time(),
        "is_cloud_env": not HAS_PSUTIL,
        "devices": [],
        "audit_logs": ["Sentinel Hardware Bridge Initialized."]
    }
    
    if not HAS_PSUTIL:
        report["audit_logs"].append("WARN: Running in Cloud/Restricted Mode (psutil missing).")
    
    usb_list = get_usb_devices()
    report["devices"] = usb_list
    
    for usb in usb_list:
        if "mountpoint" in usb and usb["mountpoint"]:
            usb["files"] = scan_files(usb["mountpoint"])
            
    return report

if __name__ == "__main__":
    try:
        final_report = audit_usb()
        print(json.dumps(final_report))
    except Exception as e:
        # ABSOLUTE FALLBACK: Return a valid JSON even on total failure
        print(json.dumps({
            "timestamp": time.time(),
            "devices": [],
            "error": str(e),
            "audit_logs": ["CRITICAL: Sentinel Bridge Failure."]
        }))
