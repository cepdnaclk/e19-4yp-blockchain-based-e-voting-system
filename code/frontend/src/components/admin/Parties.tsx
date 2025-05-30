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
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

interface Party {
  id: string;
  name: string;
  symbol: string;
  status: 'active' | 'inactive';
}

interface Candidate {
  id: string;
  name: string;
  party: string;
  status: 'active' | 'inactive';
  voteNumber: string;
}

const Parties: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partyToDelete, setPartyToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [partyData, setPartyData] = useState({
    name: '',
    symbol: '',
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
    {
      id: '1',
      name: 'Party A',
      symbol: 'https://example.com/symbol1.png',
      status: 'active',
    },
    {
      id: '2',
      name: 'Party B',
      symbol: 'https://example.com/symbol2.png',
      status: 'active',
    },
    {
      id: '3',
      name: 'Party C',
      symbol: 'https://example.com/symbol3.png',
      status: 'inactive',
    },
  ];

  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'John Doe',
      party: 'Party A',
      status: 'active',
      voteNumber: '001',
    },
    {
      id: '2',
      name: 'Jane Smith',
      party: 'Party A',
      status: 'inactive',
      voteNumber: '002',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      party: 'Party B',
      status: 'active',
      voteNumber: '003',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateParty = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPartyData({
      name: '',
      symbol: '',
    });
  };

  const handleSubmit = () => {
    // TODO: Implement party creation logic
    console.log('Creating party:', partyData);
    handleCloseDialog();
  };

  const handleDeleteClick = (partyId: string) => {
    setPartyToDelete(partyId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: Implement delete logic
    console.log('Deleting party:', partyToDelete);
    setDeleteDialogOpen(false);
    setPartyToDelete(null);
  };

  const PartyList: React.FC<{ parties: Party[] }> = ({ parties }) => (
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
            Loading parties...
          </Typography>
        </Box>
      ) : parties.length === 0 ? (
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
            No Parties Found
          </Typography>
          <Typography variant="body2">
            There are no parties in this category at the moment.
          </Typography>
        </Box>
      ) : (
        parties.map((party) => (
          <Paper
            key={party.id}
            elevation={1}
            sx={{ 
              mb: 2, 
              p: 2,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            onClick={() => setSelectedParty(party)}
          >
            <ListItem
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(party.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar src={party.symbol} alt={party.name}>
                  {party.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">{party.name}</Typography>
                    <Chip
                      label={party.status.charAt(0).toUpperCase() + party.status.slice(1)}
                      size="small"
                      color={party.status === 'active' ? 'success' : 'default'}
                    />
                  </Box>
                }
              />
            </ListItem>
          </Paper>
        ))
      )}
    </List>
  );

  const PartyDetails: React.FC<{ party: Party }> = ({ party }) => {
    const partyCandidates = candidates.filter((c) => c.party === party.name);

    return (
      <Box sx={{ p: 3 }}>
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
              Loading party details...
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <IconButton 
                onClick={() => setSelectedParty(null)}
                sx={{ mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={party.symbol} alt={party.name} sx={{ width: 56, height: 56 }}>
                  {party.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {party.name}
                  </Typography>
                  <Chip
                    label={party.status.charAt(0).toUpperCase() + party.status.slice(1)}
                    size="small"
                    color={party.status === 'active' ? 'success' : 'default'}
                  />
                </Box>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Candidates
            </Typography>

            <Grid container spacing={2}>
              {partyCandidates.map((candidate) => (
                <Grid item xs={12} md={6} key={candidate.id}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{candidate.name}</Typography>
                      <Chip
                        label={candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                        size="small"
                        color={candidate.status === 'active' ? 'success' : 'default'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Vote Number: {candidate.voteNumber}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    );
  };

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
      {!selectedParty ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'end', mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateParty}
              disabled={isLoading}
            >
              Add Party
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
              <Tab label="Active Parties" />
              <Tab label="Inactive Parties" />
            </Tabs>
            <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
              {tabValue === 0 && (
                <PartyList
                  parties={parties.filter((p) => p.status === 'active')}
                />
              )}
              {tabValue === 1 && (
                <PartyList
                  parties={parties.filter((p) => p.status === 'inactive')}
                />
              )}
            </Box>
          </Paper>
        </>
      ) : (
        <PartyDetails party={selectedParty} />
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Party</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Party Name"
                  value={partyData.name}
                  onChange={(e) =>
                    setPartyData({ ...partyData, name: e.target.value })
                  }
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
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!partyData.name || !partyData.symbol}
          >
            Add Party
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
            Are you sure you want to delete this party? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
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

export default Parties; 