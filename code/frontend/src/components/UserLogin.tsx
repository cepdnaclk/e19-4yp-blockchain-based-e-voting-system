import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  useTheme,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Navigation from "./Navigation";

const UserLogin: React.FC = () => {
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  interface UserLoginResponse {
    voter_id: string | number;
    [key: string]: any;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post<UserLoginResponse>(
        "http://localhost:5000/api/voter/userlogin",
        {
          secretKey,
        }
      );
      if (response.data && response.data.voter_id) {
        localStorage.setItem("voterId", String(response.data.voter_id));
        navigate("/user/dashboard");
      } else {
        setError("Login failed: Unexpected response.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Login failed. Please check your secret key and try again."
      );
    }
  };

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
              mb: 3,
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
              mb: 4,
              fontWeight: 400,
            }}
          >
            Enter your secret key to access the voting system
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="secretKey"
              label="Secret Key"
              name="secretKey"
              type="password"
              autoComplete="off"
              autoFocus
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
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
              }}
            >
              Login
            </Button>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserLogin;
