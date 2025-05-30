import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Candidate {
  id: string;
  name: string;
  birthday: Date;
  address: string;
  mobileNumber: string;
  email: string;
  photo: string;
  party: string;
  voteNumber: string;
  electionId?: string;
  status: 'active' | 'inactive';
}

interface Party {
  id: string;
  name: string;
}

interface Election {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'completed';
}

const Candidates: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null);
  const [candidateData, setCandidateData] = useState({
    id: '',
    name: '',
    birthday: new Date(),
    address: '',
    mobileNumber: '',
    email: '',
    photo: '',
    party: '',
    voteNumber: '',
    electionId: '',
  });

  // Simulate loading data
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data - replace with actual data from your backend
  const parties: Party[] = [
    { id: '1', name: 'Party A' },
    { id: '2', name: 'Party B' },
    { id: '3', name: 'Party C' },
  ];

  const elections: Election[] = [
    { id: '1', name: 'Election 1', status: 'active' },
    { id: '2', name: 'Election 2', status: 'pending' },
    { id: '3', name: 'Election 3', status: 'completed' },
  ];

  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'John Doe',
      birthday: new Date('1990-01-01'),
      address: '123 Main St',
      mobileNumber: '1234567890',
      email: 'john@example.com',
      photo: '',
      party: 'Party A',
      voteNumber: '001',
      electionId: '1',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      birthday: new Date('1992-02-02'),
      address: '456 Oak St',
      mobileNumber: '0987654321',
      email: 'jane@example.com',
      photo: '',
      party: 'Party B',
      voteNumber: '002',
      status: 'inactive',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setIsEditMode(true);
    setCandidateData({
      id: candidate.id,
      name: candidate.name,
      birthday: candidate.birthday,
      address: candidate.address,
      mobileNumber: candidate.mobileNumber,
      email: candidate.email,
      photo: candidate.photo,
      party: candidate.party,
      voteNumber: candidate.voteNumber,
      electionId: candidate.electionId || '',
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = (candidateId: string) => {
    setCandidateToDelete(candidateId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: Implement delete logic
    console.log('Deleting candidate:', candidateToDelete);
    setDeleteDialogOpen(false);
    setCandidateToDelete(null);
  };

  const handleCreateCandidate = () => {
    setIsEditMode(false);
    setCandidateData({
      id: '',
      name: '',
      birthday: new Date(),
      address: '',
      mobileNumber: '',
      email: '',
      photo: '',
      party: '',
      voteNumber: '',
      electionId: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditMode(false);
    setCandidateData({
      id: '',
      name: '',
      birthday: new Date(),
      address: '',
      mobileNumber: '',
      email: '',
      photo: '',
      party: '',
      voteNumber: '',
      electionId: '',
    });
  };

  const handleSubmit = () => {
    if (isEditMode) {
      // TODO: Implement edit logic
      console.log('Updating candidate:', candidateData);
    } else {
      // TODO: Implement create logic
      console.log('Creating candidate:', candidateData);
    }
    handleCloseDialog();
  };

  const CandidateList: React.FC<{ candidates: Candidate[] }> = ({ candidates }) => (
    <List>
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            color: 'text.secondary',
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
          <Paper
            key={candidate.id}
            elevation={1}
            sx={{ mb: 2, p: 2 }}
          >
            <ListItem
              secondaryAction={
                candidate.status === 'inactive' && (
                  <Box>
                    <IconButton 
                      edge="end" 
                      aria-label="edit" 
                      sx={{ mr: 1 }}
                      onClick={() => handleEditCandidate(candidate)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleDeleteClick(candidate.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )
              }
            >
              <ListItemAvatar>
                <Avatar src={candidate.photo}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">{candidate.name}</Typography>
                    <Chip
                      label={candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                      size="small"
                      color={candidate.status === 'active' ? 'success' : 'default'}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Party: {candidate.party}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vote Number: {candidate.voteNumber}
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

  return (
    <Box
      sx={{
        flex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCandidate}
          disabled={isLoading}
        >
          Add Candidate
        </Button>
      </Box>

      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Active Candidates" />
          <Tab label="Inactive Candidates" />
        </Tabs>
        <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
          {tabValue === 0 && (
            <CandidateList
              candidates={candidates.filter((c) => c.status === 'active')}
            />
          )}
          {tabValue === 1 && (
            <CandidateList
              candidates={candidates.filter((c) => c.status === 'inactive')}
            />
          )}
        </Box>
      </Paper>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? 'Edit Candidate' : 'Add New Candidate'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Candidate Name"
                  value={candidateData.name}
                  onChange={(e) =>
                    setCandidateData({ ...candidateData, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Birthday"
                    value={candidateData.birthday}
                    onChange={(date: Date | null) =>
                      setCandidateData({ ...candidateData, birthday: date || new Date() })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={candidateData.address}
                  onChange={(e) =>
                    setCandidateData({ ...candidateData, address: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={candidateData.mobileNumber}
                  onChange={(e) =>
                    setCandidateData({ ...candidateData, mobileNumber: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={candidateData.email}
                  onChange={(e) =>
                    setCandidateData({ ...candidateData, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Photo URL"
                  value={candidateData.photo}
                  onChange={(e) =>
                    setCandidateData({ ...candidateData, photo: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Party</InputLabel>
                  <Select
                    value={candidateData.party}
                    label="Party"
                    onChange={(e) =>
                      setCandidateData({ ...candidateData, party: e.target.value })
                    }
                  >
                    {parties.map((party) => (
                      <MenuItem key={party.id} value={party.name}>
                        {party.name}
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
                    setCandidateData({ ...candidateData, voteNumber: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Attach to Election (Optional)</InputLabel>
                  <Select
                    value={candidateData.electionId}
                    label="Attach to Election (Optional)"
                    onChange={(e) =>
                      setCandidateData({ ...candidateData, electionId: e.target.value })
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {elections
                      .filter((e) => e.status !== 'active')
                      .map((election) => (
                        <MenuItem key={election.id} value={election.id}>
                          {election.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!candidateData.name || !candidateData.party || !candidateData.voteNumber}
          >
            {isEditMode ? 'Update' : 'Add'} Candidate
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this candidate? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions
      sx={{p: 2}}
        >
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