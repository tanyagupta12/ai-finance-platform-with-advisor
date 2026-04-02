import { useState, useEffect } from "react";
import API from "../api";
import { motion } from "framer-motion";
import SnackbarAlert from "./SnackbarAlert";

function Portfolio() {

  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState("");

  const [portfolio, setPortfolio] = useState([]);
  const [summary, setSummary] = useState({});

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/portfolio/");
      const data = res.data.data;

      setPortfolio(data.stocks || []);
      setSummary(data.summary || {});

    } catch (err) {
      console.error(err);
      setError("Unable to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const addStock = async () => {

    if (!ticker || !shares || !price) {
      setError("Please fill all fields");
      return;
    }

    if (Number(shares) <= 0 || Number(price) <= 0) {
      setError("Values must be greater than 0");
      return;
    }

    try {
      setBtnLoading(true);
      setError("");
      setSuccess("");

      await API.post("/portfolio/add", {
        symbol: ticker.toUpperCase(),
        quantity: Number(shares),
        buy_price: Number(price)
      });

      setSuccess("Stock added successfully");

      fetchPortfolio();

      setTicker("");
      setShares("");
      setPrice("");

    } catch (err) {
      console.error(err);
      setError("Failed to add stock");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteStock = async (symbol) => {

    const confirmDelete = window.confirm(`Remove ${symbol} from portfolio?`);
    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      await API.delete(`/portfolio/delete/${symbol}`);
      setSuccess("Stock removed");

      fetchPortfolio();

    } catch (err) {
      console.error(err);
      setError("Failed to delete stock");
    }
  };

  return (
    <motion.div style={styles.card} {...fadeAnim}>

      <h2 style={styles.title}>📊 Portfolio</h2>

      {/* INPUT */}
      <div style={styles.row}>
        <input
          style={styles.input}
          placeholder="Ticker (e.g. AAPL)"
          value={ticker}
          onChange={e => setTicker(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addStock()}
        />

        <input
          type="number"
          style={styles.input}
          placeholder="Shares"
          value={shares}
          onChange={e => setShares(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addStock()}
        />

        <input
          type="number"
          style={styles.input}
          placeholder="Buy Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addStock()}
        />

        <button
          style={styles.button}
          onClick={addStock}
          disabled={btnLoading}
        >
          {btnLoading ? "Adding..." : "Add Stock"}
        </button>
      </div>

      {/* SUMMARY */}
      <div style={styles.summary}>
        <p>💰 Invested: ₹ {summary.total_investment || 0}</p>
        <p>📊 Value: ₹ {summary.current_value || 0}</p>
        <p style={{
          color: summary.total_profit_loss >= 0 ? "#22c55e" : "#ef4444",
          fontWeight: "bold"
        }}>
          📈 P/L: ₹ {summary.total_profit_loss || 0}
        </p>
      </div>

      {/* LIST */}
      {loading ? (
        <p style={styles.empty}>Loading portfolio...</p>
      ) : portfolio.length === 0 ? (
        <p style={styles.empty}>
          No stocks added yet. Start by adding your first investment 🚀
        </p>
      ) : (
        <div style={styles.listContainer}>
          {portfolio.map((p, i) => (
            <div key={i} style={styles.listItem}>

              <span style={styles.ticker}>{p.symbol}</span>
              <span>{p.quantity}</span>
              <span>₹ {p.current_price}</span>

              <span style={{
                color: p.profit_loss >= 0 ? "#22c55e" : "#ef4444"
              }}>
                ₹ {p.profit_loss}
              </span>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteStock(p.symbol)}
              >
                ✕
              </button>

            </div>
          ))}
        </div>
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

    </motion.div>
  );
}

const fadeAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

const styles = {
  card: {
    background: "rgba(30,41,59,0.9)",
    padding: "20px",
    borderRadius: "16px",
    color: "#e2e8f0"
  },
  title: { marginBottom: "15px" },
  row: { display: "flex", gap: "10px", marginBottom: "15px" },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff"
  },
  button: {
    background: "#22c55e",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  summary: { marginBottom: "15px" },
  listContainer: { marginTop: "10px" },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #334155",
    alignItems: "center"
  },
  ticker: { fontWeight: "bold", color: "#38bdf8" },
  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: "16px"
  },
  empty: {
    color: "#94a3b8",
    fontStyle: "italic"
  }
};

export default Portfolio;