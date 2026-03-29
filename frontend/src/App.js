import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import StockDashboard from "./components/StockDashboard";
import Login from "./components/Login";

const theme = createTheme({
  palette: {
    mode: "dark"
  }
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <ThemeProvider theme={theme}>
      {
        isLoggedIn ? (
          // ✅ PASS PROP HERE
          <StockDashboard setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <Login setIsLoggedIn={setIsLoggedIn} />
        )
      }
    </ThemeProvider>
  );
}

export default App;