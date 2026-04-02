import { useState } from "react";
import API from "../api";
import SnackbarAlert from "./SnackbarAlert";
import { CircularProgress } from "@mui/material"; // ✅ ADDED

function StockPrediction({ ticker }) {

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ ADDED

  const getPrediction = async () => {

    if (!ticker) {
      setError("Please search for a stock first"); // ✅ FIX
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setPrediction(null);

      const res = await API.get(`/stock/predict/${ticker}`);

      if (!res.data?.data?.predicted_price) {
        throw new Error("Invalid response");
      }

      setPrediction(res.data.data.predicted_price);
      setSuccess("Prediction generated successfully"); // ✅ UX BOOST

    } catch (err) {
      console.error(err);
      setError(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const trendColor =
    prediction >= 0 ? "#22c55e" : "#ef4444";

  return (
    <div style={styles.card}>

      <h3 style={styles.title}>🤖 ML Prediction</h3>

      {/* BUTTON */}
      <button
        style={{
          ...styles.button,
          opacity: loading ? 0.6 : 1
        }}
        onClick={getPrediction}
        disabled={loading || !ticker} // ✅ FIXED
      >
        {loading ? "Predicting..." : "Predict Next Price"}
      </button>

      {/* LOADING */}
      {loading && (
        <div style={styles.loader}>
          <CircularProgress size={20} />
        </div>
      )}

      {/* RESULT */}
      {prediction !== null && (
        <div style={styles.resultBox}>
          <p style={styles.label}>Predicted Price</p>
          <h2 style={{ ...styles.price, color: trendColor }}>
            ${prediction.toFixed(2)}
          </h2>
        </div>
      )}

      {/* EMPTY STATE */}
      {!ticker && (
        <p style={styles.empty}>
          Search a stock to get prediction
        </p>
      )}

      {/* SNACKBAR */}
      <SnackbarAlert
        open={!!error}
        message={error}
        severity="error"
        onClose={() => setError("")}
      />

      <SnackbarAlert
        open={!!success}
        message={success}
        severity="success"
        onClose={() => setSuccess("")}
      />

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

  title: {
    marginBottom: "15px",
    color: "#f8fafc"
  },

  button: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  loader: {
    marginTop: "10px"
  },

  resultBox: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "12px",
    background: "#0f172a",
    border: "1px solid #334155"
  },

  label: {
    margin: 0,
    fontSize: "14px",
    color: "#94a3b8"
  },

  price: {
    margin: "5px 0 0 0"
  },

  empty: {
    marginTop: "10px",
    color: "#94a3b8",
    fontStyle: "italic"
  }
};

export default StockPrediction;