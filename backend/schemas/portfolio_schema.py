from pydantic import BaseModel, Field

class StockRequest(BaseModel):
    symbol: str = Field(..., min_length=1)
    quantity: int = Field(..., gt=0)
    buy_price: float = Field(..., gt=0)