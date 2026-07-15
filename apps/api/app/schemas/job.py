from datetime import datetime

from pydantic import BaseModel


class JobCreate(BaseModel):
    name: str
    job_type: str
    cron_expression: str
    config: dict
    enabled: bool = True


class JobUpdate(BaseModel):
    name: str | None = None
    cron_expression: str | None = None
    config: dict | None = None
    enabled: bool | None = None


class JobOut(BaseModel):
    id: int
    name: str
    job_type: str
    cron_expression: str
    config: str
    enabled: bool
    last_run_at: datetime | None
    last_status: str | None
    last_message: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class JobRunOut(BaseModel):
    id: int
    status: str
    message: str | None
    ran_at: datetime

    class Config:
        from_attributes = True
