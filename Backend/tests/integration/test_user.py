import pytest
from sqlalchemy import select

from data.entities.role import Role
from tests.conftest import client, create_test_token

test_user_data = {
    "email": "test@example.com",
    "password": "password123"
}


@pytest.mark.asyncio
async def test_roles(db_session):
    result = await db_session.execute(select(Role))
    roles = result.scalars().all()

    names = [r.name for r in roles]

    assert len(roles) == 2
    assert "admin" in names
    assert "user" in names


@pytest.mark.asyncio
async def test_create_user(client):
    response = await client.post("/auth/register", json=test_user_data)
    assert response.status_code == 201


@pytest.mark.asyncio
async def test_create_invalid_user(client):
    response = await client.post("/auth/register", json={"email": "1231231", "password": "123123123"})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_users(client):
    token = create_test_token(["admin"])
    response = await client.get("/admin/users", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    assert response.json() == [{'email': 'test@example.com', 'roles': ['user']}]


@pytest.mark.asyncio
async def test_add_admin(client):
    token = create_test_token(["admin"])
    response = await client.post(
        "/admin/add",
        json={"email": "user@example.com"},
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_delete_admin(client):
    token = create_test_token(["admin"])
    response = await client.post(
        "/admin/delete",
        json={"email": test_user_data["email"]},
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200
