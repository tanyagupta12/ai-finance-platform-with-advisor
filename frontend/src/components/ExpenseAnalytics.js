import { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import SnackbarAlert from "./SnackbarAlert";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

function ExpenseAnalytics() {

  const [chartData, setChartData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [percentData, setPercentData] = useState([]);
  const [insights, setInsights] = useState([]);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/expense/insights");
      const data = res.data.data;

      setPercentData(data.categories || []);
      setInsights(data.insights || []);

      const labels = data.categories.map(c => c.category);
      const values = data.categories.map(c => c.amount);

      setChartData({
        labels,
        datasets: [{
          label: "Expenses",
          data: values,
          backgroundColor: ["#22c55e", "#3b82f6"],
          borderWidth: 2
        }]
      });

    } catch {
      setError("Unable to load expense data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrend = async () => {
    try {
      const res = await API.get("/expense/trend");
      const data = res.data.data.trend;

      setTrendData({
        labels: Object.keys(data),
        datasets: [{
          label: "Monthly Trend",
          data: Object.values(data),
          backgroundColor: "#6366f1"
        }]
      });

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInsights();
    fetchTrend();
  }, []);

  const addExpense = async () => {

    if (!category || !amount) {
      setError("Please select category and enter amount");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    try {
      setBtnLoading(true);
      setError("");
      setSuccess("");

      await API.post("/expense/add", {
        category,
        amount: Number(amount)
      });

      setCategory("");
      setAmount("");

      setSuccess("Expense added successfully");

      fetchInsights();
      fetchTrend();

    } catch {
      setError("Failed to add expense. Try again.");
    } finally {
      setBtnLoading(false);
    }
  };

  const chartOptions = {
    plugins: {
      legend: { labels: { color: "#fff" } }
    },
    scales: {
      x: { ticks: { color: "#fff" } },
      y: { ticks: { color: "#fff" } }
    }
  };

  if (loading && !chartData) {
    return <p style={{ color: "#94a3b8" }}>Loading expense dashboard...</p>;
  }

  return (
    <motion.div style={styles.container} {...fadeAnim}>

      <h2 style={styles.header}>💰 Expense Dashboard</h2>

      <div style={styles.mainGrid}>

        {/* ADD EXPENSE */}
        <div style={styles.card}>
          <h3>Add Expense</h3>

          <div style={styles.column}>
            <select
              style={styles.input}
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
            </select>

            <input
              style={styles.input}
              placeholder="Enter amount (₹)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />

            <button
              style={styles.button}
              onClick={addExpense}
              disabled={btnLoading}
            >
              {btnLoading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </div>

        {/* CHARTS */}
        <div style={styles.rightSection}>

          <div style={styles.grid}>
            <div style={styles.card}>
              <h3>📊 Overview</h3>
              {chartData
                ? <Bar data={chartData} options={chartOptions} />
                : <p style={styles.empty}>No data available</p>}
            </div>

            <div style={styles.card}>
              <h3>🥧 Distribution</h3>
              {chartData
                ? <Pie data={chartData} />
                : <p style={styles.empty}>No data available</p>}
            </div>
          </div>

          <div style={styles.card}>
            <h3>📈 Trend</h3>
            {trendData
              ? <Bar data={trendData} options={chartOptions} />
              : <p style={styles.empty}>No trend data</p>}
          </div>

        </div>
      </div>

      {/* BOTTOM */}
      <div style={styles.grid}>

        <div style={styles.card}>
          <h3>📊 Breakdown</h3>
          {percentData.length === 0
            ? <p style={styles.empty}>No data available</p>
            : percentData.map((p, i) => (
                <div key={i} style={styles.listItem}>
                  <span>{p.category}</span>
                  <span>{p.percentage}%</span>
                </div>
              ))
          }
        </div>

        <div style={styles.card}>
          <h3>🧠 Insights</h3>
          {insights.length === 0
            ? <p style={styles.empty}>No insights yet</p>
            : insights.map((ins, i) => (
                <div key={i} style={styles.insight}>
                  {ins}
                </div>
              ))
          }
        </div>

      </div>

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
  container: { padding: "30px", color: "#e2e8f0" },
  header: { marginBottom: "20px" },
  mainGrid: { display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px" },
  rightSection: { display: "flex", flexDirection: "column", gap: "20px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  card: {
    background: "rgba(30,41,59,0.85)",
    padding: "20px",
    borderRadius: "16px"
  },
  column: { display: "flex", flexDirection: "column", gap: "10px" },
  input: {
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
  empty: {
    color: "#94a3b8",
    fontStyle: "italic"
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0"
  },
  insight: {
    background: "#1d4ed8",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px"
  }
};

export default ExpenseAnalytics;