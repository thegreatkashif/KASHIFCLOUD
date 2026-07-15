from fastapi import APIRouter, Depends, File, Query, UploadFile
from fastapi.responses import FileResponse

from app.api.deps import get_current_user
from app.models.user import User
from app.services import storage_service

router = APIRouter(prefix="/storage", tags=["storage"])


@router.get("/roots")
def roots(current_user: User = Depends(get_current_user)):
    return storage_service.list_roots()


@router.get("/browse")
def browse(
    root: str,
    path: str = "",
    current_user: User = Depends(get_current_user),
):
    return storage_service.list_dir(root, path)


@router.delete("/item")
def delete_item(
    root: str,
    path: str,
    current_user: User = Depends(get_current_user),
):
    storage_service.delete_path(root, path)
    return {"status": "deleted"}


@router.post("/mkdir")
def mkdir(
    root: str,
    path: str = "",
    name: str = Query(...),
    current_user: User = Depends(get_current_user),
):
    storage_service.make_dir(root, path, name)
    return {"status": "created"}


@router.post("/upload")
async def upload(
    root: str,
    path: str = "",
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    await storage_service.save_upload(root, path, file)
    return {"status": "uploaded"}


@router.get("/download")
def download(
    root: str,
    path: str,
    current_user: User = Depends(get_current_user),
):
    file_path = storage_service.get_file_path(root, path)
    return FileResponse(file_path, filename=file_path.name)
