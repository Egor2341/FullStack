from datetime import datetime, timedelta

import jwt
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from testcontainers.postgres import PostgresContainer
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from data.entities.role import Role
from data.entities.user import User
from data.init_bd import Base, get_session

import os

from main import app
from services.security import SECRET_KEY, ALGORITHM

os.environ["TESTCONTAINERS_RYUK_DISABLED"] = "true"

test_user = {
    "uuid": "123342434563",
    "email": "user@example.com",
    "password": "pass1234",
}


@pytest_asyncio.fixture(scope="session")
async def postgres_container():
    container = PostgresContainer("postgres:15")
    container.start()
    yield container
    container.stop()


@pytest_asyncio.fixture
async def engine(postgres_container):
    sync_url = postgres_container.get_connection_url()
    async_url = sync_url.replace("psycopg2", "asyncpg")

    engine = create_async_engine(async_url, echo=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

        try:
            await conn.execute(
                Role.__table__.insert(),
                [
                    {"name": "admin"},
                    {"name": "user"},
                ],
            )
            await conn.execute(
                User.__table__.insert(),
                [
                    {
                        "uuid": test_user["uuid"],
                        "email": test_user["email"],
                        "password": test_user["password"],
                    },
                ],
            )
        except Exception as e:
            print(e)

    yield engine

    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(engine):
    async_session = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with async_session() as session:
        yield session


@pytest_asyncio.fixture
async def client(db_session):
    async def override_get_session():
        yield db_session

    app.dependency_overrides[get_session] = override_get_session
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test/api"
    ) as ac:
        yield ac

    app.dependency_overrides.clear()


def create_test_token(roles: list[str], sub: str = test_user["uuid"]):
    payload = {"sub": sub, "roles": roles, "exp": datetime.now() + timedelta(hours=1)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
