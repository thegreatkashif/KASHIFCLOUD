from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.services import network_service

router = APIRouter(prefix="/network", tags=["network"])


@router.get("/devices")
def devices(current_user: User = Depends(get_current_user)):
    return {
        "devices": network_service.get_devices(),
        "last_scan": network_service.get_last_scan(),
        "count": len(network_service.get_devices()),
    }
