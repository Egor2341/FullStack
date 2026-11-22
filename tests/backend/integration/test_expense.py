from datetime import datetime
from decimal import Decimal

import pytest
import pytest_asyncio
from sqlalchemy import select

from data.entities.expense import Expense
from data.repositories.category_repository import add_category
from models.categories.category import CategoryDto
from tests.backend.conftest import create_test_token, test_user

test_expense = {"name": "Fuel", "value": 1200.05}

test_category = {"name": "Fuel", "type": "expenses"}


@pytest_asyncio.fixture
async def create_category(db_session):
    await add_category(
        db_session,
        CategoryDto(name=test_category["name"], type=test_category["type"]),
        test_user["uuid"],
    )

    await db_session.commit()


@pytest.mark.asyncio
async def test_create_expense(client, db_session, create_category):
    token = create_test_token(["user"])
    response = await client.post("/expenses", json=test_expense, headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert response.json() is None

    result = await db_session.execute(
        select(Expense).where(
            Expense.user_uuid == test_user["uuid"],
            Expense.name == test_expense["name"],
        )
    )
    expense = result.scalar_one()

    assert expense.value == Decimal("1200.05")
    assert (expense.year, expense.month) == (datetime.now().year, datetime.now().month)


@pytest.mark.asyncio
async def test_create_expense_returns_422_when_category_does_not_exist(client, db_session):
    token = create_test_token(["user"])
    missing_category_expense = {"name": "Missing category", "value": 150000.00}

    response = await client.post(
        "/expenses",
        json=missing_category_expense,
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 422
    assert response.json() == {"detail": "The category does not exist"}

    result = await db_session.execute(
        select(Expense).where(
            Expense.user_uuid == test_user["uuid"],
            Expense.name == missing_category_expense["name"],
        )
    )
    assert result.scalar_one_or_none() is None


@pytest.mark.asyncio
async def test_get_expenses(client):
    token = create_test_token(["user"])
    response = await client.get("/expenses", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    expenses = response.json()["items"]

    assert {"name": "Fuel", "value": "1200.05"} in expenses
    assert len(expenses) == 1


@pytest.mark.asyncio
async def test_search_expenses(client):
    token = create_test_token(["user"])
    response = await client.get(
        "/expenses/search",
        params={"title": test_expense["name"], "year": 2026, "month": "Все"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["value"] == "1200.05"
