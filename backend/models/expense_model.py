from pydantic import BaseModel, Field
from typing import Optional

class Expense(BaseModel):
    category: str
    amount: float = Field(gt=0)
    date: Optional[str] = None