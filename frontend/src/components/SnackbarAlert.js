import React from "react";
import { Snackbar, Alert } from "@mui/material";

export default function SnackbarAlert({ open, message, severity, onClose }) {

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return; // ✅ prevent accidental close
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }} // ✅ better UX
    >
      <Alert
        severity={severity}
        onClose={handleClose}
        variant="filled" // ✅ premium look
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}