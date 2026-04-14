from decimal import Decimal

import pytest
import pytest_asyncio

from data.repositories.category_repository import add_category
from models.categories.category import CategoryDto
from tests.conftest import create_test_token, test_user

test_expense = {
    "name": "Fuel",
    "value": "1200.05"
}

test_category = {
    "name": "Fuel",
    "type": "expenses"
}


@pytest_asyncio.fixture
async def create_category(db_session):
    await add_category(db_session, CategoryDto(name=test_category["name"], type=test_category["type"]),
                       test_user["uuid"])

    await db_session.commit()


@pytest.mark.asyncio
async def test_create_expense(client, create_category):
    token = create_test_token(["user"])
    response = await client.post(
        "/expenses",
        json=test_expense,
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 201


@pytest.mark.asyncio
async def test_get_expenses(client):
    token = create_test_token(["user"])
    response = await client.get(
        "/expenses",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )
    assert response.status_code == 200

    expenses = response.json()["items"]

    assert test_expense in expenses
    assert len(expenses) == 1


@pytest.mark.asyncio
async def test_search_expenses(client):
    token = create_test_token(["user"])
    response = await client.get(
        "/expenses/search",
        params={"title": test_expense["name"],
                "year": 2026,
                "month": "Все"},
        headers={
            "Authorization": f"Bearer {token}"
        }
    )
    assert response.status_code == 200
    assert test_expense["value"] == response.json()["value"]
