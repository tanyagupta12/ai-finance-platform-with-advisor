import { useEffect, useState } from "react";
import API from "../api";   // ✅ use centralized API
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function PortfolioAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/portfolio/")   // ✅ FIXED
      .then(res => {
        const list = res.data.stocks || [];

        const labels = list.map(p => p.symbol);
        const values = list.map(p => p.current_value);

        setData({
          labels,
          datasets: [
            {
              label: "Portfolio Value",
              data: values,
              backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"],
              borderColor: "#0f172a",
              borderWidth: 2
            }
          ]
        });
      })
      .catch(err => {
        console.error(err);

        // fallback (good practice 👍)
        setData({
          labels: ["Sample"],
          datasets: [
            {
              data: [1],
              backgroundColor: ["#64748b"]
            }
          ]
        });
      });
  }, []);

  if (!data) return <p style={styles.loading}>Loading...</p>;

  if (data.labels.length === 0) {
    return <p style={styles.loading}>No portfolio data available</p>;
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📊 Portfolio Analytics</h3>

      <div style={styles.chartContainer}>
        <Pie data={data} options={chartOptions} />
      </div>
    </div>
  );
}

// 🎨 CHART OPTIONS
const chartOptions = {
  plugins: {
    legend: {
      labels: {
        color: "#e2e8f0"
      }
    }
  }
};

// 🎨 STYLES
const styles = {
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    color: "#e2e8f0"
  },

  title: {
    marginBottom: "15px",
    color: "#f8fafc"
  },

  chartContainer: {
    maxWidth: "400px",
    margin: "0 auto"
  },

  loading: {
    color: "#e2e8f0"
  }
};

export default PortfolioAnalytics;