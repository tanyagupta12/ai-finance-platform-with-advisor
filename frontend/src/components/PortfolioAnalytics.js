import { useEffect, useState } from "react";
import API from "../api";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import SnackbarAlert from "./SnackbarAlert";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function PortfolioAnalytics() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ ADDED
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");

        const res = await API.get("/portfolio/");
        const list = res.data.data?.stocks || [];

        if (list.length === 0) {
          setData(null);
          return;
        }

        const labels = list.map(p => p.symbol);
        const values = list.map(p => p.current_value);

        // 🎨 Dynamic colors
        const colors = labels.map((_, i) =>
          `hsl(${(i * 60) % 360}, 70%, 50%)`
        );

        setData({
          labels,
          datasets: [
            {
              label: "Portfolio Value",
              data: values,
              backgroundColor: colors,
              borderColor: "#0f172a",
              borderWidth: 2
            }
          ]
        });

      } catch (err) {
        console.error(err);
        setError("Failed to load portfolio analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p style={styles.loading}>Loading portfolio analytics...</p>;
  }

  if (!data) {
    return (
      <div style={styles.card}>
        <h3 style={styles.title}>📊 Portfolio Analytics</h3>
        <p style={styles.empty}>
          No portfolio data available. Add stocks to see insights.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📊 Portfolio Analytics</h3>

      <div style={styles.chartContainer}>
        <Pie data={data} options={chartOptions} />
      </div>

      {/* SNACKBAR */}
      <SnackbarAlert
        open={!!error}
        message={error}
        severity="error"
        onClose={() => setError("")}
      />
    </div>
  );
}

// Chart Options
const chartOptions = {
  plugins: {
    legend: {
      labels: {
        color: "#e2e8f0"
      }
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `₹ ${context.raw}`;
        }
      }
    }
  }
};

// Styles
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
    color: "#94a3b8"
  },

  empty: {
    color: "#94a3b8",
    fontStyle: "italic"
  }
};

export default PortfolioAnalytics;