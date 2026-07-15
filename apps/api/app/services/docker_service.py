from app.core.docker_client import get_docker_client


def list_containers() -> list[dict]:
    client = get_docker_client()
    containers = client.containers.list(all=True)

    result = []
    for c in containers:
        stats = None
        cpu_percent = 0.0
        mem_usage = 0
        mem_limit = 0

        if c.status == "running":
            try:
                raw = c.stats(stream=False)
                cpu_delta = (
                    raw["cpu_stats"]["cpu_usage"]["total_usage"]
                    - raw["precpu_stats"]["cpu_usage"]["total_usage"]
                )
                system_delta = (
                    raw["cpu_stats"]["system_cpu_usage"]
                    - raw["precpu_stats"]["system_cpu_usage"]
                )
                num_cpus = raw["cpu_stats"].get("online_cpus", 1)
                if system_delta > 0 and cpu_delta > 0:
                    cpu_percent = (cpu_delta / system_delta) * num_cpus * 100.0

                mem_usage = raw["memory_stats"].get("usage", 0)
                mem_limit = raw["memory_stats"].get("limit", 0)
            except Exception:
                pass

        result.append({
            "id": c.short_id,
            "name": c.name,
            "image": c.image.tags[0] if c.image.tags else c.image.short_id,
            "status": c.status,
            "cpu_percent": round(cpu_percent, 1),
            "memory_usage": mem_usage,
            "memory_limit": mem_limit,
        })

    return result


def get_container_logs(container_id: str, tail: int = 200) -> str:
    client = get_docker_client()
    container = client.containers.get(container_id)
    logs = container.logs(tail=tail, timestamps=True)
    return logs.decode("utf-8", errors="replace")


def start_container(container_id: str) -> None:
    client = get_docker_client()
    client.containers.get(container_id).start()


def stop_container(container_id: str) -> None:
    client = get_docker_client()
    client.containers.get(container_id).stop()


def restart_container(container_id: str) -> None:
    client = get_docker_client()
    client.containers.get(container_id).restart()
