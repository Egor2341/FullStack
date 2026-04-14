import pytest
from tests.conftest import create_test_token

test_category_dto = {"name": "Rent", "type": "expenses"}


@pytest.mark.asyncio
async def test_create_category(client):
    token = create_test_token(["user"])
    response = await client.post(
        "/categories",
        json=test_category_dto,
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 201


@pytest.mark.asyncio
async def test_get_categories(client):
    token = create_test_token(["user"])
    response = await client.get(
        "/categories", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    expenses = response.json()["expenses"]
    assert test_category_dto["name"] in expenses
    assert len(expenses) == 1
