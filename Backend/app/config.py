from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str
    db_password: str
    db_name: str

    jwt_secret_key: str

    minio_endpoint: str = "localhost:9000"
    minio_user: str
    minio_password: str
    minio_secure: bool = False
    minio_bucket: str = "receipts"

    alpha_vantage_api_key: str
    alpha_vantage_url: str
    request_timeout: int = 5

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    public_base_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()