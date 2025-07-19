import AddCircleIcon from "@mui/icons-material/AddCircle";
import QrCodeIcon from "@mui/icons-material/QrCode";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { generateAndDownloadQRCode } from "../../utils/qrCodeGeneration";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

const UserRegistration: React.FC = () => {
  const [votersSecretKey, setVotersSecretKey] = useState<string>("");
  const [pollingStationSecretKey, setPollingStationSecretKey] =
    useState<string>("");
  const theme = useTheme();

  const handleDownload = (key: string, label: string) => {
    generateAndDownloadQRCode(key, label.replace(/\s+/g, "_"));
  };

  const handleGenerate = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/voter/registration`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: {
        message: string;
        data: {
          votersKey: string;
          pollingStationKey: string;
        };
      } = await response.json();
      setVotersSecretKey(data.data.votersKey);
      setPollingStationSecretKey(data.data.pollingStationKey);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 600,
          boxShadow: 3,
          position: "relative",
        }}
      >
        <Stack spacing={3}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              User Registration
            </Typography>
            <Tooltip title="Generate new secret keys">
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerate}
                size="large"
                startIcon={<AddCircleIcon />}
                sx={{
                  py: 1.2,
                  px: 3,
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
                Generate
              </Button>
            </Tooltip>
          </Box>
          <Divider />
          <Stack spacing={4}>
            <Box
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                background: theme.palette.background.default,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Voter's Secret Key
              </Typography>
              <TextField
                value={votersSecretKey}
                fullWidth
                disabled
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<QrCodeIcon />}
                  onClick={() =>
                    handleDownload(votersSecretKey, "Voters Secret Key")
                  }
                  sx={{ mt: 1, mb: 1 }}
                  disabled={!votersSecretKey}
                >
                  Download QR Code
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                background: theme.palette.background.default,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Polling Station Secret Key
              </Typography>
              <TextField
                value={pollingStationSecretKey}
                fullWidth
                disabled
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<QrCodeIcon />}
                  onClick={() =>
                    handleDownload(
                      pollingStationSecretKey,
                      "Polling Station Secret Key"
                    )
                  }
                  sx={{ mt: 1, mb: 1 }}
                  disabled={!pollingStationSecretKey}
                >
                  Download QR Code
                </Button>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default UserRegistration;
