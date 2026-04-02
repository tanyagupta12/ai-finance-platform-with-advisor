import axios from "axios";

// ✅ Base URL (env + fallback)
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000",
  timeout: 60000 // ⏱ Prevent hanging requests
});

// ✅ Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global response handling
API.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error("API Error:", error);

    // 🔥 Handle unauthorized (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      // Optional: redirect to login
      window.location.href = "/login";
    }

    // 🔥 Clean error message
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Something went wrong";

    return Promise.reject(error);
  }
);

export default API;