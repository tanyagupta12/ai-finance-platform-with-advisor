from fastapi import HTTPException
from data_store import portfolio
import yfinance as yf


def add_stock_service(stock):
    symbol = stock.symbol.upper().strip()
    quantity = stock.quantity
    buy_price = stock.buy_price

    if not symbol or quantity <= 0 or buy_price <= 0:
        raise HTTPException(status_code=400, detail="Invalid stock data")

    for s in portfolio:
        if s["symbol"] == symbol:
            total_qty = s["quantity"] + quantity
            avg_price = ((s["buy_price"] * s["quantity"]) + (buy_price * quantity)) / total_qty

            s["quantity"] = total_qty
            s["buy_price"] = round(avg_price, 2)

            return {
                "message": "Stock updated",
                "portfolio": portfolio
            }

    portfolio.append({
        "symbol": symbol,
        "quantity": quantity,
        "buy_price": buy_price
    })

    return {
        "message": "Stock added",
        "portfolio": portfolio
    }


def get_portfolio_service():
    result = []
    total_investment = 0
    total_current_value = 0

    for stock in portfolio:
        try:
            ticker = yf.Ticker(stock["symbol"])
            data = ticker.history(period="1d")

            if data is None or data.empty:
                continue

            current_price = float(data["Close"].iloc[-1])

            investment = stock["buy_price"] * stock["quantity"]
            current_value = current_price * stock["quantity"]
            profit_loss = current_value - investment

            total_investment += investment
            total_current_value += current_value

            result.append({
                "symbol": stock["symbol"],
                "quantity": stock["quantity"],
                "buy_price": stock["buy_price"],
                "current_price": round(current_price, 2),
                "investment": round(investment, 2),
                "current_value": round(current_value, 2),
                "profit_loss": round(profit_loss, 2)
            })

        except Exception:
            continue

    return {
        "stocks": result,
        "summary": {
            "total_investment": round(total_investment, 2),
            "current_value": round(total_current_value, 2),
            "total_profit_loss": round(total_current_value - total_investment, 2)
        }
    }


def delete_stock_service(symbol: str):
    symbol = symbol.upper().strip()

    for stock in portfolio:
        if stock["symbol"] == symbol:
            portfolio.remove(stock)
            return {"message": f"{symbol} removed"}

    raise HTTPException(status_code=404, detail="Stock not found")