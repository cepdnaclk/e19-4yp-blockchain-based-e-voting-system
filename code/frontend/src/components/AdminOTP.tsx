// Import React, hooks, navigation, MUI components, and context
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import Navigation from "./Navigation";
import { useAuth } from "../context/AuthContect";// Custom auth context to get the access token

// Functional component for Admin OTP verification
const AdminOTP: React.FC = () => {
  // Local state variables
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const { accessToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // TODO: Implement OTP verification logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    // TODO: Implement resend OTP logic
  };

  useEffect(() => {
    console.log(accessToken);
    if (accessToken) {
      navigate("/admin/dashboard");
    }
  }, [accessToken, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Navigation />
      <Container
        component="main"
        maxWidth={false}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 4, md: 6 },
          mt: { xs: 2, sm: 3 },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            maxWidth: "500px",
            width: "100%",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 2,
              border: "1px solid rgba(255, 255, 255, 0.2)",
              pointerEvents: "none",
            },
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
            }}
          >
            <KeyIcon sx={{ color: "white", fontSize: 30 }} />
          </Box>
          <Typography
            component="h1"
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Verify OTP
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 4, fontSize: "0.875rem" }}
          >
            Enter the OTP sent to your email
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="OTP"
              name="otp"
              autoComplete="off"
              autoFocus
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setError(null);
              }}
              error={!!error}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                fontSize: "1.1rem",
                textTransform: "none",
                boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                "&:hover": {
                  boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                },
                "&.Mui-disabled": {
                  background: theme.palette.action.disabledBackground,
                },
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white",
                  }}
                />
              ) : (
                "Verify OTP"
              )}
            </Button>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Button
                color="primary"
                onClick={handleResendOTP}
                disabled={loading}
                sx={{
                  textTransform: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Resend OTP
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminOTP;
