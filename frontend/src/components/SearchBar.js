import React, { useState } from "react";

function SearchBar({ setTicker }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (!input.trim()) {
      setError("Enter a stock ticker");
      return;
    }

    if (!/^[A-Za-z]+$/.test(input)) {
      setError("Invalid ticker format");
      return;
    }

    setTicker(input.toUpperCase());
    setInput("");
    setError("");
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🔍 Search Stock</h3>

      <div style={styles.row}>
        <input
          placeholder="Enter stock ticker (AAPL, TSLA)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={styles.input}
        />

        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
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
  title: { marginBottom: "15px", color: "#f8fafc" },
  row: { display: "flex", gap: "10px" },
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
    cursor: "pointer"
  }
};

export default SearchBar;