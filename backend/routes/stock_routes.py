from fastapi import APIRouter, HTTPException
from services.stock_service import get_stock_data
from services.prediction_service import predict_stock

router = APIRouter()

# -------------------------------
# Stock Price
# -------------------------------
@router.get("/{ticker}")
def get_stock_price(ticker: str):
    data = get_stock_data(ticker)

    if data is None or data.empty:
        raise HTTPException(status_code=404, detail="Stock not found")

    price = float(data["Close"].iloc[-1])

    return {
        "status": "success",
        "data": {
            "ticker": ticker.upper(),
            "price": price
        }
    }


# -------------------------------
# Stock History
# -------------------------------
@router.get("/{ticker}/history")
def get_stock_history(ticker: str):
    data = get_stock_data(ticker, "1y")

    if data is None or data.empty:
        raise HTTPException(status_code=404, detail="Stock not found")

    history = dict(list(data["Close"].to_dict().items())[-100:])

    return {
        "status": "success",
        "data": history
    }


# -------------------------------
# Prediction
# -------------------------------
@router.get("/predict/{ticker}")
def predict_price(ticker: str):
    data = get_stock_data(ticker, "1y")

    if data is None or data.empty:
        raise HTTPException(status_code=404, detail="Stock not found")

    prediction = predict_stock(data)

    return {
        "status": "success",
        "data": {
            "ticker": ticker.upper(),
            "predicted_price": prediction
        }
    }