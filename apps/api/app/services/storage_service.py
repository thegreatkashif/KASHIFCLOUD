import os
import shutil
from pathlib import Path

from fastapi import HTTPException, UploadFile

from app.core.storage_roots import STORAGE_ROOTS


def resolve_path(root: str, rel_path: str) -> Path:
    if root not in STORAGE_ROOTS:
        raise HTTPException(status_code=404, detail="Unknown storage root")

    base = Path(STORAGE_ROOTS[root]).resolve()
    target = (base / rel_path.lstrip("/")).resolve()

    if base != target and base not in target.parents:
        raise HTTPException(status_code=400, detail="Invalid path")

    return target


def list_roots() -> list[dict]:
    result = []
    for name, path in STORAGE_ROOTS.items():
        p = Path(path)
        available = p.exists()
        usage = shutil.disk_usage(path) if available else None
        result.append({
            "name": name,
            "available": available,
            "total": usage.total if usage else None,
            "used": usage.used if usage else None,
        })
    return result


def list_dir(root: str, rel_path: str) -> list[dict]:
    target = resolve_path(root, rel_path)

    if not target.exists():
        raise HTTPException(status_code=404, detail="Path not found")
    if not target.is_dir():
        raise HTTPException(status_code=400, detail="Not a directory")

    entries = []
    for item in sorted(target.iterdir(), key=lambda x: (x.is_file(), x.name.lower())):
        try:
            stat = item.stat()
            entries.append({
                "name": item.name,
                "is_dir": item.is_dir(),
                "size": stat.st_size if item.is_file() else None,
                "modified": stat.st_mtime,
            })
        except OSError:
            continue

    return entries


def delete_path(root: str, rel_path: str) -> None:
    target = resolve_path(root, rel_path)

    if not target.exists():
        raise HTTPException(status_code=404, detail="Path not found")

    if target.is_dir():
        shutil.rmtree(target)
    else:
        target.unlink()


def make_dir(root: str, rel_path: str, name: str) -> None:
    if "/" in name or ".." in name:
        raise HTTPException(status_code=400, detail="Invalid folder name")

    target = resolve_path(root, rel_path) / name
    target.mkdir(parents=True, exist_ok=False)


async def save_upload(root: str, rel_path: str, file: UploadFile) -> None:
    if "/" in file.filename or ".." in file.filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    target = resolve_path(root, rel_path) / file.filename

    with open(target, "wb") as f:
        shutil.copyfileobj(file.file, f)


def get_file_path(root: str, rel_path: str) -> Path:
    target = resolve_path(root, rel_path)

    if not target.exists() or not target.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    return target
