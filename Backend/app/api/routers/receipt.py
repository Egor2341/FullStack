from typing import Annotated

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from data.init_bd import get_session
from data.repositories import receipts_repository
from dependency.minio_dependency import get_minio_service
from services.minio import MinioService
from services.security import RoleChecker

router = APIRouter(
    prefix="/api/receipts",
    tags=["receipts"]
)


@router.get("/init", status_code=200)
async def get_init(
        user_uuid: Annotated[str, Depends(RoleChecker(allowed_roles=["user"]))],
        session: AsyncSession = Depends(get_session)
):
    return await receipts_repository.init(session, user_uuid)


@router.get("", status_code=200)
async def get_receipts(
        page: int,
        user_uuid: Annotated[str, Depends(RoleChecker(allowed_roles=["user"]))],
        session: AsyncSession = Depends(get_session)
):
    return await receipts_repository.get_receipts(
        session,
        user_uuid,
        page
    )


@router.post("", status_code=201)
async def add_receipt(
        user_uuid: Annotated[str, Depends(RoleChecker(allowed_roles=["user"]))],
        session: AsyncSession = Depends(get_session),
        file: UploadFile = File(...),
        minio_service: MinioService = Depends(get_minio_service)
):
    name = await receipts_repository.add_receipt(session, user_uuid, file)
    await session.commit()

    await minio_service.upload(file, name)


@router.get("/download")
async def get_receipt(
        uuid: str,
        _: Annotated[str, Depends(RoleChecker(allowed_roles=["user"]))],
        session: AsyncSession = Depends(get_session),
        minio_service: MinioService = Depends(get_minio_service)
):
    file = await receipts_repository.get_file_info(session, uuid)
    return {
        "url": minio_service.get_presigned_url(file.object_name)
    }


@router.delete("", status_code=204)
async def delete_receipt(
        uuid: str,
        _: Annotated[str, Depends(RoleChecker(allowed_roles=["user"]))],
        session: AsyncSession = Depends(get_session),
        minio_service: MinioService = Depends(get_minio_service)
):
    file = await receipts_repository.delete_receipt(session, uuid)
    await session.commit()
    await minio_service.delete(file)
