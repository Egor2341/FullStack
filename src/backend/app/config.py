from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "postgres"
    db_password: str = "postgres"
    db_name: str = "treasurydb"

    jwt_secret_key: str = "change_me"

    minio_endpoint: str = "localhost:9000"
    minio_user: str = "minioadmin"
    minio_password: str = "minioadmin"
    minio_secure: bool = False
    minio_bucket: str = "receipts"

    alpha_vantage_api_key: str = ""
    alpha_vantage_url: str = "https://www.alphavantage.co/query"
    request_timeout: int = 5

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    public_base_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
