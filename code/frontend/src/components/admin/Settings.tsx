import React, { useState } from "react";
import { Box, FormControlLabel, Switch, Paper, Typography, MenuItem, Select, FormControl, InputLabel, Stack, TextField, Slider, Checkbox, Divider } from "@mui/material";
import { useFetch } from "../../hooks/useFetch";

const Settings: React.FC = () => {
  const [allowVerifyVotes, setAllowVerifyVotes] = useState(false);
  const [enableMaintenance, setEnableMaintenance] = useState(false);
  const [defaultUserRole, setDefaultUserRole] = useState("Voter");
  const [supportEmail, setSupportEmail] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [theme, setTheme] = useState("System");
  const { sendRequest } = useFetch({});

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setAllowVerifyVotes(newValue);
    try {
      const response = await sendRequest({
        url: "https://dummy.api/allow-verify-votes",
        options: {
          method: "POST",
          body: { allowVerifyVotes: newValue.toString() },
        },
      });
      console.log("Backend response:", response);
    } catch (error) {
      console.error("Backend error:", error);
    }
  };

  return (
    <Box sx={{ p: 3, width: '100%', flex: 1 }}>
      <Paper sx={{ p: 4, width: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={4}>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>Voting & Access</Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={allowVerifyVotes}
                    onChange={handleToggle}
                    color="primary"
                  />
                }
                label="Allow users to verify votes"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={enableMaintenance}
                    onChange={e => setEnableMaintenance(e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable maintenance mode"
              />
              <FormControl fullWidth>
                <InputLabel id="default-user-role-label">Default user role</InputLabel>
                <Select
                  labelId="default-user-role-label"
                  value={defaultUserRole}
                  label="Default user role"
                  onChange={e => setDefaultUserRole(e.target.value)}
                >
                  <MenuItem value="Voter">Voter</MenuItem>
                  <MenuItem value="Observer">Observer</MenuItem>
                  <MenuItem value="Auditor">Auditor</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>System & Notifications</Typography>
            <Stack spacing={2}>
              <TextField
                label="Support email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                fullWidth
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={emailNotifications}
                    onChange={e => setEmailNotifications(e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable email notifications"
              />
              <Box>
                <Typography gutterBottom>Session timeout (minutes)</Typography>
                <Slider
                  value={sessionTimeout}
                  onChange={(_, v) => setSessionTimeout(v as number)}
                  min={5}
                  max={120}
                  step={5}
                  valueLabelDisplay="auto"
                  sx={{ maxWidth: 300 }}
                />
              </Box>
              <FormControl fullWidth>
                <InputLabel id="theme-label">Theme</InputLabel>
                <Select
                  labelId="theme-label"
                  value={theme}
                  label="Theme"
                  onChange={e => setTheme(e.target.value)}
                >
                  <MenuItem value="Light">Light</MenuItem>
                  <MenuItem value="Dark">Dark</MenuItem>
                  <MenuItem value="System">System</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Settings; 