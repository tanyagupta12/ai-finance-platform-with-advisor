import { useState, useEffect } from "react";
import API from "../api";
import { motion } from "framer-motion";

function Portfolio() {

  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState("");

  const [portfolio, setPortfolio] = useState([]);
  const [summary, setSummary] = useState({});

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // 🔥 FETCH
  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await API.get("/portfolio/");
      setPortfolio(res.data.stocks || []);
      setSummary(res.data.summary || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // 🔥 ADD
  const addStock = async () => {

    if (!ticker || !shares || !price) {
      alert("Enter all values");
      return;
    }

    if (Number(shares) <= 0 || Number(price) <= 0) {
      alert("Invalid values");
      return;
    }

    try {
      setBtnLoading(true);

      await API.post("/portfolio/add", {
        symbol: ticker.toUpperCase(),
        quantity: Number(shares),
        buy_price: Number(price)
      });

      fetchPortfolio();

      setTicker("");
      setShares("");
      setPrice("");

    } catch (err) {
      console.error(err);
    } finally {
      setBtnLoading(false);
    }
  };

  // 🔥 DELETE (INTERVIEW BOOST)
  const deleteStock = async (symbol) => {
    try {
      await API.delete(`/portfolio/delete/${symbol}`);
      fetchPortfolio();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div style={styles.card} {...fadeAnim}>

      <h2 style={styles.title}>📊 Portfolio</h2>

      {/* INPUT */}
      <div style={styles.row}>
        <input
          style={styles.input}
          placeholder="Ticker"
          value={ticker}
          onChange={e => setTicker(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Shares"
          value={shares}
          onChange={e => setShares(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Buy Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <button style={styles.button} onClick={addStock} disabled={btnLoading}>
          {btnLoading ? "..." : "Add"}
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
        <p>Loading portfolio...</p>
      ) : portfolio.length === 0 ? (
        <p>No stocks added yet</p>
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

    </motion.div>
  );
}

// 🎬 Animation
const fadeAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

// 🎨 Styles
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
  }
};

export default Portfolio;