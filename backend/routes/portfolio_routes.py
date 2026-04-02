from fastapi import APIRouter, HTTPException
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
    try:
        result = add_stock_service(stock)
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# -------------------------------
# Get Portfolio
# -------------------------------
@router.get("/")
def get_portfolio():
    try:
        result = get_portfolio_service()
        return {
            "status": "success",
            "data": result
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch portfolio")


# -------------------------------
# Delete Stock
# -------------------------------
@router.delete("/delete/{symbol}")
def delete_stock(symbol: str):
    try:
        result = delete_stock_service(symbol)
        return {
            "status": "success",
            "data": result
        }
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to delete stock")