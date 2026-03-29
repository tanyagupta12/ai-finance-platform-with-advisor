import React, { useState } from "react";
import API from "../api";   // ✅ use centralized API
import { TextField, Button, Typography, Card, CardContent } from "@mui/material";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        setIsLoggedIn(true);  // 🚀 go to dashboard
      } else {
        setError("Token not received ❌");
      }

    } catch (err) {
      console.error(err);
      setError("Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card sx={styles.card}>
        <CardContent>

          <Typography variant="h5" sx={styles.title}>
            🔐 Login to Dashboard
          </Typography>

          {/* EMAIL */}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={styles.input}
          />

          {/* PASSWORD */}
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={styles.input}
          />

          {/* ERROR */}
          {error && (
            <Typography sx={{ color: "red", mt: 1 }}>
              {error}
            </Typography>
          )}

          {/* BUTTON */}
          <Button
            fullWidth
            sx={styles.loginBtn}
            onClick={loginUser}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}

// 🎨 STYLES (same theme maintained)
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
    "&:hover": { background: "#2563eb" }
  }
};

export default Login;