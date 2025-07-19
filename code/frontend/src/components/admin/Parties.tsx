import { Add as AddIcon } from "@mui/icons-material";
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
import React, { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { useFetch } from "../../hooks/useFetch";

interface Party {
  id: number;
  name: string;
  symbol: string;
  electionId?: number;
  candidate_count?: number;
}

interface ElectionType {
  id: number;
  name: string;
}

interface PartyFetchResposnse {
  id: number;
  name: string;
  symbol: string;
  electionId?: number;
}

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
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

const Parties: React.FC = () => {
  const { showToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [partyToDelete, setPartyToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [parties, setParties] = useState<Party[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [elections, setElections] = useState<ElectionType[]>([]);
  const [partyData, setPartyData] = useState({
    name: "",
    symbol: "",
    electionId: "",
  });
  const { sendRequest } = useFetch({ setLoading: setIsLoading });

  useEffect(() => {
    fetchElections();
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (elections.length > 0) {
      fetchParties();
    }
  }, [elections]);

  const fetchElections = async () => {
    try {
      const response: {
        status: number;
        data: { message: string; data: { id: number; name: string }[] };
      } = await sendRequest({
        url: `${baseUrl}/api/admin/election/list`,
        options: {
          method: "GET",
        },
      });

      if (response && response.status === 200) {
        // Handle elections data if needed
        setElections(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching elections:", error);
      showToast("Failed to fetch elections. Please try again.", "error");
    }
  };

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
      const response: {
        status: number;
        data: { message: string; data: PartyFetchResposnse[] };
      } = await sendRequest({
        url: `${baseUrl}/api/admin/party/list`,
        options: {
          method: "GET",
        },
      });

      if (response && response.status === 200) {
        const fetchedParties = response.data.data.map((party) => ({
          id: party.id,
          name: party.name,
          symbol: party.symbol,
          electionId: party.electionId,
        }));

        setParties(fetchedParties);
      }
    } catch (error) {
      console.error("Error fetching parties:", error);
      showToast("Failed to fetch parties. Please try again.", "error");
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateParty = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPartyData({
      name: "",
      symbol: "",
      electionId: "",
    });
  };

  const handleSubmit = async () => {
    // Validate form data
    if (!partyData.name.trim()) {
      showToast("Please enter a party name.", "error");
      return;
    }

    if (!partyData.symbol.trim()) {
      showToast("Please enter a party symbol.", "error");
      return;
    }

    try {
      const response: {
        status: number;
        data: { message: string; data: PartyFetchResposnse };
      } = await sendRequest({
        url: `${baseUrl}/api/admin/party/create`,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            name: partyData.name,
            symbol: partyData.symbol,
            electionId: partyData.electionId,
          },
        },
      });

      if (response && response.status === 201) {
        showToast("Party created successfully!", "success");
        handleCloseDialog();
        const data: PartyFetchResposnse = response.data.data;
        const newParty: Party = {
          id: data.id,
          name: data.name,
          symbol: data.symbol,
          electionId: data.electionId,
        };
        setParties((prev) => [...prev, newParty]);
      }
    } catch (error) {
      console.error("Error creating party:", error);
      showToast("Failed to create party. Please try again.", "error");
    }
  };

  // TODO : Add this if this is needed in the future
  // const handlePartyClick = (party: Party) => {
  //   setSelectedParty(party);
  //   setTabValue(1);
  // };

  // const handleBackToList = () => {
  //   setSelectedParty(null);
  //   setTabValue(0);
  // };

  const PartyList: React.FC<{ parties: Party[] }> = ({ parties }) => (
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
            Loading parties...
          </Typography>
        </Box>
      ) : parties.length === 0 ? (
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
            No Parties Found
          </Typography>
          <Typography variant="body2">
            There are no parties in this category at the moment.
          </Typography>
        </Box>
      ) : (
        parties.map((party) => (
          <ListItem
            key={party.id}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              mb: 2,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
            // onClick={() => handlePartyClick(party)}
          >
            <ListItemAvatar>
              <Avatar
                src={party.symbol}
                alt={party.name}
                sx={{ width: 56, height: 56, marginRight: 2 }}
              >
                {party.name.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {party.name}
                  <Chip
                    label={party.electionId ? "active" : "inactive"}
                    size="small"
                    color={party.electionId ? "success" : "default"}
                  />
                </Box>
              }
              secondary={
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {elections.find((e) => e.id === party.electionId)?.name ||
                      "N/A"}{" "}
                    |{" "}
                    {candidates.filter(
                      (entry) => Number(entry.partyId) === Number(party.id)
                    ).length || 0}{" "}
                    Candidates
                  </Typography>
                </Box>
              }
            />
            {/* TODO : Add this if the delete option is permitted */}
            {/* <IconButton
              edge="end"
              aria-label="delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(party.id);
              }}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon />
            </IconButton> */}
          </ListItem>
        ))
      )}
    </List>
  );

  // TODO : Add this if the details are needed
  // const PartyDetails: React.FC<{ party: Party }> = ({ party }) => {
  //   return (
  //     <Box>
  //       <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
  //         <IconButton onClick={handleBackToList} sx={{ mr: 2 }}>
  //           <ArrowBackIcon />
  //         </IconButton>
  //         <Typography variant="h5" component="h2">
  //           {party.name}
  //         </Typography>
  //       </Box>

  //       <Grid container spacing={3}>
  //         <Grid item xs={12} md={6}>
  //           <Paper sx={{ p: 3, mb: 3 }}>
  //             <Typography variant="h6" gutterBottom>
  //               Party Information
  //             </Typography>
  //             <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
  //               <Avatar
  //                 src={party.symbol}
  //                 alt={party.name}
  //                 sx={{ width: 80, height: 80, mr: 2 }}
  //               >
  //                 {party.name.charAt(0)}
  //               </Avatar>
  //               <Box>
  //                 <Typography variant="h6">{party.name}</Typography>
  //                 <Chip
  //                   label={party.status}
  //                   color={party.status === "active" ? "success" : "default"}
  //                   sx={{ mt: 1 }}
  //                 />
  //               </Box>
  //             </Box>
  //             <Typography variant="body2" color="text.secondary">
  //               Symbol URL: {party.symbol}
  //             </Typography>
  //           </Paper>
  //         </Grid>

  //         <Grid item xs={12} md={6}>
  //           <Paper sx={{ p: 3 }}>
  //             <Typography variant="h6" gutterBottom>
  //               Statistics
  //             </Typography>
  //             <Box
  //               sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
  //             >
  //               <Typography>Total Candidates:</Typography>
  //               <Typography variant="h6">
  //                 {party.candidate_count || 0}
  //               </Typography>
  //             </Box>
  //             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
  //               <Typography>Active Candidates:</Typography>
  //               <Typography variant="h6">
  //                 {candidates.filter((c) => c.status === "active").length}
  //               </Typography>
  //             </Box>
  //           </Paper>
  //         </Grid>

  //         <Grid item xs={12}>
  //           <Paper sx={{ p: 3 }}>
  //             <Typography variant="h6" gutterBottom>
  //               Candidates
  //             </Typography>
  //             <List>
  //               {candidates.map((candidate) => (
  //                 <ListItem key={candidate.id}>
  //                   <ListItemText
  //                     primary={candidate.name}
  //                     secondary={`Candidate Number: ${candidate.vote_number}`}
  //                   />
  //                   <Chip
  //                     label={candidate.status}
  //                     size="small"
  //                     color={
  //                       candidate.status === "active" ? "success" : "default"
  //                     }
  //                   />
  //                 </ListItem>
  //               ))}
  //             </List>
  //           </Paper>
  //         </Grid>
  //       </Grid>
  //     </Box>
  //   );
  // };

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
          Party Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateParty}
          disabled={isLoading}
        >
          Add Party
        </Button>
      </Box>

      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="All Parties" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && <PartyList parties={parties} />}
          {/* TODO: Add this if this is needed */}
          {/* {tabValue === 1 && selectedParty && (
            <PartyDetails party={selectedParty} />
          )} */}
        </Box>
      </Paper>

      {/* Create Party Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Party</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Party Name"
                value={partyData.name}
                onChange={(e) =>
                  setPartyData({ ...partyData, name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Party Symbol URL"
                value={partyData.symbol}
                onChange={(e) =>
                  setPartyData({ ...partyData, symbol: e.target.value })
                }
                required
                helperText="Enter the URL of the party symbol image"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Election</InputLabel>
                <Select
                  value={partyData.electionId || ""}
                  label="Election"
                  onChange={(e) =>
                    setPartyData({
                      ...partyData,
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create Party
          </Button>
        </DialogActions>
      </Dialog>

      {/* TODO: Add this delete confirmation dialog if the delete opetaion is allowed */}
      {/* Delete Confirmation Dialog */}
      {/* <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this party? This action cannot be
            undone.
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

export default Parties;
