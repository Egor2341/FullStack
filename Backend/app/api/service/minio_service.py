from fastapi import HTTPException
from fastapi.responses import StreamingResponse

from services.minio import MinioService


def download_file(service: MinioService, filename: str):
    try:
        obj = service.get_object(filename)
        return StreamingResponse(
            obj,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")
