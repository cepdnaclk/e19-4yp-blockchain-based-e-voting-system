import React, { useState } from "react";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { Box, Button, Container, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const QRScanLoginPage: React.FC = () => {
  const [votersSecretKey, setVotersSecretKey] = useState<string | null>(null);
  const [pollingStationSecretKey, setPollingStationSecretKey] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleScan = (data: string | null) => {
    setLoading(false);
    if (!data) return;
    if (step === 1) {
      setVotersSecretKey(data);
      setStep(2);
      setLoading(true);
    } else if (step === 2) {
      setPollingStationSecretKey(data);
    }
  };

  const handleSubmit = async () => {
    if (!votersSecretKey || !pollingStationSecretKey) return;
    setSubmitting(true);
    setError(null);
    try {
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
      setError("Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setVotersSecretKey(null);
    setPollingStationSecretKey(null);
    setStep(1);
    setError(null);
    setLoading(true);
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
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <Paper elevation={6} sx={{ p: 4, width: "100%", textAlign: "center", position: "relative" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            <QrCodeScannerIcon sx={{ fontSize: 40, mb: -1, mr: 1 }} /> QR Code Login
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {submitting && (
            <Box sx={{ mb: 2 }}>
              <CircularProgress color="primary" />
              <Typography variant="body2" sx={{ mt: 1 }}>Logging in...</Typography>
            </Box>
          )}
          {!submitting && !pollingStationSecretKey ? (
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                {step === 1 ? "Scan Voter's Secret Key QR Code" : "Scan Polling Station Secret Key QR Code"}
              </Typography>
              {loading && (
                <Box sx={{ mb: 2 }}>
                  <CircularProgress color="primary" />
                  <Typography variant="body2" sx={{ mt: 1 }}>Initializing camera...</Typography>
                </Box>
              )}
              <QrReader
                constraints={{ facingMode: "environment" }}
                onResult={(result, error) => {
                  setLoading(false);
                  if (!!result) handleScan(result.getText());
                  if (!!error && error.name !== "NotFoundException") setError("Camera error: " + error.message);
                }}
                videoContainerStyle={{ borderRadius: 8, overflow: "hidden" }}
                videoStyle={{ width: "100%", height: "100%" }}
                containerStyle={{ width: 320, height: 320, margin: "0 auto" }}
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" color="primary" onClick={handleReset}>
                  Reset
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>Scanned QR Codes:</Typography>
              <Paper variant="outlined" sx={{ p: 2, mt: 1, mb: 2, wordBreak: "break-all" }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Voter's Secret Key:</Typography>
                <pre style={{ margin: 0, fontFamily: "monospace" }}>{votersSecretKey}</pre>
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 2 }}>Polling Station Secret Key:</Typography>
                <pre style={{ margin: 0, fontFamily: "monospace" }}>{pollingStationSecretKey}</pre>
              </Paper>
              <Button
                variant="contained"
                color="primary"
                startIcon={<QrCodeScannerIcon />}
                onClick={handleSubmit}
                disabled={submitting}
                sx={{ mr: 2 }}
              >
                Login
              </Button>
              <Button variant="outlined" color="primary" onClick={handleReset}>
                Scan Again
              </Button>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default QRScanLoginPage; 