import { Backdrop, Button, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface SuccessOverlayProps {
  open: boolean;
  onLogout: () => void;
  message?: string;
}

const LOGOUT_DELAY = 9; // seconds

const SuccessOverlay: React.FC<SuccessOverlayProps> = ({
  open,
  onLogout,
  message,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(LOGOUT_DELAY);

  useEffect(() => {
    if (!open) return;
    setSecondsLeft(LOGOUT_DELAY);
    const timer = setTimeout(() => {
      onLogout();
    }, LOGOUT_DELAY * 1000);
    return () => clearTimeout(timer);
  }, [open, onLogout]);

  useEffect(() => {
    if (!open) return;
    setSecondsLeft(LOGOUT_DELAY);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 10,
        color: "#fff",
        pointerEvents: open ? "auto" : "none",
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0,0,0,0.3)",
      }}
      transitionDuration={0}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 5, md: 8 },
          borderRadius: 4,
          minWidth: { xs: 350, md: 500 },
          minHeight: { xs: 250, md: 320 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          outline: "none",
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.85)",
        }}
        tabIndex={-1}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="success.main"
          gutterBottom
          sx={{ mb: 2 }}
        >
          Success!
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, textAlign: "center" }}>
          {message || "Your vote has been cast successfully."}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onLogout}
          sx={{
            fontWeight: 600,
            borderRadius: 2,
            px: 5,
            py: 1.5,
            fontSize: 18,
          }}
        >
          Logout
        </Button>
        <Typography
          variant="caption"
          sx={{ mt: 3, color: "text.secondary", fontSize: 16 }}
        >
          You will be logged out automatically in {secondsLeft} second
          {secondsLeft !== 1 ? "s" : ""}.
        </Typography>
      </Paper>
    </Backdrop>
  );
};

export default SuccessOverlay;
