import React, { useState } from "react";
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
} from "@mui/material";
import Navigation from "./Navigation";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

// Updated mock data with more candidates and professional images
const mockCandidates = [
  {
    id: 1,
    name: "John Doe",
    party: "Democratic Party",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    position: "Presidential Candidate",
  },
  {
    id: 2,
    name: "Jane Smith",
    party: "Republican Party",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    position: "Presidential Candidate",
  },
  {
    id: 3,
    name: "Mike Johnson",
    party: "Independent Party",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    position: "Presidential Candidate",
  },
  {
    id: 4,
    name: "Sarah Williams",
    party: "Green Party",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    position: "Presidential Candidate",
  },
  {
    id: 5,
    name: "David Chen",
    party: "Progressive Party",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    position: "Presidential Candidate",
  },
];

const UserDashboard: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError("Please select a candidate before voting");
      return;
    }

    try {
      // TODO: Implement actual voting logic with blockchain
      console.log("Voting for candidate:", selectedCandidate);
      setVoted(true);
      setError(null);
    } catch (err) {
      setError("Failed to submit vote. Please try again.");
    }
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleViewResults = () => {
    // TODO: Implement navigation to results page
    console.log("View results clicked");
  };

  const handleProfile = () => {
    // TODO: Implement profile view
    console.log("View profile clicked");
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logout clicked");
    navigate("/");
  };

  const sidePanelItems = [
    {
      text: "Cast Vote",
      icon: <HowToVoteIcon />,
      onClick: () => setDrawerOpen(false),
    },
    { text: "View Profile", icon: <PersonIcon />, onClick: handleProfile },
    {
      text: "View Results",
      icon: <BarChartIcon />,
      onClick: handleViewResults,
    },
    { text: "Logout", icon: <LogoutIcon />, onClick: handleLogout },
  ];

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
                  <ListItem button onClick={item.onClick}>
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

              {voted ? (
                <Zoom in>
                  <Box sx={{ textAlign: "center", py: 3 }}>
                    <CheckCircleIcon
                      sx={{ fontSize: 60, color: "success.main", mb: 2 }}
                    />
                    <Typography variant="h5" color="success.main" gutterBottom>
                      Vote Successfully Recorded!
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
                  </Box>
                </Zoom>
              ) : (
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
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
                    <Grid container spacing={1.5}>
                      {mockCandidates.map((candidate, index) => (
                        <Grid item xs={12} key={candidate.id}>
                          <Fade
                            in
                            timeout={300}
                            style={{ transitionDelay: `${index * 100}ms` }}
                          >
                            <Card
                              sx={{
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                border:
                                  selectedCandidate === candidate.id
                                    ? `2px solid ${theme.palette.primary.main}`
                                    : "1px solid",
                                borderColor:
                                  selectedCandidate === candidate.id
                                    ? theme.palette.primary.main
                                    : "divider",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                },
                              }}
                            >
                              <CardContent sx={{ p: 1.5 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Avatar
                                    src={candidate.image}
                                    sx={{ width: 48, height: 48 }}
                                  />
                                  <Box sx={{ flex: 1 }}>
                                    <Typography
                                      variant="subtitle1"
                                      component="div"
                                    >
                                      {candidate.name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {candidate.party}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {candidate.position}
                                    </Typography>
                                  </Box>
                                  <Radio
                                    checked={selectedCandidate === candidate.id}
                                    onChange={() =>
                                      setSelectedCandidate(candidate.id)
                                    }
                                    sx={{
                                      color: theme.palette.primary.main,
                                      "&.Mui-checked": {
                                        color: theme.palette.primary.main,
                                      },
                                    }}
                                  />
                                </Box>
                              </CardContent>
                            </Card>
                          </Fade>
                        </Grid>
                      ))}
                    </Grid>
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
                    {selectedCandidate ? (
                      <Box sx={{ textAlign: "center" }}>
                        <Avatar
                          src={
                            mockCandidates.find(
                              (c) => c.id === selectedCandidate
                            )?.image
                          }
                          sx={{ width: 80, height: 80, mb: 1 }}
                        />
                        <Typography variant="subtitle1">
                          {
                            mockCandidates.find(
                              (c) => c.id === selectedCandidate
                            )?.name
                          }
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {
                            mockCandidates.find(
                              (c) => c.id === selectedCandidate
                            )?.party
                          }
                        </Typography>
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                      >
                        Select a candidate to cast your vote
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleVote}
                      disabled={!selectedCandidate}
                      fullWidth
                      sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 600,
                        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                        },
                      }}
                    >
                      Submit Vote
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default UserDashboard;
