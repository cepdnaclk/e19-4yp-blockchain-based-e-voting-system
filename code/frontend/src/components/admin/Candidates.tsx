import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useToast } from "../../context/ToastContext";
import { useFetch } from "../../hooks/useFetch";

interface Candidate {
  id: number;
  name: string;
  birthday: Date;
  address: string;
  mobile_number: string;
  email: string;
  photo: string;
  party_id?: number;
  party_name?: string;
  party_symbol?: string;
  vote_number: string;
  election_id?: number;
  election_name?: string;
  status: "active" | "inactive";
}

interface Party {
  id: number;
  name: string;
}

interface Election {
  id: number;
  name: string;
  status: "active" | "pending" | "completed";
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

const Candidates: React.FC = () => {
  const { showToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<number | null>(
    null
  );
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [candidateData, setCandidateData] = useState({
    id: 0,
    name: "",
    birthday: new Date(),
    address: "",
    mobileNumber: "",
    email: "",
    photo: "",
    partyId: "",
    voteNumber: "",
    electionId: "",
  });
  const { sendRequest } = useFetch({ setLoading: setIsLoading });

  // Fetch data on component mount
  useEffect(() => {
    fetchCandidates();
    fetchParties();
    fetchElections();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await sendRequest({
        url: `${baseUrl}/api/admin/candidate/stats`,
        options: {
          method: "GET",
        },
      });

      if (response && response.status === 200) {
        setCandidates(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      showToast("Failed to fetch candidates. Please try again.", "error");
    }
  };

  const fetchParties = async () => {
    try {
      const response = await sendRequest({
        url: `${baseUrl}/api/admin/party/list`,
        options: {
          method: "GET",
        },
      });

      if (response && response.status === 200) {
        setParties(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching parties:", error);
    }
  };

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
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Opens dialog to edit a candidate
  const handleEditCandidate = (candidate: Candidate) => {
    setIsEditMode(true);
    setCandidateData({
      id: candidate.id,
      name: candidate.name,
      birthday: new Date(candidate.birthday),
      address: candidate.address,
      mobileNumber: candidate.mobile_number,
      email: candidate.email,
      photo: candidate.photo || "",
      partyId: candidate.party_id?.toString() || "",
      voteNumber: candidate.vote_number,
      electionId: candidate.election_id?.toString() || "",
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = (candidateId: number) => {
    setCandidateToDelete(candidateId);
    setDeleteDialogOpen(true);
  };

  // Deletes the selected candidate
  const handleDeleteConfirm = async () => {
    if (!candidateToDelete) return;

    try {
      const response = await sendRequest({
        url: `${baseUrl}/api/admin/candidate/${candidateToDelete}`,
        options: {
          method: "DELETE",
        },
      });

      if (response && response.status === 200) {
        showToast("Candidate deleted successfully!", "success");
        fetchCandidates(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
      showToast("Failed to delete candidate. Please try again.", "error");
    } finally {
      setDeleteDialogOpen(false);
      setCandidateToDelete(null);
    }
  };

  const handleCreateCandidate = () => {
    setIsEditMode(false);
    setCandidateData({
      id: 0,
      name: "",
      birthday: new Date(),
      address: "",
      mobileNumber: "",
      email: "",
      photo: "",
      partyId: "",
      voteNumber: "",
      electionId: "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditMode(false);
    setCandidateData({
      id: 0,
      name: "",
      birthday: new Date(),
      address: "",
      mobileNumber: "",
      email: "",
      photo: "",
      partyId: "",
      voteNumber: "",
      electionId: "",
    });
  };

  const handleSubmit = async () => {
    // Validate form data
    if (!candidateData.name.trim()) {
      showToast("Please enter a candidate name.", "error");
      return;
    }

    if (!candidateData.address.trim()) {
      showToast("Please enter an address.", "error");
      return;
    }

    if (!candidateData.mobileNumber.trim()) {
      showToast("Please enter a mobile number.", "error");
      return;
    }

    if (!candidateData.email.trim()) {
      showToast("Please enter an email address.", "error");
      return;
    }

    if (!candidateData.voteNumber.trim()) {
      showToast("Please enter a vote number.", "error");
      return;
    }

    try {
      const requestData = {
        name: candidateData.name,
        birthday: candidateData.birthday.toISOString(),
        address: candidateData.address,
        mobileNumber: candidateData.mobileNumber,
        email: candidateData.email,
        photo: candidateData.photo || "",
        partyId: candidateData.partyId ? candidateData.partyId : "",
        voteNumber: candidateData.voteNumber,
        electionId: candidateData.electionId ? candidateData.electionId : "",
      };

      const url = isEditMode
        ? `${baseUrl}/api/admin/candidate/${candidateData.id}`
        : `${baseUrl}/api/admin/candidate/create`;

      const method = isEditMode ? "PUT" : "POST";

      const response = await sendRequest({
        url: url,
        options: {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: { ...requestData },
        },
      });

      if (response && (response.status === 201 || response.status === 200)) {
        showToast(
          isEditMode
            ? "Candidate updated successfully!"
            : "Candidate created successfully!",
          "success"
        );
        handleCloseDialog();
        fetchCandidates(); // Refresh the list
      }
    } catch (error) {
      console.error("Error saving candidate:", error);
      showToast(
        `Failed to ${
          isEditMode ? "update" : "create"
        } candidate. Please try again.`,
        "error"
      );
    }
  };

  const CandidateList: React.FC<{ candidates: Candidate[] }> = ({
    candidates,
  }) => (
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
            Loading candidates...
          </Typography>
        </Box>
      ) : candidates.length === 0 ? (
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
            No Candidates Found
          </Typography>
          <Typography variant="body2">
            There are no candidates in this category at the moment.
          </Typography>
        </Box>
      ) : (
        candidates.map((candidate) => (
          <ListItem
            key={candidate.id}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              mb: 2,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={candidate.photo}
                alt={candidate.name}
                sx={{ width: 56, height: 56, marginRight: 2 }}
              >
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h6">{candidate.name}</Typography>
                  <Chip
                    label={candidate.status}
                    size="small"
                    color={
                      candidate.status === "active" ? "success" : "default"
                    }
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email: {candidate.email} | Mobile: {candidate.mobile_number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vote Number: {candidate.vote_number}
                    {candidate.party_name &&
                      ` | Party: ${candidate.party_name}`}
                    {candidate.election_name &&
                      ` | Election: ${candidate.election_name}`}
                  </Typography>
                </Box>
              }
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEditCandidate(candidate)}
                sx={{ color: "primary.main" }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteClick(candidate.id)}
                sx={{ color: "error.main" }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))
      )}
    </List>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Candidate Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCandidate}
          disabled={isLoading}
        >
          Add Candidate
        </Button>
      </Box>

      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="All Candidates" />
          <Tab label="Active Candidates" />
          <Tab label="Inactive Candidates" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && <CandidateList candidates={candidates} />}
          {tabValue === 1 && (
            <CandidateList
              candidates={candidates.filter((c) => c.status === "active")}
            />
          )}
          {tabValue === 2 && (
            <CandidateList
              candidates={candidates.filter((c) => c.status === "inactive")}
            />
          )}
        </Box>
      </Paper>

      {/* Create/Edit Candidate Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? "Edit Candidate" : "Create New Candidate"}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={candidateData.name}
                  onChange={(e) =>
                    setCandidateData({ ...candidateData, name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Birthday"
                  value={candidateData.birthday}
                  onChange={(newValue) => {
                    if (newValue) {
                      setCandidateData({
                        ...candidateData,
                        birthday: newValue,
                      });
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={candidateData.address}
                  onChange={(e) =>
                    setCandidateData({
                      ...candidateData,
                      address: e.target.value,
                    })
                  }
                  multiline
                  rows={2}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={candidateData.mobileNumber}
                  onChange={(e) =>
                    setCandidateData({
                      ...candidateData,
                      mobileNumber: e.target.value,
                    })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={candidateData.email}
                  onChange={(e) =>
                    setCandidateData({
                      ...candidateData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Photo URL"
                  value={candidateData.photo}
                  onChange={(e) =>
                    setCandidateData({
                      ...candidateData,
                      photo: e.target.value,
                    })
                  }
                  helperText="Enter the URL of the candidate's photo"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Party</InputLabel>
                  <Select
                    value={candidateData.partyId}
                    label="Party"
                    onChange={(e) =>
                      setCandidateData({
                        ...candidateData,
                        partyId: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="">
                      <em>No Party</em>
                    </MenuItem>
                    {parties.map((party) => (
                      <MenuItem key={party.id} value={party.id}>
                        {party.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Election</InputLabel>
                  <Select
                    value={candidateData.electionId}
                    label="Election"
                    onChange={(e) =>
                      setCandidateData({
                        ...candidateData,
                        electionId: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="">
                      <em>No Election</em>
                    </MenuItem>
                    {elections.map((election) => (
                      <MenuItem key={election.id} value={election.id}>
                        {election.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vote Number"
                  value={candidateData.voteNumber}
                  onChange={(e) =>
                    setCandidateData({
                      ...candidateData,
                      voteNumber: e.target.value,
                    })
                  }
                  required
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditMode ? "Update" : "Create"} Candidate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this candidate? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Candidates;
