import React, { useState } from "react";
import SnackbarAlert from "./SnackbarAlert";

function SearchBar({ setTicker }) {

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // ✅ ADDED
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ ADDED

  const handleSearch = () => {

    const trimmed = input.trim();

    if (!trimmed) {
      setError("Enter a stock ticker");
      return;
    }

    if (!/^[A-Za-z]+$/.test(trimmed)) {
      setError("Invalid ticker format");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("Fetching stock data...");

    setTimeout(() => {
      setTicker(trimmed.toUpperCase());
      setInput("");
      setLoading(false);
    }, 400); // small UX delay
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🔍 Search Stock</h3>

      <div style={styles.row}>
        <input
          placeholder="Enter stock ticker (AAPL, TSLA)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && handleSearch()}
          style={styles.input}
        />

        <button
          onClick={handleSearch}
          style={styles.button}
          disabled={loading || !input.trim()} // ✅ IMPROVED
        >
          {loading ? "Searching..." : "Search Stock"}
        </button>
      </div>

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
    color: "#e2e8f0"
  },
  title: {
    marginBottom: "15px",
    color: "#f8fafc"
  },
  row: {
    display: "flex",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#fff"
  },
  button: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    opacity: 1
  }
};

export default SearchBar;