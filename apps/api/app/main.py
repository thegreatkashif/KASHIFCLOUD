from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, docker, health, monitoring, network, storage
from app.core.bootstrap import init_db
from app.core.config import get_settings

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


app.include_router(health.router)
app.include_router(auth.router)
app.include_router(monitoring.router)
app.include_router(docker.router)
app.include_router(storage.router)
app.include_router(network.router)


@app.get("/")
def root():
    return {"message": f"{settings.app_name} is running"}
