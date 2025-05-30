import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Radio,
  Alert,
  useTheme,
} from "@mui/material";
import Navigation from "./Navigation";

// Temporary mock data - replace with actual data from your backend
const mockCandidates = [
  { id: 1, name: "John Doe", party: "Party A" },
  { id: 2, name: "Jane Smith", party: "Party B" },
  { id: 3, name: "Mike Johnson", party: "Party C" },
];

const UserDashboard: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

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
        overflow: "auto",
      }}
    >
      <Navigation />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 4 }}
          >
            Cast Your Vote
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {voted ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your vote has been successfully recorded!
            </Alert>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Select a Candidate
              </Typography>
              <List>
                {mockCandidates.map((candidate) => (
                  <ListItem
                    key={candidate.id}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      mb: 1,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <ListItemText
                      primary={candidate.name}
                      secondary={`Party: ${candidate.party}`}
                    />
                    <ListItemSecondaryAction>
                      <Radio
                        edge="end"
                        checked={selectedCandidate === candidate.id}
                        onChange={() => setSelectedCandidate(candidate.id)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleVote}
                  disabled={!selectedCandidate}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                  }}
                >
                  Submit Vote
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default UserDashboard;
