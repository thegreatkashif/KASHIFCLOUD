import os

from sqlalchemy.orm import Session

from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models.job import Job  # noqa: F401 - ensures table is registered
from app.models.job_run import JobRun  # noqa: F401
from app.models.user import User


def init_db() -> None:
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        admin_username = os.getenv("ADMIN_USERNAME", "admin")
        admin_password = os.getenv("ADMIN_PASSWORD", "changeme")

        existing = db.query(User).filter(User.username == admin_username).first()
        if not existing:
            user = User(
                username=admin_username,
                hashed_password=hash_password(admin_password),
                is_active=True,
            )
            db.add(user)
            db.commit()
    finally:
        db.close()
