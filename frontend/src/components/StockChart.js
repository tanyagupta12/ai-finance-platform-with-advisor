import { Line } from "react-chartjs-2";
import { useEffect, useState, useRef } from "react";
import API from "../api";
import SnackbarAlert from "./SnackbarAlert";
import { CircularProgress } from "@mui/material"; // ✅ ADDED

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  zoomPlugin
);

function StockChart({ ticker }) {

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ ADDED
  const [error, setError] = useState("");
  const chartRef = useRef(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get(`/stock/${ticker}/history`);
        const data = res.data.data || {};

        const labels = Object.keys(data).slice(-80);
        const prices = Object.values(data).slice(-80);

        if (!labels.length) {
          setError("No data available for this stock");
          setChartData(null);
          return;
        }

        setChartData({
          labels,
          datasets: [
            {
              label: `${ticker} Price`,
              data: prices,
              borderColor: "#3b82f6",
              tension: 0.4,
              fill: true,
              pointRadius: 0
            }
          ]
        });

      } catch (err) {
        console.error(err);
        setError("Failed to load stock data");
      } finally {
        setLoading(false);
      }
    };

    if (ticker) fetchData();

  }, [ticker]);

  const getGradient = (ctx, chartArea) => {
    if (!chartArea) return null;

    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, "rgba(59,130,246,0.4)");
    gradient.addColorStop(1, "rgba(59,130,246,0)");

    return gradient;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false
    },

    plugins: {
      legend: { display: false },

      tooltip: {
        backgroundColor: "#020617",
        borderColor: "#3b82f6",
        borderWidth: 1,
        titleColor: "#fff",
        bodyColor: "#e2e8f0",
        padding: 10
      },

      zoom: {
        pan: { enabled: true, mode: "x" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x"
        }
      }
    },

    scales: {
      x: {
        ticks: { color: "#94a3b8", maxTicksLimit: 6 },
        grid: { color: "rgba(30,41,59,0.5)" }
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(30,41,59,0.5)" }
      }
    }
  };

  // ✅ LOADING UI
  if (loading) {
    return (
      <div style={styles.loadingBox}>
        <CircularProgress />
      </div>
    );
  }

  // ❌ NO DATA
  if (!chartData) {
    return <p style={styles.loading}>No chart data</p>;
  }

  return (
    <div style={styles.card}>

      <div style={styles.header}>
        <h3 style={styles.title}>📈 {ticker}</h3>

        <button
          style={styles.resetBtn}
          onClick={() => chartRef.current?.resetZoom()}
          disabled={!chartData} // ✅ IMPROVED
        >
          Reset
        </button>
      </div>

      <div style={styles.chartWrapper}>
        <Line
          ref={chartRef}
          data={{
            ...chartData,
            datasets: chartData.datasets.map(ds => ({
              ...ds,
              backgroundColor: (context) => {
                const { ctx, chartArea } = context.chart;
                return getGradient(ctx, chartArea);
              }
            }))
          }}
          options={options}
        />
      </div>

      <SnackbarAlert
        open={!!error}
        message={error}
        severity="error"
        onClose={() => setError("")}
      />
    </div>
  );
}

const styles = {
  card: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    color: "#e2e8f0",
    width: "100%"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },

  title: {
    color: "#f8fafc",
    margin: 0
  },

  resetBtn: {
    background: "#334155",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px"
  },

  chartWrapper: {
    width: "100%",
    height: "320px"
  },

  loading: {
    color: "#e2e8f0"
  },

  loadingBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "320px"
  }
};

export default StockChart;