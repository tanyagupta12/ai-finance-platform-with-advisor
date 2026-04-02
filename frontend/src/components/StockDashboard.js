import React, { useEffect, useState, useRef } from "react";
import API from "../api";
import { motion } from "framer-motion";
import SnackbarAlert from "./SnackbarAlert";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider
} from "@mui/material";

import StockChart from "./StockChart";
import Portfolio from "./Portfolio";
import StockPrediction from "./StockPrediction";
import AIAdvisor from "./AIAdvisor";
import ExpenseAnalytics from "./ExpenseAnalytics";
import PortfolioAnalytics from "./PortfolioAnalytics";

function StockDashboard({ setIsLoggedIn }) {

  const [price, setPrice] = useState(null);
  const [ticker, setTicker] = useState("AAPL");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = {
    dashboard: useRef(null),
    prediction: useRef(null),
    portfolio: useRef(null),
    analytics: useRef(null),
    ai: useRef(null),
    expense: useRef(null)
  };

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get(`/stock/${ticker}`);
        const data = res.data.data;

        if (!data || !data.price) {
          setError("Invalid stock ticker");
          setPrice(null);
        } else {
          setPrice(data.price);
        }

      } catch {
        setError("Server error. Please try again.");
        setPrice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);

  }, [ticker]);

  const handleSearch = () => {
    if (!input.trim()) return;

    if (!/^[A-Za-z]+$/.test(input)) {
      setError("Enter valid ticker (AAPL, TSLA)");
      return;
    }

    setTicker(input.toUpperCase());
    setInput("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const getSecureData = async () => {
    try {
      const res = await API.get("/secure-data");
      alert(res.data.data.message);
    } catch {
      setError("Unauthorized ❌");
    }
  };

  return (
    <div
      style={{
  ...styles.container,
  marginLeft: sidebarOpen ? "240px" : "0px",
  paddingTop: "20px",
  paddingLeft: "90px"   // ✅ ADD THIS
}}
    >

      {/* MENU BUTTON */}
      {!sidebarOpen && (
        <div style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
          ☰
        </div>
      )}

      {/* SIDEBAR */}
      <motion.div
        initial={{ x: -260 }}
        animate={{ x: sidebarOpen ? 0 : -260 }}
        transition={{ duration: 0.3 }}
        style={styles.sidebar}
      >
        <h3 style={{ marginBottom: "20px" }}>📊 Menu</h3>

        <button style={styles.navBtn} onClick={() => scrollTo(sections.dashboard)}>Dashboard</button>
        <button style={styles.navBtn} onClick={() => scrollTo(sections.prediction)}>Prediction</button>
        <button style={styles.navBtn} onClick={() => scrollTo(sections.portfolio)}>Portfolio</button>
        <button style={styles.navBtn} onClick={() => scrollTo(sections.analytics)}>Analytics</button>
        <button style={styles.navBtn} onClick={() => scrollTo(sections.ai)}>AI Advisor</button>
        <button style={styles.navBtn} onClick={() => scrollTo(sections.expense)}>Expenses</button>

        <button
          style={{ ...styles.navBtn, marginTop: "20px", background: "#ef4444" }}
          onClick={() => setSidebarOpen(false)}
        >
          Close
        </button>
      </motion.div>

      {/* HEADER */}
      <div style={styles.header} ref={sections.dashboard}>
        <div>
          <Typography variant="h4" sx={styles.mainTitle}>
            🚀 AI Financial Dashboard
          </Typography>
          <Typography sx={styles.subtitle}>
            Real-time insights, ML predictions & AI-powered finance tools
          </Typography>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={getSecureData} sx={styles.greenBtn}>
            Test API
          </Button>

          <Button onClick={handleLogout} sx={styles.redBtn}>
            Logout
          </Button>
        </div>
      </div>

      <Divider sx={{ my: 3, borderColor: "#334155" }} />

      {/* SUMMARY */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={styles.summaryCard}>
            <CardContent>
              <Typography sx={styles.cardLabel}>Stock</Typography>
              <Typography sx={styles.cardValue}>{ticker}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={styles.summaryCard}>
            <CardContent>
              <Typography sx={styles.cardLabel}>Price</Typography>
              <Typography sx={{ ...styles.cardValue, fontSize: "20px", color: "#22c55e" }}>
                {loading ? <CircularProgress size={20} /> : price ? `$${price}` : "--"}
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>
                Live Market Data
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={styles.summaryCard}>
            <CardContent>
              <Typography sx={styles.cardLabel}>Status</Typography>
              <Typography sx={{ ...styles.cardValue, color: "#22c55e" }}>
                Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* MAIN */}
      <Grid container spacing={3}>

        <Grid item xs={12} md={6}>
          <motion.div {...fadeAnim}>
            <Card sx={styles.card}>
              <CardContent>
                <Typography sx={styles.sectionTitle}>🔍 Search</Typography>
                <TextField
                  size="small"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  sx={styles.textField}
                />
                <Button sx={styles.btn} onClick={handleSearch}>
                  Search
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div {...fadeAnim}>
            <Card sx={styles.card}>
              <CardContent>
                <Typography sx={styles.sectionTitle}>📈 {ticker}</Typography>
                {loading ? <CircularProgress /> : <Typography>${price}</Typography>}
                <StockChart ticker={ticker} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6} ref={sections.prediction}>
          <StockPrediction ticker={ticker} />
        </Grid>

        <Grid item xs={12} md={6} ref={sections.portfolio}>
          <Portfolio />
        </Grid>

        <Grid item xs={12} md={6} ref={sections.analytics}>
          <PortfolioAnalytics />
        </Grid>

        <Grid item xs={12} md={6} ref={sections.ai}>
          <AIAdvisor />
        </Grid>

        <Grid item xs={12} ref={sections.expense}>
          <ExpenseAnalytics />
        </Grid>

      </Grid>

      <SnackbarAlert
        open={!!error}
        message={error}
        severity="error"
        onClose={() => setError("")}
      />
    </div>
  );
}

/* ANIMATION */
const fadeAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

/* STYLES */
const styles = {
  container: {
    padding: "30px",
    minHeight: "100vh",
    color: "#e2e8f0",
    backgroundImage:
      "linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.9)), url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3')",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    transition: "all 0.3s ease"
  },

  menuBtn: {
  position: "fixed",
  top: "20px",
  left: "20px",
  fontSize: "20px",
  cursor: "pointer",
  zIndex: 3000,
  background: "#020617",
  padding: "10px 14px",
  borderRadius: "12px",
  color: "#e2e8f0",
  border: "1px solid rgba(255,255,255,0.08)"
},

  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: "240px",
    background: "rgba(15,23,42,0.9)",
    backdropFilter: "blur(12px)",
    padding: "20px",
    zIndex: 2000,
    boxShadow: "4px 0 20px rgba(0,0,0,0.5)"
  },

  navBtn: {
    display: "block",
    width: "100%",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#334155",
    color: "#fff",
    cursor: "pointer",
    textAlign: "left"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  mainTitle: { color: "#fff" },
  subtitle: { color: "#94a3b8" },

  card: { background: "#1e293b", borderRadius: "12px" },
  summaryCard: { background: "#1e293b", textAlign: "center" },

  cardLabel: { color: "#94a3b8" },
  cardValue: { color: "#fff", fontWeight: "bold" },

  sectionTitle: { color: "#fff" },

  textField: { input: { color: "#fff" }, marginRight: "10px" },

  btn: { background: "#3b82f6", color: "#fff" },
  greenBtn: { background: "#22c55e", color: "#fff" },
  redBtn: { background: "#ef4444", color: "#fff" }
};

export default StockDashboard;