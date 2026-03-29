import numpy as np
from sklearn.linear_model import LinearRegression

def predict_stock(data):
    data["Days"] = np.arange(len(data))
    data["Prediction"] = data["Close"].shift(-1)

    X = data[["Days"]][:-1]
    y = data["Prediction"].dropna()

    model = LinearRegression()
    model.fit(X, y)

    next_day = np.array([[len(data)]])
    prediction = model.predict(next_day)

    return float(prediction[0])