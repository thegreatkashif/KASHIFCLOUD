import json
import shutil
from datetime import datetime
from pathlib import Path

from app.core.docker_client import get_docker_client
from app.core.storage_roots import STORAGE_ROOTS


def run_backup(config: dict) -> str:
    """
    config: {"source_root": "nas", "source_path": "photos", "dest_root": "local", "dest_path": "backups"}
    Copies a folder from one storage root to another, timestamped.
    """
    source_root = config["source_root"]
    source_path = config.get("source_path", "")
    dest_root = config["dest_root"]
    dest_path = config.get("dest_path", "backups")

    if source_root not in STORAGE_ROOTS or dest_root not in STORAGE_ROOTS:
        raise ValueError("Invalid storage root in backup config")

    src = Path(STORAGE_ROOTS[source_root]) / source_path
    if not src.exists():
        raise ValueError(f"Source path does not exist: {src}")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    dest_base = Path(STORAGE_ROOTS[dest_root]) / dest_path
    dest_base.mkdir(parents=True, exist_ok=True)
    dest = dest_base / f"{src.name}_{timestamp}"

    if src.is_dir():
        shutil.copytree(src, dest)
    else:
        shutil.copy2(src, dest)

    return f"Backed up {src} to {dest}"


def run_restart_on_failure(config: dict) -> str:
    """
    config: {"container_name": "homepage"}
    Checks if a container is running; restarts it if not.
    """
    container_name = config["container_name"]
    client = get_docker_client()

    try:
        container = client.containers.get(container_name)
    except Exception:
        raise ValueError(f"Container not found: {container_name}")

    if container.status != "running":
        container.restart()
        return f"{container_name} was {container.status}, restarted it"

    return f"{container_name} is running, no action needed"


def run_container_action(config: dict) -> str:
    """
    config: {"container_name": "homepage", "action": "restart"}
    Unconditionally runs a Docker action on a schedule (e.g. nightly restart).
    """
    container_name = config["container_name"]
    action = config["action"]
    client = get_docker_client()

    container = client.containers.get(container_name)

    if action == "start":
        container.start()
    elif action == "stop":
        container.stop()
    elif action == "restart":
        container.restart()
    else:
        raise ValueError(f"Unknown action: {action}")

    return f"{action} executed on {container_name}"


EXECUTORS = {
    "backup": run_backup,
    "restart_on_failure": run_restart_on_failure,
    "container_action": run_container_action,
}


def execute_job(job_type: str, config_json: str) -> str:
    if job_type not in EXECUTORS:
        raise ValueError(f"Unknown job type: {job_type}")

    config = json.loads(config_json)
    return EXECUTORS[job_type](config)
