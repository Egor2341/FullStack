from functools import lru_cache

from minio import Minio

from config import settings
from services.minio import MinioService


@lru_cache
def get_minio_service() -> MinioService:
    client = Minio(
        settings.minio_endpoint,
        access_key=settings.minio_user,
        secret_key=settings.minio_password,
        secure=settings.minio_secure,
    )

    service = MinioService(client, settings.minio_bucket)
    service.init_bucket()
    return service
