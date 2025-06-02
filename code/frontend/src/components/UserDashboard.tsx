import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Radio,
  Alert,
  useTheme,
  Card,
  CardContent,
  Fade,
  Zoom,
  Avatar,
  Stack,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Navigation from "./Navigation";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

interface Candidate {
  id: number;
  name: string;
  party: string;
  position: string;
  image_url: string;
}

interface VoteResponse {
  message: string;
  voter: {
    id: number;
    voter_id: string;
    name: string;
    has_voted: boolean;
  };
}

interface UserProfile {
  name: string;
  email: string;
  voterId: string;
  address: string;
  registrationDate: string;
  votingHistory: {
    election: string;
    date: string;
    status: string;
  }[];
}

const defaultUserProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  voterId: "VOTER12345",
  address: "123 Main St, City, Country",
  registrationDate: "2023-01-01",
  votingHistory: [
    { election: "Presidential 2023", date: "2023-02-15", status: "Voted" },
    { election: "Local 2022", date: "2022-08-10", status: "Voted" },
  ],
};

const UserDashboard: React.FC = () => {
  const [userProfile, setUserProfile] =
    useState<UserProfile>(defaultUserProfile);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentView, setCurrentView] = useState<
    "vote" | "profile" | "results"
  >("vote");
  const [electionEnded, setElectionEnded] = useState(false);
  const [votedCandidate, setVotedCandidate] = useState<Candidate | null>(null);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/votes/candidates"
      );
      setCandidates((response.data as { candidates: Candidate[] }).candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Failed to fetch candidates. Please try again later.");
    }
  };

  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setOpenDialog(true);
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;

    try {
      const voterId = localStorage.getItem("voterId"); // Assuming voter ID is stored in localStorage
      if (!voterId) {
        setError("Voter ID not found. Please login again.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/votes/cast",
        {
          candidate_id: selectedCandidate.id,
          voter_id: voterId,
        }
      );

      if (
        response.data &&
        (response.data as { message?: string }).message ===
          "Vote cast successfully"
      ) {
        setVotedCandidate(selectedCandidate);
        setSuccess("Your vote has been cast!");
        setOpenDialog(false);
        setSelectedCandidate(null);
      } else {
        setError((response.data as any)?.error || "Failed to cast vote.");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Failed to cast vote. Please try again."
      );
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCandidate(null);
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleViewResults = () => {
    setCurrentView("results");
  };

  const handleProfile = () => {
    setCurrentView("profile");
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logout clicked");
    navigate("/");
  };

  const handleCastVote = async () => {
    if (!selectedCandidate) {
      setError("Please select a candidate.");
      return;
    }
    const voterId = localStorage.getItem("voterId");
    if (!voterId) {
      setError("You must be logged in to vote.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/votes/cast",
        {
          candidate_id: selectedCandidate.id,
          voter_id: voterId,
        }
      );
      const data = response.data as { message?: string; error?: string };
      if (data && data.message === "Vote cast successfully") {
        setVotedCandidate(selectedCandidate);
        setSuccess("Your vote has been cast!");
        setOpenDialog(false);
        setSelectedCandidate(null);
      } else {
        setError(data?.error || "Failed to cast vote.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to cast vote. Please try again later."
      );
    }
  };

  const sidePanelItems = [
    {
      text: "Cast Vote",
      icon: <HowToVoteIcon />,
      onClick: () => setCurrentView("vote"),
    },
    { text: "View Profile", icon: <PersonIcon />, onClick: handleProfile },
    {
      text: "View Results",
      icon: <BarChartIcon />,
      onClick: handleViewResults,
    },
    { text: "Logout", icon: <LogoutIcon />, onClick: handleLogout },
  ];

  const renderProfileView = () => (
    <Fade in timeout={800}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, md: 3 },
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <PersonIcon
            sx={{ fontSize: 32, color: theme.palette.primary.main }}
          />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            Your Profile
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">{userProfile.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{userProfile.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Voter ID
                    </Typography>
                    <Typography variant="body1">
                      {userProfile.voterId}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {userProfile.address}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Registration Date
                    </Typography>
                    <Typography variant="body1">
                      {userProfile.registrationDate}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Voting History
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Election</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userProfile.votingHistory.map((history, index) => (
                        <TableRow key={index}>
                          <TableCell>{history.election}</TableCell>
                          <TableCell>{history.date}</TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                color:
                                  history.status === "Voted"
                                    ? "success.main"
                                    : "error.main",
                                fontWeight: 600,
                              }}
                            >
                              {history.status}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Fade>
  );

  const renderResultsView = () => (
    <Fade in timeout={800}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, md: 3 },
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <BarChartIcon
            sx={{ fontSize: 32, color: theme.palette.primary.main }}
          />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            {electionEnded ? "Election Results" : "Your Vote Status"}
          </Typography>
        </Box>

        {electionEnded ? (
          // Show final results when election has ended
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Party</TableCell>
                  <TableCell align="right">Votes</TableCell>
                  <TableCell align="right">Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={result.image_url}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Typography>{result.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{result.party}</TableCell>
                    <TableCell align="right">{result.votes}</TableCell>
                    <TableCell align="right">{result.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          // Show vote status and waiting message when election is ongoing
          <Box sx={{ textAlign: "center", py: 4 }}>
            {success ? (
              <>
                <CheckCircleIcon
                  sx={{
                    fontSize: 64,
                    color: "success.main",
                    mb: 2,
                  }}
                />
                <Typography variant="h6" color="success.main" gutterBottom>
                  {success}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Thank you for participating in the election.
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="center"
                >
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleReturnHome}
                    startIcon={<HomeIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      px: 3,
                      py: 1,
                      borderWidth: 2,
                      "&:hover": {
                        borderWidth: 2,
                      },
                    }}
                  >
                    Return Home
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleViewResults}
                    startIcon={<BarChartIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      px: 3,
                      py: 1,
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    View Results
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Election in Progress
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  The election is currently ongoing. Cast your vote to
                  participate in the democratic process.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setCurrentView("vote")}
                  startIcon={<HowToVoteIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  Cast Your Vote
                </Button>
              </>
            )}
            <Box
              sx={{
                mt: 4,
                p: 3,
                background: "rgba(0, 0, 0, 0.02)",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Final Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The final results will be displayed here once the election
                period ends.
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Fade>
  );

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
      <AppBar
        position="fixed"
        sx={{
          background: theme.palette.primary.main,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: "white",
            }}
          >
            Blockchain-Based E-Voting System
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flex: 1, mt: 8 }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderRight: "1px solid rgba(255, 255, 255, 0.12)",
              mt: 8,
            },
          }}
        >
          <Box sx={{ overflow: "auto" }}>
            <List>
              {sidePanelItems.map((item, index) => (
                <React.Fragment key={item.text}>
                  <ListItem
                    button
                    onClick={item.onClick}
                    selected={
                      currentView === item.text.toLowerCase().replace(" ", "")
                    }
                  >
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                  {index < sidePanelItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Drawer>

        <Container
          maxWidth={false}
          sx={{
            mt: 4,
            mb: 4,
            position: "relative",
            zIndex: 1,
            ml: 4,
            mr: 4,
            maxWidth: "1200px !important",
          }}
        >
          {currentView === "vote" && (
            <Fade in timeout={800}>
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 2, md: 3 },
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    gap: 2,
                  }}
                >
                  <HowToVoteIcon
                    sx={{ fontSize: 32, color: theme.palette.primary.main }}
                  />
                  <Typography
                    variant="h5"
                    component="h1"
                    align="center"
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      backgroundClip: "text",
                      textFillColor: "transparent",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Cast Your Vote
                  </Typography>
                </Box>

                {error && (
                  <Zoom in>
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  </Zoom>
                )}

                {success && (
                  <Zoom in>
                    <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                      {success}
                    </Alert>
                  </Zoom>
                )}

                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    height: "calc(100vh - 200px)",
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        mb: 2,
                      }}
                    >
                      Select a Candidate
                    </Typography>
                    <Box
                      sx={{
                        maxHeight: 400,
                        overflowY: "auto",
                        background: "#fff",
                        borderRadius: 2,
                        boxShadow: 2,
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <RadioGroup
                        value={selectedCandidate ? selectedCandidate.id : ""}
                        onChange={(_, value) => {
                          const candidate = candidates.find(
                            (c) => c.id === Number(value)
                          );
                          setSelectedCandidate(candidate || null);
                        }}
                      >
                        {candidates.map((candidate) => (
                          <Box
                            key={candidate.id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                              p: 1,
                              borderRadius: 2,
                              transition: "background 0.2s",
                              background:
                                selectedCandidate?.id === candidate.id
                                  ? "rgba(25, 118, 210, 0.08)"
                                  : "transparent",
                              "&:hover": {
                                background: "rgba(25, 118, 210, 0.12)",
                              },
                            }}
                          >
                            <FormControlLabel
                              value={candidate.id}
                              control={<Radio color="primary" />}
                              label={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Avatar
                                    src={candidate.image_url}
                                    alt={candidate.name}
                                    sx={{ width: 48, height: 48 }}
                                  />
                                  <Box>
                                    <Typography fontWeight={600}>
                                      {candidate.name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {candidate.party} — {candidate.position}
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                              sx={{ flex: 1, m: 0 }}
                            />
                          </Box>
                        ))}
                      </RadioGroup>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: 200,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      background: "rgba(255, 255, 255, 0.5)",
                      backdropFilter: "blur(10px)",
                      height: "fit-content",
                      alignSelf: "center",
                      position: "sticky",
                      top: "60%",
                      transform: "translateY(-50%)",
                      mt: 4,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                      }}
                    >
                      Your Vote
                    </Typography>
                    {selectedCandidate && (
                      <Box sx={{ textAlign: "center" }}>
                        <Avatar
                          src={selectedCandidate.image_url}
                          sx={{ width: 80, height: 80, mb: 1 }}
                        />
                        <Typography variant="subtitle1">
                          {selectedCandidate.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedCandidate.party}
                        </Typography>
                      </Box>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={!selectedCandidate}
                      onClick={() => setOpenDialog(true)}
                      sx={{ mt: 2, borderRadius: 2, fontWeight: 600 }}
                    >
                      Confirm Vote
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Fade>
          )}
          {currentView === "profile" && renderProfileView()}
          {currentView === "results" && renderResultsView()}
          {votedCandidate && (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <CheckCircleIcon
                sx={{ fontSize: 64, color: "success.main", mb: 2 }}
              />
              <Typography variant="h5" color="success.main" gutterBottom>
                Thank you for voting!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                You have voted for:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={votedCandidate.image_url}
                  alt={votedCandidate.name}
                  sx={{ width: 80, height: 80, mb: 1 }}
                />
                <Typography variant="h6">{votedCandidate.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {votedCandidate.party} — {votedCandidate.position}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 4 }}
                onClick={() => navigate("/")}
              >
                Return Home
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Your Vote</DialogTitle>
        <DialogContent>
          {selectedCandidate && (
            <Typography>
              Are you sure you want to vote for {selectedCandidate.name} (
              {selectedCandidate.party})? This action cannot be undone.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmVote}
            color="primary"
            variant="contained"
          >
            Confirm Vote
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDashboard;
