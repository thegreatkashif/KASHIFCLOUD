from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    app_name: str = "Kashif Cloud API"
    environment: str = "development"  # development | production
    debug: bool = True

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # Database (used from Phase 3 onward)
    database_url: str = "postgresql://kashif:changeme@db:5432/kashif_cloud"

    # Auth (used from Phase 3 onward)
    jwt_secret: str = "changeme"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24

    # CORS - which frontends can call this API
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
