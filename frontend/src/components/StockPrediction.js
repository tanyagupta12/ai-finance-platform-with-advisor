import { useState } from "react";
import API from "../api";   // ✅ FIXED

function StockPrediction({ ticker }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPrediction = async () => {
    try {
      setLoading(true);
      setError("");
      setPrediction(null);

      const res = await API.get(`/predict/${ticker}`);
      setPrediction(res.data.predicted_price);

    } catch (err) {
      console.error(err);
      setError("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const trendColor =
    prediction > 0 ? "#22c55e" : "#ef4444";

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🤖 ML Prediction</h3>

      <button style={styles.button} onClick={getPrediction}>
        {loading ? "Predicting..." : "Predict Next Price"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {prediction && (
        <div style={styles.resultBox}>
          <p style={styles.label}>Predicted Price</p>
          <h2 style={{ ...styles.price, color: trendColor }}>
            ${prediction.toFixed(2)}
          </h2>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "16px",
    color: "#e2e8f0",
    textAlign: "center"
  },
  title: { marginBottom: "15px", color: "#f8fafc" },
  button: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  resultBox: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "12px",
    background: "#0f172a",
    border: "1px solid #334155"
  },
  label: { margin: 0, fontSize: "14px", color: "#94a3b8" },
  price: { margin: "5px 0 0 0" }
};

export default StockPrediction;