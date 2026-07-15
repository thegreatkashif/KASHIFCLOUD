import psutil


def get_system_stats() -> dict:
    cpu_percent = psutil.cpu_percent(interval=None)
    cpu_per_core = psutil.cpu_percent(interval=None, percpu=True)

    mem = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    net = psutil.net_io_counters()

    try:
        temps = psutil.sensors_temperatures()
        cpu_temp = None
        for entries in temps.values():
            if entries:
                cpu_temp = entries[0].current
                break
    except Exception:
        cpu_temp = None

    return {
        "cpu": {
            "percent": cpu_percent,
            "per_core": cpu_per_core,
            "temp_celsius": cpu_temp,
        },
        "memory": {
            "total": mem.total,
            "used": mem.used,
            "percent": mem.percent,
        },
        "disk": {
            "total": disk.total,
            "used": disk.used,
            "percent": disk.percent,
        },
        "network": {
            "bytes_sent": net.bytes_sent,
            "bytes_recv": net.bytes_recv,
        },
    }
