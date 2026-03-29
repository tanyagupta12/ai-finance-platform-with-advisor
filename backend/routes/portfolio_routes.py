from fastapi import APIRouter
from schemas.portfolio_schema import StockRequest
from services.portfolio_service import (
    add_stock_service,
    get_portfolio_service,
    delete_stock_service
)

router = APIRouter()

# -------------------------------
# Add Stock
# -------------------------------
@router.post("/add")
def add_stock(stock: StockRequest):
    return add_stock_service(stock)


# -------------------------------
# Get Portfolio
# -------------------------------
@router.get("/")
def get_portfolio():
    return get_portfolio_service()


# -------------------------------
# Delete Stock
# -------------------------------
@router.delete("/delete/{symbol}")
def delete_stock(symbol: str):
    return delete_stock_service(symbol)