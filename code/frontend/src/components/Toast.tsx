import React, { useEffect, useState } from "react";
import {
  Box,
  Alert,
  IconButton,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import { Close as CloseIcon, Error as ErrorIcon } from "@mui/icons-material";

export interface ToastMessage {
  id: string;
  message: string;
  severity?: "error" | "warning" | "info" | "success";
  duration?: number;
}

interface ToastProps {
  message: ToastMessage | null;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);

  const handleClose = () => {
    setOpen(false);
    if (message) {
      onClose(message.id);
    }
  };

  const handleAutoClose = () => {
    if (message) {
      onClose(message.id);
    }
  };

  if (!message) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={message.duration || 10000}
      onClose={handleAutoClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "left" }}
      sx={{
        "& .MuiSnackbar-root": {
          bottom: 24,
          right: 24,
        },
      }}
    >
      <Alert
        severity={message.severity || "error"}
        onClose={handleClose}
        sx={{
          width: "100%",
          minWidth: 300,
          maxWidth: 450,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderRadius: 2,
          "& .MuiAlert-icon": {
            fontSize: 24,
          },
          "& .MuiAlert-message": {
            fontSize: "0.875rem",
            fontWeight: 500,
          },
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
            sx={{
              color: "inherit",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <ErrorIcon sx={{ fontSize: 20, mt: 0.25 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {message.severity?.toUpperCase() || "ERROR"}
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
              {message.message}
            </Typography>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default Toast;
