import HowToVoteIcon from "@mui/icons-material/HowToVote";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Paper,
  Radio,
  Toolbar,
  Typography,
  useTheme,
  Zoom,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay";
import SuccessOverlay from "./SuccessOverlay";

interface Candidate {
  id: number;
  name: string;
  partyId: number;
  electionId: number;
  image_url: string;
  candidateNumber: number;
  votes?: number;
  percentage?: number;
  partyName?: string;
  electionName?: string;
}

interface Party {
  partyId: number;
  partyName: string;
}

interface Election {
  id: number;
  name: string;
}

interface ElectionsFetchResponse {
  id: number;
  name: string;
  startDateTime: Date;
  endDateTime: Date;
}

interface PartiesFetchResponse {
  id: number;
  name: string;
  symbol: string;
  electionId: number;
}

interface CandidateRes {
  id: number;
  address: string;
  birthday: string;
  email: string;
  mobileNumber: string;
  name: string;
  partyId: number;
  photo: string;
  status: "active" | "inactive";
  candidateNumber: number;
  electionId: number;
  createdAt: string;
}

const UserDashboard: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoadingCandidate, setIsLoadingCandidate] = useState(false);
  const [isLoadingVoteCasting, setIsLoadingVoteCasting] = useState(false);
  const [activeElections, setActiveElections] = useState<Election[]>([]);
  const [activeParties, setActiveParties] = useState<Party[]>([]);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (activeElections.length > 0) {
      fetchParties();
    } else {
      setIsLoadingCandidate(false);
    }
  }, [activeElections]);

  useEffect(() => {
    if (activeParties.length > 0) {
      fetchCandidates();
    } else {
      setIsLoadingCandidate(false);
    }
  }, [activeParties]);

  const fetchCandidates = async () => {
    try {
      setIsLoadingCandidate(true);
      setError(null);
      const response: { data: { message: string; data: CandidateRes[] } } =
        await axios.get("http://localhost:5000/api/votes/candidates");
      const data: CandidateRes[] = response.data.data;
      const activeCandidates = data.filter((candidate) =>
        activeElections.some(
          (election) => Number(election.id) === Number(candidate.electionId)
        )
      );
      const candidates: Candidate[] = activeCandidates.map(
        (candidate: CandidateRes) => ({
          id: candidate.id,
          name: candidate.name,
          partyId: candidate.partyId,
          electionId: candidate.electionId,
          partyName:
            activeParties.find(
              (party) => Number(party.partyId) === Number(candidate.partyId)
            )?.partyName || "N/A",
          electionName:
            activeElections.find(
              (election) => Number(election.id) === Number(candidate.electionId)
            )?.name || "N?A",
          image_url: candidate.photo,
          candidateNumber: candidate.candidateNumber,
        })
      );
      setCandidates(candidates);
      if (candidates.length > 0) {
        setSelectedCandidate(candidates[0]);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Failed to fetch candidates. Please try again later.");
    } finally {
      setIsLoadingCandidate(false);
    }
  };

  const fetchElections = async () => {
    try {
      setIsLoadingCandidate(true);
      setError(null);
      const response: {
        status: number;
        data: { message: string; data: ElectionsFetchResponse[] };
      } = await axios.get("http://localhost:5000/api/votes/elections");

      if (response && response.status === 200) {
        const activeElections: Election[] = response.data.data
          .filter(
            (election) =>
              new Date(election.startDateTime) <= new Date() &&
              new Date(election.endDateTime) >= new Date()
          )
          .map((election) => ({ id: election.id, name: election.name }));
        setActiveElections(activeElections);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    }
  };

  const fetchParties = async () => {
    try {
      setIsLoadingCandidate(true);
      setError(null);
      const response: {
        status: number;
        data: { message: string; data: PartiesFetchResponse[] };
      } = await axios.get("http://localhost:5000/api/votes/parties");

      if (response && response.status === 200) {
        const activeParties: Party[] = response.data.data
          .filter((party) =>
            activeElections.some(
              (election) => Number(election.id) === Number(party.electionId)
            )
          )
          .map((party) => ({ partyId: party.id, partyName: party.name }));
        setActiveParties(activeParties);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleCastVote = async () => {
    if (!selectedCandidate) {
      setError("Please select a candidate.");
      return;
    }
    const votersSecretKey = localStorage.getItem("votersSecretKey");
    if (!votersSecretKey) {
      setError("You must be logged in to vote.");
      return;
    }
    try {
      setError(null);
      setOpenDialog(false);
      setIsLoadingVoteCasting(true);

      const response: {
        status: number;
        data: { message: string; data: { secretKeyHash: string } };
      } = await axios.post("http://localhost:5000/api/votes/cast", {
        candidateId: selectedCandidate.id,
        secretKeyHash: votersSecretKey,
      });

      if (response.status === 201 && response.data.data) {
        setShowSuccessOverlay(true);
      }
    } catch (err) {
      console.error("Error casting vote:", err);
      setError("Failed to cast vote. Please try again later.");
    } finally {
      setIsLoadingVoteCasting(false);
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
      <LoadingOverlay
        isLoading={isLoadingCandidate}
        message="Loading candidates..."
      />
      <LoadingOverlay
        isLoading={isLoadingVoteCasting}
        message="Casting Vote..."
      />
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
            Chain Vote - E-Voting System
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flex: 1, mt: 8 }}>
        <Container
          maxWidth={false}
          sx={{
            position: "relative",
            zIndex: 1,
            width: "70%",
            margin: "0 auto",
            mt: 3,
            mb: 4,
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

              {showSuccessOverlay && (
                <SuccessOverlay
                  open={showSuccessOverlay}
                  onLogout={handleLogout}
                  message="Your vote has been cast successfully."
                />
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
                                    {`Candidate Number - ${candidate.candidateNumber}  |  Party - ${candidate.partyName} | Election - ${candidate.electionName}`}
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
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Avatar
                        src={selectedCandidate.image_url}
                        sx={{ width: 80, height: 80, mb: 1 }}
                      />
                      <Typography variant="subtitle1">
                        {selectedCandidate.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {`Candidate Number - ${selectedCandidate.candidateNumber}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {`Party - ${selectedCandidate.partyName}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {`Election - ${selectedCandidate.electionName}`}
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
          )
        </Container>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Your Vote</DialogTitle>
        <DialogContent>
          {selectedCandidate && (
            <Typography>
              Are you sure you want to vote for{" "}
              <strong>{selectedCandidate.name}</strong> under{" "}
              <strong>{selectedCandidate.partyName}</strong> with candidate
              <strong>
                {" "}
                Number{selectedCandidate.candidateNumber}
              </strong> for <strong>{selectedCandidate.electionName}</strong>?
              This action cannot be undone.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCastVote} color="primary" variant="contained">
            Confirm Vote
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDashboard;
