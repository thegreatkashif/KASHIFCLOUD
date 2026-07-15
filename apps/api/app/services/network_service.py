import json
from pathlib import Path

DEVICES_FILE = Path("/network/devices.json")
LAST_SCAN_FILE = Path("/network/last_scan.txt")


def get_devices() -> list[dict]:
    if not DEVICES_FILE.exists():
        return []

    try:
        with open(DEVICES_FILE) as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return []


def get_last_scan() -> str | None:
    if not LAST_SCAN_FILE.exists():
        return None

    try:
        with open(LAST_SCAN_FILE) as f:
            return f.read().strip()
    except OSError:
        return None
