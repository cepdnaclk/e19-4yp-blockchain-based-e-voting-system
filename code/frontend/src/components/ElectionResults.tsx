import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  Alert,
  Avatar,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingOverlay from "./LoadingOverlay";

interface CandidateResult {
  id: number;
  name: string;
  partyName: string;
  candidateNumber: string;
  image_url: string;
  votes: number;
  percentage: number;
}

interface Election {
  id: number;
  name: string;
}

interface CandidateResponse {
  id: number;
  name: string;
  partyId: number;
  photo: string;
  candidateNumber: number;
  electionId: number;
}

interface Party {
  partyId: number;
  partyName: string;
}

const ElectionResults: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<CandidateResponse[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [selectedElection, setSelectedElection] = useState<number | null>(null);
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchCompletedElections();
    fetchCandidates();
    fetchParties();
  }, []);

  useEffect(() => {
    if (selectedElection !== null) {
      fetchResults();
    }
  }, [selectedElection]);

  const fetchCompletedElections = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: {
        status: number;
        data: {
          message: string;
          data: {
            id: number;
            name: string;
            startDateTime: Date;
            endDateTime: Date;
            createdAt: Date;
          }[];
        };
      } = await axios.get("http://localhost:5000/api/votes/elections");
      if (response.status === 200) {
        const completed = response.data.data.filter(
          (e) => new Date(e.endDateTime) < new Date()
        );
        setElections(completed.map((e) => ({ id: e.id, name: e.name })));
        if (completed.length > 0) {
          setSelectedElection(null);
        }
      }
    } catch (err) {
      console.error("Failed to fetch elections. ", err);
      setError("Failed to fetch elections.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCandidates = async () => {
    const response: {
      status: number;
      data: {
        message: string;
        data: {
          id: number;
          name: string;
          partyId: number;
          photo: string;
          candidateNumber: number;
          electionId: number;
        }[];
      };
    } = await axios.get("http://localhost:5000/api/votes/candidates");

    const candidates = response.data.data;
    setCandidates(candidates);
  };

  const fetchParties = async () => {
    const response: {
      status: number;
      data: {
        message: string;
        data: {
          id: number;
          name: string;
          symbol: string;
          electionId: number;
        }[];
      };
    } = await axios.get("http://localhost:5000/api/votes/parties");

    if (response && response.status === 200) {
      const activeParties: Party[] = response.data.data.map((party) => ({
        partyId: party.id,
        partyName: party.name,
      }));
      setParties(activeParties);
    }
  };

  const fetchResults = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: {
        status: number;
        data: {
          message: string;
          data: {
            candidateId: number;
            voteCount: number;
          }[];
        };
      } = await axios.get(`http://localhost:5000/api/results`);
      if (response.status === 200) {
        let totalVotes = 0;
        const results: CandidateResult[] = response.data.data.map((entry) => {
          totalVotes += Number(entry.voteCount);
          return {
            id: entry.candidateId,
            name: "",
            votes: entry.voteCount,
            candidateNumber: "",
            image_url: "",
            partyName: "",
            percentage: 0,
          };
        });

        console.log(totalVotes);
        results.forEach((entry) => {
          const candidate = candidates.find(
            (c) => Number(c.id) === Number(entry.id)
          );
          entry.name = candidate?.name || "";
          entry.candidateNumber = candidate?.candidateNumber.toString() || "";
          entry.image_url = candidate?.photo || "";
          entry.partyName =
            parties.find(
              (p) => Number(p.partyId) === Number(candidate?.partyId)
            )?.partyName || "";
          entry.percentage = (Number(entry.votes) / Number(totalVotes)) * 100;
        });
        setResults(results);
      } else {
        setResults([]);
        setError("No results found for this election.");
      }
    } catch (err) {
      console.error("Failed to fetch results, ", err);
      setError("Failed to fetch results.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const winner =
    results.length > 0
      ? results.reduce((prev, curr) => (curr.votes > prev.votes ? curr : prev))
      : null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        py: 6,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          mt: 6,
          p: { xs: 2, md: 4 },
          minWidth: { xs: 350, md: 600 },
          borderRadius: 3,
          background: "rgba(255,255,255,0.97)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight={700}
          sx={{ mb: 3, color: theme.palette.primary.main }}
        >
          Election Results
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="select-election-label">Select Election</InputLabel>
          <Select
            labelId="select-election-label"
            value={selectedElection ?? ""}
            label="Select Election"
            onChange={(e) => setSelectedElection(Number(e.target.value))}
            disabled={isLoading || elections.length === 0}
          >
            {elections.map((e) => (
              <MenuItem key={e.id} value={e.id}>
                {e.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {isLoading ? (
          <LoadingOverlay isLoading={isLoading} message="Loading..." />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : results.length === 0 && selectedElection ? (
          <Typography align="center" color="text.secondary">
            No results to display.
          </Typography>
        ) : selectedElection ? (
          <>
            {winner && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 4,
                  gap: 3,
                  p: 2,
                  background: "rgba(25, 118, 210, 0.08)",
                  borderRadius: 2,
                }}
              >
                <EmojiEventsIcon
                  sx={{ fontSize: 48, color: theme.palette.success.main }}
                />
                <Avatar
                  src={winner.image_url}
                  sx={{ width: 72, height: 72, mr: 2 }}
                />
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {winner.name} (#{winner.candidateNumber})
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {winner.partyName}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    Votes: {winner.votes} ({winner.percentage.toFixed(2)}%)
                  </Typography>
                </Box>
              </Box>
            )}
            <TableContainer
              component={Paper}
              sx={{ mt: 2, background: "rgba(255,255,255,0.92)" }}
            >
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
                  {results.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            src={c.image_url}
                            sx={{ width: 40, height: 40 }}
                          />
                          <Box>
                            <Typography fontWeight={600}>{c.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              #{c.candidateNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{c.partyName}</TableCell>
                      <TableCell align="right">{c.votes}</TableCell>
                      <TableCell align="right">
                        {c.percentage.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          ""
        )}
      </Paper>
    </Box>
  );
};

export default ElectionResults;
