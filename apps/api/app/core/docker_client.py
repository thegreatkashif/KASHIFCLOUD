import docker
from functools import lru_cache


@lru_cache
def get_docker_client() -> docker.DockerClient:
    return docker.from_env()
