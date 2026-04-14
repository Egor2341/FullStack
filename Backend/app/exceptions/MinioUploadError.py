from fastapi import HTTPException


class MinioUploadError(Exception):
    print("Minio upload error")