import pytest
from unittest.mock import MagicMock, AsyncMock

from minio import S3Error

from exceptions.MinioUploadError import MinioUploadError
from services.minio import MinioService


def test_init_bucket_creates_if_not_exists():
    mock_client = MagicMock()
    mock_client.bucket_exists.return_value = False

    service = MinioService(mock_client, "test-bucket")

    service.init_bucket()

    mock_client.bucket_exists.assert_called_once_with("test-bucket")
    mock_client.make_bucket.assert_called_once_with("test-bucket")


def test_init_bucket_skips_if_exists():
    mock_client = MagicMock()
    mock_client.bucket_exists.return_value = True

    service = MinioService(mock_client, "test-bucket")

    service.init_bucket()

    mock_client.make_bucket.assert_not_called()


@pytest.mark.asyncio
async def test_upload():
    mock_client = MagicMock()

    service = MinioService(mock_client, "bucket")

    file = AsyncMock()
    file.read.return_value = b"data"
    file.content_type = "text/plain"

    await service.upload(file, "file.txt")

    mock_client.put_object.assert_called_once()


@pytest.mark.asyncio
async def test_upload_error():
    mock_client = MagicMock()

    mock_client.put_object.side_effect = S3Error(
        code="Error",
        message="fail",
        resource="",
        request_id="",
        host_id="",
        response=None

    )

    service = MinioService(mock_client, "test-bucket")

    file = AsyncMock()
    file.read.return_value = b"data"
    file.content_type = "text/plain"

    with pytest.raises(MinioUploadError):
        await service.upload(file, "file.txt")


def test_get_object_success():
    mock_client = MagicMock()
    mock_response = MagicMock()

    mock_client.get_object.return_value = mock_response

    service = MinioService(mock_client, "test-bucket")

    result = service.get_object("file.txt")

    assert result == mock_response
    mock_client.get_object.assert_called_once_with("test-bucket", "file.txt")


def test_get_object_not_found():
    mock_client = MagicMock()

    mock_client.get_object.side_effect = S3Error(
        code="NoSuchKey",
        message="not found",
        resource="",
        request_id="",
        host_id="",
        response=None
    )

    service = MinioService(mock_client, "test-bucket")

    with pytest.raises(FileNotFoundError):
        service.get_object("file.txt")


def test_get_presigned_url():
    mock_client = MagicMock()

    mock_client.presigned_get_object.return_value = "http://url"

    service = MinioService(mock_client, "test-bucket")

    url = service.get_presigned_url("file.txt")

    assert url == "http://url"
    mock_client.presigned_get_object.assert_called_once()


async def test_delete():
    mock_client = MagicMock()

    service = MinioService(mock_client, "test-bucket")

    await service.delete("file.txt")

    mock_client.remove_object.assert_called_once_with("test-bucket", "file.txt")
