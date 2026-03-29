import { useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";

function AIAdvisor() {

  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askAI = async () => {

    if (!query.trim()) {
      setError("Please enter a question");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResponse("");
      setMeta(null);

      const res = await API.post("/ai/advice", {
        query: query
      });

      if (!res.data.answer) {
        throw new Error("Empty response");
      }

      setResponse(res.data.answer);
      setMeta(res.data.meta);

    } catch (err) {
      console.error("AI error:", err);
      setError("AI failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div style={styles.card} {...fadeAnim}>

      <h3 style={styles.title}>🧠 AI Financial Advisor</h3>

      {/* INPUT */}
      <div style={styles.row}>

        <input
          placeholder="Ask financial question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              askAI();
            }
          }}
          style={styles.input}
        />

        <button
          onClick={askAI}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? "..." : "Ask"}
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <div style={styles.loadingBox}>
          <CircularProgress size={20} />
          <span>Analyzing your finances...</span>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p style={styles.error}>{error}</p>
      )}

      {/* META */}
      {meta && (
        <motion.div style={styles.metaBox} {...fadeAnim}>
          <p>💸 Expense: ₹ {meta.total_expense}</p>
          <p>📊 Investment: ₹ {meta.total_investment}</p>

          <p style={{
            fontWeight: "bold",
            color:
              meta.risk === "HIGH" ? "#ef4444" :
              meta.risk === "MEDIUM" ? "#f59e0b" :
              "#22c55e"
          }}>
            ⚠ Risk: {meta.risk}
          </p>
        </motion.div>
      )}

      {/* RESPONSE */}
      {response && (
        <motion.div style={styles.responseBox} {...fadeAnim}>
          <h4 style={{ marginBottom: "8px" }}>📌 AI Advice</h4>

          {response.split("•").map((line, i) => {
            if (!line.trim()) return null;
            return (
              <p key={i} style={styles.bullet}>
                • {line.trim()}
              </p>
            );
          })}
        </motion.div>
      )}

    </motion.div>
  );
}

// 🎬 Animation
const fadeAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 }
};

// 🎨 Styles
const styles = {
  card: {
    background: "rgba(30,41,59,0.9)",
    backdropFilter: "blur(10px)",
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
    background: "#020617",
    color: "#fff"
  },

  button: {
    background: "#22c55e",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  loadingBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "15px",
    color: "#94a3b8"
  },

  error: {
    color: "#ef4444",
    marginTop: "10px"
  },

  metaBox: {
    marginTop: "15px",
    padding: "10px",
    background: "#020617",
    borderRadius: "8px",
    border: "1px solid #334155"
  },

  responseBox: {
    marginTop: "20px",
    background: "#020617",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #334155"
  },

  bullet: {
    margin: "6px 0"
  }
};

export default AIAdvisor;