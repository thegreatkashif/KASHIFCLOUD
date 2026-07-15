from datetime import datetime, timezone

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from app.core.database import SessionLocal
from app.models.job import Job
from app.models.job_run import JobRun
from app.services.job_executors import execute_job

scheduler = BackgroundScheduler()


def run_job_by_id(job_id: int) -> None:
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job or not job.enabled:
            return

        try:
            message = execute_job(job.job_type, job.config)
            status = "success"
        except Exception as e:
            message = str(e)
            status = "failed"

        job.last_run_at = datetime.now(timezone.utc)
        job.last_status = status
        job.last_message = message
        db.add(job)

        run = JobRun(job_id=job.id, status=status, message=message)
        db.add(run)

        db.commit()
    finally:
        db.close()


def schedule_job(job: Job) -> None:
    scheduler.add_job(
        run_job_by_id,
        trigger=CronTrigger.from_crontab(job.cron_expression),
        args=[job.id],
        id=str(job.id),
        replace_existing=True,
    )


def unschedule_job(job_id: int) -> None:
    if scheduler.get_job(str(job_id)):
        scheduler.remove_job(str(job_id))


def load_all_jobs() -> None:
    db = SessionLocal()
    try:
        jobs = db.query(Job).filter(Job.enabled == True).all()  # noqa: E712
        for job in jobs:
            schedule_job(job)
    finally:
        db.close()


def start_scheduler() -> None:
    load_all_jobs()
    scheduler.start()
