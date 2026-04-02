import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

def predict_stock(data):
    df = data.copy()

    # Create feature
    df["Days"] = np.arange(len(df))
    df["Prediction"] = df["Close"].shift(-1)

    # Training data
    X = df[["Days"]][:-1]
    y = df["Prediction"].dropna()

    model = LinearRegression()
    model.fit(X, y)

    # ✅ FIX: Use DataFrame with same column name
    next_day = pd.DataFrame([[len(df)]], columns=["Days"])

    prediction = model.predict(next_day)

    return float(prediction[0])