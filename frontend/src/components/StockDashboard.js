import React, { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";

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

  // 🔥 Fetch stock price
  useEffect(() => {

    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get(`/stock/${ticker}`);

        if (res.data.error) {
          setError("Invalid stock ticker");
          setPrice(null);
        } else {
          setPrice(res.data.price);
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

  // 🔍 Search handler
  const handleSearch = () => {
    if (!input.trim()) return;

    if (!/^[A-Za-z]+$/.test(input)) {
      setError("Enter valid ticker (AAPL, TSLA)");
      return;
    }

    setTicker(input.toUpperCase());
    setInput("");
  };

  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // 🔐 Test Secure API
  const getSecureData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again ❌");
      return;
    }

    try {
      const res = await API.get("/secure-data");

      alert(res.data.message);
    } catch {
      alert("Unauthorized ❌");
    }
  };

  // ⏳ Loading screen
  if (loading && !price) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <CircularProgress />
        <p style={{ color: "#94a3b8" }}>Loading dashboard...</p>
      </div>
    );
  }

  // ❌ Error screen
  if (error && !price) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", color: "red" }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
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
              <Typography
                sx={{
                  ...styles.cardValue,
                  color: price > 0 ? "#22c55e" : "#ef4444"
                }}
              >
                {loading ? "..." : price ? `$${price}` : "--"}
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

      {/* SEARCH */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div {...leftAnim}>
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

                {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* STOCK CHART */}
        <Grid item xs={12} md={6}>
          <motion.div {...rightAnim}>
            <Card sx={styles.card}>
              <CardContent>
                <Typography sx={styles.sectionTitle}>
                  📈 {ticker}
                </Typography>

                {loading ? <CircularProgress /> : <Typography>{price}</Typography>}

                <StockChart ticker={ticker} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* FEATURES */}
        <Grid item xs={12} md={6}>
          <motion.div {...leftAnim}>
            <StockPrediction ticker={ticker} />
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div {...rightAnim}>
            <Portfolio />
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div {...leftAnim}>
            <PortfolioAnalytics />
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div {...rightAnim}>
            <AIAdvisor />
          </motion.div>
        </Grid>

        <Grid item xs={12}>
          <motion.div {...fadeAnim}>
            <ExpenseAnalytics />
          </motion.div>
        </Grid>

      </Grid>
    </div>
  );
}

// 🎬 ANIMATIONS
const leftAnim = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 }
};

const rightAnim = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 }
};

const fadeAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 }
};

// 🎨 STYLES
const styles = {
  container: {
    padding: "30px",
    minHeight: "100vh",
    color: "#e2e8f0",
    backgroundImage:
      "linear-gradient(rgba(15,23,42,0.9), rgba(15,23,42,0.95)), url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3')",
    backgroundSize: "cover",
    backgroundAttachment: "fixed"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  mainTitle: { color: "#fff" },
  subtitle: { color: "#94a3b8" },

  card: {
    background: "rgba(30,41,59,0.85)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "10px"
  },

  summaryCard: {
    background: "#1e293b",
    textAlign: "center",
    borderRadius: "12px"
  },

  cardLabel: { color: "#94a3b8" },
  cardValue: { color: "#fff", fontWeight: "bold" },

  sectionTitle: { color: "#fff" },

  textField: {
    input: { color: "#fff" },
    marginRight: "10px"
  },

  btn: {
    background: "#3b82f6",
    color: "#fff",
    "&:hover": { background: "#2563eb" }
  },

  greenBtn: {
    background: "#22c55e",
    color: "#fff",
    "&:hover": { background: "#16a34a" }
  },

  redBtn: {
    background: "#ef4444",
    color: "#fff",
    "&:hover": { background: "#dc2626" }
  }
};

export default StockDashboard;