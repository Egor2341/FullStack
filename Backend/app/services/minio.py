import io
from datetime import timedelta

from fastapi import HTTPException
from minio import Minio, S3Error
from starlette.responses import StreamingResponse

from config import settings
from exceptions.MinioUploadError import MinioUploadError

# bucket_name = "receipts"
#
# client = Minio("localhost:9000",
#                access_key=settings.minio_user,
#                secret_key=settings.minio_password,
#                secure=False
#                )
#
#
# def init_minio():
#     found = client.bucket_exists(bucket_name)
#     if not found:
#         client.make_bucket(bucket_name)
#
#
# async def upload_to_minio(file, name):
#     try:
#         contents = await file.read()
#
#         client.put_object(
#             bucket_name=bucket_name,
#             object_name=name,
#             data=io.BytesIO(contents),
#             length=len(contents),
#             content_type=file.content_type,
#         )
#     except S3Error as e:
#         raise HTTPException(status_code=500, detail=str(e))
#
#
# def download_from_minio(filename):
#     try:
#         response = client.get_object(bucket_name, filename)
#
#         return StreamingResponse(
#             response,
#             media_type="application/octet-stream",
#             headers={"Content-Disposition": f"attachment; filename={filename}"}
#         )
#     except S3Error:
#         raise HTTPException(status_code=404, detail="File not found")
#
#
# def download_from_minio_url(filename: str):
#     return client.presigned_get_object(
#         bucket_name,
#         filename,
#         expires=timedelta(minutes=5)
#     )
#
#
# async def delete_from_minio(filename: str):
#     client.remove_object(bucket_name, filename)

class MinioService:
    def __init__(self, client: Minio, bucket_name: str):
        self.client = client
        self.bucket_name = bucket_name

    def init_bucket(self):
        if not self.client.bucket_exists(self.bucket_name):
            self.client.make_bucket(self.bucket_name)

    async def upload(self, file, name: str) -> None:
        contents = await file.read()

        try:
            self.client.put_object(
                bucket_name=self.bucket_name,
                object_name=name,
                data=io.BytesIO(contents),
                length=len(contents),
                content_type=file.content_type,
            )
        except S3Error as e:
            raise MinioUploadError(str(e))

    def get_object(self, filename: str):
        try:
            return self.client.get_object(self.bucket_name, filename)
        except S3Error:
            raise FileNotFoundError

    def get_presigned_url(self, filename: str) -> str:
        return self.client.presigned_get_object(
            self.bucket_name,
            filename,
            expires=timedelta(minutes=5)
        )

    async def delete(self, filename: str) -> None:
        self.client.remove_object(self.bucket_name, filename)