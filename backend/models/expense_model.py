from pydantic import BaseModel, Field

class Expense(BaseModel):
    category: str
    amount: float = Field(gt=0)


   

