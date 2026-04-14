from decimal import Decimal
from pydantic import BaseModel, Field


class BudgetDto(BaseModel):
    type: str
    month: str
    year: int
    value: Decimal = Field(...)
