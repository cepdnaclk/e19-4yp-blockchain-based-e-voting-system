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
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Election {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'past' | 'upcoming';
}

const Elections: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [electionData, setElectionData] = useState({
    name: '',
    startDate: new Date(),
    endDate: new Date(),
  });

  // Mock data - replace with actual data from your backend
  const elections: Election[] = [
    {
      id: '1',
      name: 'Student Council Election 2024',
      startDate: new Date('2024-03-01T09:00:00'),
      endDate: new Date('2024-03-02T17:00:00'),
      status: 'active',
    },
    {
      id: '2',
      name: 'Class Representative Election 2024',
      startDate: new Date('2024-02-15T09:00:00'),
      endDate: new Date('2024-02-15T17:00:00'),
      status: 'past',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateElection = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setElectionData({
      name: '',
      startDate: new Date(),
      endDate: new Date(),
    });
  };

  const handleSubmit = () => {
    // TODO: Implement election creation logic
    console.log('Creating election:', electionData);
    handleCloseDialog();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'past':
        return theme.palette.grey[500];
      case 'upcoming':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const ElectionList: React.FC<{ elections: Election[] }> = ({ elections }) => (
    <List>
      {elections.map((election) => (
        <Paper
          key={election.id}
          elevation={1}
          sx={{ mb: 2, p: 2, '&:hover': { bgcolor: 'action.hover' } }}
        >
          <ListItem
            secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">{election.name}</Typography>
                  <Chip
                    label={election.status}
                    size="small"
                    sx={{
                      bgcolor: `${getStatusColor(election.status)}15`,
                      color: getStatusColor(election.status),
                      fontWeight: 500,
                    }}
                  />
                </Box>
              }
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Start: {election.startDate.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    End: {election.endDate.toLocaleString()}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        </Paper>
      ))}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Elections
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateElection}
        >
          Create Election
        </Button>
      </Box>

      <Paper sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
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
          <Tab label="Active Elections" />
          <Tab label="Past Elections" />
        </Tabs>
        <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
          {tabValue === 0 ? (
            <ElectionList
              elections={elections.filter((e) => e.status === 'active')}
            />
          ) : (
            <ElectionList
              elections={elections.filter((e) => e.status === 'past')}
            />
          )}
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Election</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Election Name"
                  value={electionData.name}
                  onChange={(e) =>
                    setElectionData({ ...electionData, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Date & Time"
                    value={electionData.startDate}
                    onChange={(date: Date | null) =>
                      setElectionData({ ...electionData, startDate: date || new Date() })
                    }
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="End Date & Time"
                    value={electionData.endDate}
                    onChange={(date: Date | null) =>
                      setElectionData({ ...electionData, endDate: date || new Date() })
                    }
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!electionData.name}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Elections; 