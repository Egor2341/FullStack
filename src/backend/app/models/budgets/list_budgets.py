from typing import List

from pydantic import BaseModel

from models.budgets.budget import BudgetDto


class ListBudgets(BaseModel):
    real: List["BudgetDto"]
    theory: List["BudgetDto"]
