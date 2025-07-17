import { Add as AddIcon, Person as PersonIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { useFetch } from "../../hooks/useFetch";

interface Candidate {
  id: number;
  name: string;
  birthday: Date;
  address: string;
  mobileNumber: string;
  email: string;
  photo: string;
  partyId?: string;
  partyName?: string;
  candidateNumber: string;
  electionId?: string;
  electionName?: string;
  status: "active" | "inactive";
}

interface Party {
  id: number;
  name: string;
  electionId: number;
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
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [candidateToDelete, setCandidateToDelete] = useState<number | null>(
  // null
  // );
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [candidateData, setCandidateData] = useState<Candidate>({
    id: 0,
    name: "",
    birthday: new Date(),
    address: "",
    mobileNumber: "",
    email: "",
    photo: "",
    partyId: "",
    partyName: "",
    candidateNumber: "",
    electionId: "",
    electionName: "",
    status: "inactive",
  });
  const { sendRequest } = useFetch({ setLoading: setIsLoading });

  // Fetch data on component mount
  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (elections.length > 0) {
      fetchParties();
    } else {
      setIsLoadingLocal(false);
    }
  }, [elections]);

  useEffect(() => {
    if (parties.length > 0) {
      fetchCandidates();
    } else {
      setIsLoadingLocal(false);
    }
  }, [parties]);

  const fetchCandidates = async () => {
    try {
      const response: {
        status: number;
        data: { message: string; data: Candidate[] };
      } = await sendRequest({
        url: `${baseUrl}/api/admin/candidate/list`,
        options: {
          method: "GET",
        },
      });
      const activeElectionIds: number[] = elections
        .filter((election) => election.status === "active")
        .map((election) => election.id);

      if (response && response.status === 200) {
        const candidateDate: Candidate[] = response.data.data.map(
          (candidate) => {
            return {
              ...candidate,
              status: activeElectionIds.includes(Number(candidate.electionId))
                ? "active"
                : "inactive",
            };
          }
        );
        setCandidates(candidateDate);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      showToast("Failed to fetch candidates. Please try again.", "error");
    } finally {
      setIsLoadingLocal(false);
    }
  };

  const fetchParties = async () => {
    try {
      const response: {
        status: number;
        data: {
          message: string;
          data: { id: number; name: string; electionId: number }[];
        };
      } = await sendRequest({
        url: `${baseUrl}/api/admin/party/list`,
        options: {
          method: "GET",
        },
      });

      if (response && response.status === 200) {
        const data: Party[] = response.data.data.map((party) => ({
          id: party.id,
          name: party.name,
          electionId: party.electionId,
        }));
        setParties(data);
      }
    } catch (error) {
      console.error("Error fetching parties:", error);
    }
  };

  const fetchElections = async () => {
    try {
      setIsLoadingLocal(true);
      const response: {
        status: number;
        data: {
          message: string;
          data: {
            id: number;
            name: string;
            startDateTime: Date;
            endDateTime: Date;
          }[];
        };
      } = await sendRequest({
        url: `${baseUrl}/api/admin/election/list`,
        options: {
          method: "GET",
        },
      });

      if (response && response.status === 200) {
        const electionsData: Election[] = response.data.data.map(
          (election) => ({
            id: election.id,
            name: election.name,
            start_date_time: new Date(election.startDateTime),
            end_date_time: new Date(election.endDateTime),
            status:
              new Date() > new Date(election.endDateTime)
                ? "completed"
                : new Date() < new Date(election.startDateTime)
                ? "pending"
                : "active",
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

  // TODO : Add this when the editing candidate is allowed
  // Opens dialog to edit a candidate
  // const handleEditCandidate = (candidate: Candidate) => {
  //   setIsEditMode(true);
  //   setCandidateData({
  //     id: candidate.id,
  //     name: candidate.name,
  //     birthday: new Date(candidate.birthday),
  //     address: candidate.address,
  //     mobileNumber: candidate.mobile_number,
  //     email: candidate.email,
  //     photo: candidate.photo || "",
  //     partyId: candidate.party_id?.toString() || "",
  //     candidateNumber: candidate.vote_number,
  //     electionId: candidate.election_id?.toString() || "",
  //   });
  //   setOpenDialog(true);
  // };

  // TODO : Add this when the deleting candidate is allowed"
  // const handleDeleteClick = (candidateId: number) => {
  //   setCandidateToDelete(candidateId);
  //   setDeleteDialogOpen(true);
  // };

  // Deletes the selected candidate
  // const handleDeleteConfirm = async () => {
  //   if (!candidateToDelete) return;

  //   try {
  //     const response = await sendRequest({
  //       url: `${baseUrl}/api/admin/candidate/${candidateToDelete}`,
  //       options: {
  //         method: "DELETE",
  //       },
  //     });

  //     if (response && response.status === 200) {
  //       showToast("Candidate deleted successfully!", "success");
  //       fetchCandidates(); // Refresh the list
  //     }
  //   } catch (error) {
  //     console.error("Error deleting candidate:", error);
  //     showToast("Failed to delete candidate. Please try again.", "error");
  //   } finally {
  //     setDeleteDialogOpen(false);
  //     setCandidateToDelete(null);
  //   }
  // };

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
      candidateNumber: "",
      partyName: "",
      status: "inactive",
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
      candidateNumber: "",
      electionId: "",
      status: "inactive",
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

    if (!candidateData.photo.trim()) {
      showToast("Please enter a photo url.", "error");
      return;
    }

    if (!candidateData.electionId) {
      showToast("Please select an election.", "error");
      return;
    }

    if (!candidateData.partyId) {
      showToast("Please select an party.", "error");
      return;
    }
    if (!candidateData.candidateNumber.trim()) {
      showToast("Please enter a candidate number.", "error");
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
        candidateNumber: candidateData.candidateNumber,
        electionId: candidateData.electionId ? candidateData.electionId : "",
      };

      const response = await sendRequest({
        url: `${baseUrl}/api/admin/candidate/create`,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: { ...requestData },
        },
      });

      const activeElectionIds: number[] = elections
        .filter((election) => election.status === "active")
        .map((election) => election.id);

      const candidateFull: Candidate = {
        ...candidateData,
        status: activeElectionIds.some(
          (electionId) =>
            Number(electionId) === Number(candidateData.electionId)
        )
          ? "active"
          : "inactive",
      };
      if (response && response.status === 201) {
        showToast("Candidate created successfully!", "success");
        handleCloseDialog();
        setCandidates((prev) => [...prev, candidateFull]);
      }
    } catch (error) {
      console.error("Error saving candidate:", error);
      showToast(`Failed to create candidate. Please try again.`, "error");
    }
  };

  const CandidateList: React.FC<{ candidates: Candidate[] }> = ({
    candidates,
  }) => (
    <List>
      {isLoadingLocal || isLoading ? (
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
                    Email: {candidate.email} | Mobile: {candidate.mobileNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Candidate Number: {candidate.candidateNumber}
                    {candidate.partyId &&
                      ` | Party: ${
                        parties.find((p) => p.id === Number(candidate.partyId))
                          ?.name
                      }`}
                    {candidate.electionId &&
                      ` | Election: ${
                        elections.find(
                          (c) => c.id === Number(candidate.electionId)
                        )?.name
                      }`}
                  </Typography>
                </Box>
              }
            />
            {/* TODO : Add this if editing and deleting features are needed */}
            {/* <Box sx={{ display: "flex", gap: 1 }}>
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
            </Box> */}
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
                  required
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
                    {elections.map((election) => (
                      <MenuItem key={election.id} value={election.id}>
                        {election.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={!candidateData.electionId}>
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
                    {parties
                      .filter(
                        (party) =>
                          party.electionId === Number(candidateData.electionId)
                      )
                      .map((party) => (
                        <MenuItem key={party.id} value={party.id}>
                          {party.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Candidate Number"
                  value={candidateData.candidateNumber}
                  onChange={(e) =>
                    setCandidateData({
                      ...candidateData,
                      candidateNumber: e.target.value,
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
            Create Candidate
          </Button>
        </DialogActions>
      </Dialog>

      {/* TODO : Add this if the deleting candidates is allowed */}
      {/* Delete Confirmation Dialog */}
      {/* <Dialog
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
      </Dialog> */}
    </Box>
  );
};

export default Candidates;
