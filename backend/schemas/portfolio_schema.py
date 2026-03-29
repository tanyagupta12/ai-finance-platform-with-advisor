from pydantic import BaseModel

class StockRequest(BaseModel):
    symbol: str
    quantity: int
    buy_price: float