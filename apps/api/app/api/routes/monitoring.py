import asyncio

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.services.monitoring import get_system_stats

router = APIRouter(prefix="/monitoring", tags=["monitoring"])


@router.get("/stats")
def stats(current_user: User = Depends(get_current_user)):
    return get_system_stats()


@router.websocket("/ws")
async def monitoring_ws(websocket: WebSocket, token: str, db: Session = Depends(get_db)):
    username = decode_access_token(token)
    if not username:
        await websocket.close(code=4401)
        return

    user = db.query(User).filter(User.username == username).first()
    if not user or not user.is_active:
        await websocket.close(code=4401)
        return

    await websocket.accept()
    try:
        while True:
            await websocket.send_json(get_system_stats())
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        pass
