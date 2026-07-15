import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.scheduler import run_job_by_id, schedule_job, unschedule_job
from app.models.job import Job
from app.models.job_run import JobRun
from app.models.user import User
from app.schemas.job import JobCreate, JobOut, JobRunOut, JobUpdate

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=list[JobOut])
def list_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Job).order_by(Job.created_at.desc()).all()


@router.post("", response_model=JobOut)
def create_job(
    payload: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = Job(
        name=payload.name,
        job_type=payload.job_type,
        cron_expression=payload.cron_expression,
        config=json.dumps(payload.config),
        enabled=payload.enabled,
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    if job.enabled:
        schedule_job(job)

    return job


@router.patch("/{job_id}", response_model=JobOut)
def update_job(
    job_id: int,
    payload: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if payload.name is not None:
        job.name = payload.name
    if payload.cron_expression is not None:
        job.cron_expression = payload.cron_expression
    if payload.config is not None:
        job.config = json.dumps(payload.config)
    if payload.enabled is not None:
        job.enabled = payload.enabled

    db.commit()
    db.refresh(job)

    unschedule_job(job.id)
    if job.enabled:
        schedule_job(job)

    return job


@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    unschedule_job(job.id)

    db.query(JobRun).filter(JobRun.job_id == job_id).delete()
    db.delete(job)
    db.commit()

    return {"status": "deleted"}


@router.post("/{job_id}/run")
def run_now(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    run_job_by_id(job.id)
    return {"status": "executed"}


@router.get("/{job_id}/runs", response_model=list[JobRunOut])
def job_history(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(JobRun)
        .filter(JobRun.job_id == job_id)
        .order_by(JobRun.ran_at.desc())
        .limit(20)
        .all()
    )
