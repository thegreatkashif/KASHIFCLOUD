from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, docker, health, jobs, monitoring, network, storage
from app.core.bootstrap import init_db
from app.core.config import get_settings
from app.core.scheduler import start_scheduler

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()
    start_scheduler()


app.include_router(health.router)
app.include_router(auth.router)
app.include_router(monitoring.router)
app.include_router(docker.router)
app.include_router(storage.router)
app.include_router(network.router)
app.include_router(jobs.router)


@app.get("/")
def root():
    return {"message": f"{settings.app_name} is running"}
