import React, { useState } from 'react';
import {
  Box,
  Typography,
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
  useTheme,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

interface Candidate {
  id: string;
  name: string;
  position: string;
  description: string;
  imageUrl?: string;
  party: string;
  status: string;
}

const Candidates: React.FC = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [candidateData, setCandidateData] = useState({
    name: '',
    position: '',
    description: '',
    imageUrl: '',
    party: '',
    status: '',
  });

  // Mock data - replace with actual data from your backend
  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'John Doe',
      position: 'President',
      description: 'Experienced leader with a vision for change',
      imageUrl: 'https://i.pravatar.cc/150?img=1',
      party: 'Democratic Party',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      position: 'Vice President',
      description: 'Dedicated to student welfare and development',
      imageUrl: 'https://i.pravatar.cc/150?img=2',
      party: 'Republican Party',
      status: 'inactive',
    },
  ];

  const handleCreateCandidate = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCandidateData({
      name: '',
      position: '',
      description: '',
      imageUrl: '',
      party: '',
      status: '',
    });
  };

  const handleSubmit = () => {
    // TODO: Implement candidate creation logic
    console.log('Creating candidate:', candidateData);
    handleCloseDialog();
  };

  const handleEditCandidate = (candidate: Candidate) => {
    // Implement edit candidate logic
    console.log('Editing candidate:', candidate);
  };

  const handleDeleteCandidate = (id: string) => {
    // Implement delete candidate logic
    console.log('Deleting candidate:', id);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Candidates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCandidate}
        >
          Add Candidate
        </Button>
      </Box>

      <Paper sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {candidates.map((candidate) => (
            <ListItem
              key={candidate.id}
              divider
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditCandidate(candidate)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteCandidate(candidate.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemAvatar>
                <Avatar src={candidate.imageUrl} alt={candidate.name}>
                  {candidate.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={candidate.name}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {candidate.party}
                    </Typography>
                    <Chip
                      label={candidate.status}
                      size="small"
                      color={candidate.status === 'active' ? 'success' : 'default'}
                    />
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Candidate</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Candidate Name"
                  value={candidateData.name}
                  onChange={(e) =>
                    setCandidateData({ ...candidateData, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Position"
                  value={candidateData.position}
                  onChange={(e) =>
                    setCandidateData({ ...candidateData, position: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={candidateData.description}
                  onChange={(e) =>
                    setCandidateData({ ...candidateData, description: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={candidateData.imageUrl}
                  onChange={(e) =>
                    setCandidateData({ ...candidateData, imageUrl: e.target.value })
                  }
                  helperText="Optional: URL for candidate's profile picture"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Party"
                  value={candidateData.party}
                  onChange={(e) =>
                    setCandidateData({ ...candidateData, party: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Status"
                  value={candidateData.status}
                  onChange={(e) =>
                    setCandidateData({ ...candidateData, status: e.target.value })
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
            disabled={!candidateData.name || !candidateData.position}
          >
            Add Candidate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Candidates; 