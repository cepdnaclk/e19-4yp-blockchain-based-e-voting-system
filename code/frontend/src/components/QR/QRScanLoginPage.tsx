import { QrReader } from "@blackbox-vision/react-qr-reader";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../LoadingOverlay";

const QRScanLoginPage: React.FC = () => {
  const [votersSecretKey, setVotersSecretKey] = useState<string | null>(null);
  const [pollingStationSecretKey, setPollingStationSecretKey] = useState<
    string | null
  >(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const theme = useTheme();
  const navigate = useNavigate();

  const handleScan = (data: string | null) => {
    if (data) setScannedData(data);
  };

  useEffect(() => {
    if (!scannedData) return;

    if (step === 1 && !votersSecretKey) {
      setVotersSecretKey(scannedData);
      setStep(2);
      setScannedData(null);
    } else if (step === 2 && !pollingStationSecretKey) {
      if (scannedData === votersSecretKey) {
        return;
      }
      setPollingStationSecretKey(scannedData);
      setScannedData(null);
    }
  }, [scannedData, step, votersSecretKey, pollingStationSecretKey]);

  useEffect(() => {
    if (votersSecretKey && pollingStationSecretKey) {
      handleSubmit();
      setSubmitting(true);
    }
  }, [votersSecretKey, pollingStationSecretKey]);

  const handleSubmit = async () => {
    if (!votersSecretKey || !pollingStationSecretKey) return;
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
      console.error("Login error:", err);
    }
  };

  const handleReset = () => {
    setVotersSecretKey(null);
    setPollingStationSecretKey(null);
    setStep(1);
    setScannedData(null);
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
      <LoadingOverlay isLoading={submitting} message="Logging in..." />
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
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: "100%",
            textAlign: "center",
            position: "relative",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            <QrCodeScannerIcon sx={{ fontSize: 40, mb: -1, mr: 1 }} /> QR Code
            Login
          </Typography>
          {!(votersSecretKey && pollingStationSecretKey) ? (
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                {step === 1
                  ? "Please scan the first QR code (Voter's Secret Key)."
                  : "Please scan the second QR code (Polling Station Secret Key)."}
              </Typography>
              {!submitting && (
                <QrReader
                  constraints={{ facingMode: "environment" }}
                  onResult={(result) => {
                    if (result) handleScan(result.getText());
                  }}
                  videoContainerStyle={{ borderRadius: 8, overflow: "hidden" }}
                  videoStyle={{ width: "100%", height: "100%" }}
                  containerStyle={{ width: 320, height: 320, margin: "0 auto" }}
                />
              )}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </Box>
            </>
          ) : (
            ""
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default QRScanLoginPage;
