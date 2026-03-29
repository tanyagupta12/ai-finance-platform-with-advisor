import yfinance as yf
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

ticker = "AAPL"

data = yf.download(ticker, period="1y")

data["Prediction"] = data["Close"].shift(-1)

X = np.array(data["Close"]).reshape(-1,1)
X = X[:-1]

y = data["Prediction"].dropna()

model = LinearRegression()
model.fit(X,y)

prediction = model.predict([[data["Close"].iloc[-1]]])

print("Predicted next price:", prediction)