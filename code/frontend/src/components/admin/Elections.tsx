import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState, useEffect } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFetch } from "../../hooks/useFetch";
import { useToast } from "../../context/ToastContext";

interface Election {
  id: number;
  name: string;
  start_date_time: Date;
  end_date_time: Date;
  status?: "active" | "pending" | "completed";
  candidate_count?: number;
  vote_count?: number;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

const Elections: React.FC = () => {
  const theme = useTheme();
  const { showToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [elections, setElections] = useState<Election[]>([]);
  const [electionData, setElectionData] = useState({
    name: "",
    startDate: new Date(),
    startTime: new Date(),
    endDate: new Date(),
    endTime: new Date(),
  });
  const { sendRequest } = useFetch({
    setLoading: setIsLoading,
  });

  // Fetch elections on component mount
  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await sendRequest({
        url: `${baseUrl}/api/admin/election/list`,
        options: {
          method: "GET",
        },
      });

      if (response && response.status === 200) {
        const electionsData: Election[] = response.data.data.map(
          (election: any) => ({
            id: election.id,
            name: election.name,
            start_date_time: new Date(election.start_date_time),
            end_date_time: new Date(election.end_date_time),
            status:
              new Date() > new Date(election.end_date_time)
                ? "completed"
                : new Date() < new Date(election.start_date_tine)
                ? "pending"
                : "active",
            candidate_count: election.candidate_count || 0,
            vote_count: election.vote_count || 0,
          })
        );
        setElections(electionsData);
      }
    } catch (error) {
      console.error("Error fetching elections:", error);
      showToast("Failed to fetch elections. Please try again.", "error");
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateElection = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setElectionData({
      name: "",
      startDate: new Date(),
      startTime: new Date(),
      endDate: new Date(),
      endTime: new Date(),
    });
  };

  const handleSubmit = async () => {
    // Validate form data
    if (!electionData.name.trim()) {
      showToast("Please enter an election name.", "error");
      return;
    }

    if (electionData.startDate >= electionData.endDate) {
      showToast("End date must be after start date.", "error");
      return;
    }

    // Combine date and time for start and end
    const startDateTime = new Date(
      electionData.startDate.getFullYear(),
      electionData.startDate.getMonth(),
      electionData.startDate.getDate(),
      electionData.startTime.getHours(),
      electionData.startTime.getMinutes()
    );

    const endDateTime = new Date(
      electionData.endDate.getFullYear(),
      electionData.endDate.getMonth(),
      electionData.endDate.getDate(),
      electionData.endTime.getHours(),
      electionData.endTime.getMinutes()
    );

    try {
      setIsLoading(true);
      const response: { status: number; data: { message: string } } =
        await sendRequest({
          url: `${baseUrl}/api/admin/election/create`,
          options: {
            method: "POST",
            body: {
              name: electionData.name,
              startDateTime: startDateTime.toISOString(),
              endDateTime: endDateTime.toISOString(),
            },
          },
        });

      if (response && response.status === 201) {
        showToast("Election created successfully!", "success");
        handleCloseDialog();
      }
    } catch {
      showToast("Failed to create election. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return theme.palette.success.main;
      case "pending":
        return theme.palette.warning.main;
      case "completed":
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const ElectionList: React.FC<{ elections: Election[] }> = ({ elections }) => (
    <List>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading elections...
          </Typography>
        </Box>
      ) : elections.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            color: "text.secondary",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            No Elections Found
          </Typography>
          <Typography variant="body2">
            There are no elections in this category at the moment.
          </Typography>
        </Box>
      ) : (
        elections.map((election) => (
          <Paper
            key={election.id}
            elevation={1}
            sx={{
              mb: 2,
              p: 2,
              cursor: "pointer",
              "&:hover": {
                bgcolor: "action.hover",
                transform: "translateY(-2px)",
                transition: "transform 0.2s ease-in-out",
              },
            }}
            onClick={() => setSelectedElection(election)}
          >
            <ListItem
              secondaryAction={
                election.status === "pending" && (
                  <Box>
                    <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6">{election.name}</Typography>
                    <Chip
                      label={
                        election.status?.charAt(0).toUpperCase() +
                        election.status?.slice(1)
                      }
                      size="medium"
                      sx={{
                        bgcolor: `${getStatusColor(election.status || "")}15`,
                        color: getStatusColor(election.status || ""),
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Start: {election.start_date_time.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      End: {election.end_date_time.toLocaleString()}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          </Paper>
        ))
      )}
    </List>
  );

  const ElectionDetails: React.FC<{ election: Election }> = ({ election }) => (
    <Box sx={{ p: 3 }}>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading election details...
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton
              onClick={() => setSelectedElection(null)}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {election.name}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Overall Progress */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Overall Voting Progress
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mr: 2 }}
                    >
                      {election.vote_count} / {election.candidate_count} votes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(
                        (election.vote_count / election.candidate_count) *
                        100
                      ).toFixed(1)}
                      %
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (election.vote_count / election.candidate_count) * 100
                    }
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Polling Station Progress */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Polling Station Progress
                  </Typography>
                  {/* Add polling station progress display logic here */}
                </CardContent>
              </Card>
            </Grid>

            {/* Voting Trends */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Real-time Voting Trends
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="votes"
                          stroke={theme.palette.primary.main}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 3,
        "& button:focus, & button:focus-visible": {
          outline: "none",
        },
      }}
    >
      {!selectedElection ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "end", mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateElection}
              disabled={isLoading}
            >
              Create Election
            </Button>
          </Box>

          <Paper
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                },
              }}
            >
              <Tab label="Active Elections" />
              <Tab label="Pending Elections" />
              <Tab label="Completed Elections" />
            </Tabs>
            <Box sx={{ p: 3, flexGrow: 1, overflow: "auto" }}>
              {tabValue === 0 && (
                <ElectionList
                  elections={elections.filter((e) => e.status === "active")}
                />
              )}
              {tabValue === 1 && (
                <ElectionList
                  elections={elections.filter((e) => e.status === "pending")}
                />
              )}
              {tabValue === 2 && (
                <ElectionList
                  elections={elections.filter((e) => e.status === "completed")}
                />
              )}
            </Box>
          </Paper>
        </>
      ) : (
        <ElectionDetails election={selectedElection} />
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Election</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Election Name"
                  value={electionData.name}
                  onChange={(e) =>
                    setElectionData({ ...electionData, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  Start Date & Time
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Start Date"
                        value={electionData.startDate}
                        onChange={(date: Date | null) =>
                          setElectionData({
                            ...electionData,
                            startDate: date || new Date(),
                          })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileTimePicker
                        label="Start Time"
                        value={electionData.startTime}
                        onChange={(time: Date | null) =>
                          setElectionData({
                            ...electionData,
                            startTime: time || new Date(),
                          })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  End Date & Time
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="End Date"
                        value={electionData.endDate}
                        onChange={(date: Date | null) =>
                          setElectionData({
                            ...electionData,
                            endDate: date || new Date(),
                          })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileTimePicker
                        label="End Time"
                        value={electionData.endTime}
                        onChange={(time: Date | null) =>
                          setElectionData({
                            ...electionData,
                            endTime: time || new Date(),
                          })
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!electionData.name}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Elections;
