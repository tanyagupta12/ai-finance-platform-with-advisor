import yfinance as yf
from cachetools import TTLCache

# Cache
stock_cache = TTLCache(maxsize=100, ttl=300)

def get_stock_data(ticker: str, period="1d"):
    ticker = ticker.upper().strip()  

    key = f"{ticker}_{period}"

    if key in stock_cache:
        return stock_cache[key]

    stock = yf.Ticker(ticker)
    data = stock.history(period=period)

    if data is None or data.empty:
        return None

    stock_cache[key] = data
    return data