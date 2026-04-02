import React, { useState } from "react";
import API from "../api";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent
} from "@mui/material";
import SnackbarAlert from "./SnackbarAlert";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loginUser = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      if (res.data.data?.access_token) {
        localStorage.setItem("token", res.data.data.access_token);
        setSuccess("Login successful 🚀");

        setTimeout(() => {
          setIsLoggedIn(true);
        }, 800);
      } else {
        setError("Authentication failed");
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card sx={styles.card}>
        <CardContent>

          <Typography variant="h5" sx={styles.title}>
            🔐 Sign in to your account
          </Typography>

          {/* EMAIL */}
          <TextField
            fullWidth
            label="Email"
            placeholder="Enter your email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loginUser()} // ✅ FIX
            sx={styles.input}
          />

          {/* PASSWORD */}
          <TextField
            fullWidth
            type="password"
            label="Password"
            placeholder="Enter your password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loginUser()} // ✅ FIX
            sx={styles.input}
          />

          {/* BUTTON */}
          <Button
            fullWidth
            sx={styles.loginBtn}
            onClick={loginUser}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

        </CardContent>
      </Card>

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

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
      "linear-gradient(rgba(15,23,42,0.9), rgba(15,23,42,0.95)), url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3')",
    backgroundSize: "cover"
  },

  card: {
    width: "350px",
    background: "rgba(30,41,59,0.9)",
    borderRadius: "16px",
    padding: "10px"
  },

  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "10px"
  },

  input: {
    input: { color: "#fff" },
    label: { color: "#94a3b8" }
  },

  loginBtn: {
    marginTop: "15px",
    background: "#3b82f6",
    color: "#fff",
    fontWeight: "bold",
    "&:hover": { background: "#2563eb" }
  }
};

export default Login;