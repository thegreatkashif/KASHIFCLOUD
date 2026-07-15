from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_current_user
from app.models.user import User
from app.services import docker_service

router = APIRouter(prefix="/docker", tags=["docker"])


@router.get("/containers")
def list_containers(current_user: User = Depends(get_current_user)):
    return docker_service.list_containers()


@router.get("/containers/{container_id}/logs")
def container_logs(
    container_id: str,
    tail: int = 200,
    current_user: User = Depends(get_current_user),
):
    try:
        return {"logs": docker_service.get_container_logs(container_id, tail)}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/containers/{container_id}/start")
def start(container_id: str, current_user: User = Depends(get_current_user)):
    try:
        docker_service.start_container(container_id)
        return {"status": "started"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/containers/{container_id}/stop")
def stop(container_id: str, current_user: User = Depends(get_current_user)):
    try:
        docker_service.stop_container(container_id)
        return {"status": "stopped"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/containers/{container_id}/restart")
def restart(container_id: str, current_user: User = Depends(get_current_user)):
    try:
        docker_service.restart_container(container_id)
        return {"status": "restarted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
