import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Navigation component for top navigation bar
import Navigation from "./Navigation";

const UserLogin: React.FC = () => {
  const [votersSecretKey, setVotersSecretKey] = useState("");
  const [pollingStationSecretKey, setPollingStationSecretKey] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);

  // Function to handle form submission (login logic)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null); // Reset error state
      // Make POST request to backend API with secretKey
      const response: { status: number; data: { message: string } } =
        await axios.post("http://localhost:5000/api/voter/login", {
          votersKey: votersSecretKey,
          pollingStationKey: pollingStationSecretKey,
        });

      if (response.status === 200 && response.data) {
        localStorage.setItem("votersSecretKey", String(response.data.message));
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    // Full-screen background with radial and linear gradient
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
          mt: { xs: 2, sm: 3 }, // Add margin top to account for navigation
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
              mb: 2,
              boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
            }}
          >
            <LockOutlinedIcon sx={{ color: "white", fontSize: 30 }} />
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
            Welcome
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            sx={{
              mb: 2,
              fontWeight: 400,
            }}
          >
            Enter your secret key to access the voting system
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="votersSecretKey"
              label="Voters Secret Key"
              name="votersSecretKey"
              type="password"
              autoComplete="off"
              autoFocus
              value={votersSecretKey}
              onChange={(e) => setVotersSecretKey(e.target.value)}
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="pollingStationSecretKey"
              label="Polling StationSecret Key"
              name="pollingStationSecretKey"
              type="password"
              autoComplete="off"
              value={pollingStationSecretKey}
              onChange={(e) => setPollingStationSecretKey(e.target.value)}
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
              size="large"
              sx={{
                mt: 2,
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
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserLogin;
