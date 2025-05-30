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
  LinearProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Election {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'pending' | 'completed';
  totalVoters: number;
  votesCast: number;
  pollingStations: {
    id: string;
    name: string;
    totalVoters: number;
    votesCast: number;
  }[];
  votingTrend: {
    time: string;
    votes: number;
  }[];
}

const Elections: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
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
      totalVoters: 1000,
      votesCast: 468,
      pollingStations: [
        { id: '1', name: 'Main Campus', totalVoters: 500, votesCast: 250 },
        { id: '2', name: 'North Campus', totalVoters: 300, votesCast: 150 },
        { id: '3', name: 'South Campus', totalVoters: 200, votesCast: 68 },
      ],
      votingTrend: [
        { time: '09:00', votes: 50 },
        { time: '10:00', votes: 120 },
        { time: '11:00', votes: 200 },
        { time: '12:00', votes: 300 },
        { time: '13:00', votes: 350 },
        { time: '14:00', votes: 400 },
        { time: '15:00', votes: 468 },
      ],
    },
    {
      id: '2',
      name: 'Class Representative Election 2024',
      startDate: new Date('2024-02-15T09:00:00'),
      endDate: new Date('2024-02-15T17:00:00'),
      status: 'completed',
      totalVoters: 500,
      votesCast: 450,
      pollingStations: [
        { id: '1', name: 'Main Campus', totalVoters: 300, votesCast: 280 },
        { id: '2', name: 'North Campus', totalVoters: 200, votesCast: 170 },
      ],
      votingTrend: [
        { time: '09:00', votes: 100 },
        { time: '10:00', votes: 200 },
        { time: '11:00', votes: 300 },
        { time: '12:00', votes: 350 },
        { time: '13:00', votes: 400 },
        { time: '14:00', votes: 425 },
        { time: '15:00', votes: 450 },
      ],
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
      case 'pending':
        return theme.palette.warning.main;
      case 'completed':
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
          sx={{ 
            mb: 2, 
            p: 2, 
            cursor: 'pointer',
            '&:hover': { 
              bgcolor: 'action.hover',
              transform: 'translateY(-2px)',
              transition: 'transform 0.2s ease-in-out',
            } 
          }}
          onClick={() => setSelectedElection(election)}
        >
          <ListItem
            secondaryAction={
                election.status === 'pending' && 
                (<Box>
                <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Box>)
        
        }
          > 
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">{election.name}</Typography>
                  <Chip
                    label={election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                    size="medium"
                    sx={{
                      bgcolor: `${getStatusColor(election.status)}15`,
                      color: getStatusColor(election.status),
                      fontWeight: 600,
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

  const ElectionDetails: React.FC<{ election: Election }> = ({ election }) => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => setSelectedElection(null)}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {election.name}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Overall Progress */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Voting Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  {election.votesCast} / {election.totalVoters} votes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {((election.votesCast / election.totalVoters) * 100).toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(election.votesCast / election.totalVoters) * 100}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Polling Station Progress */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Polling Station Progress
              </Typography>
              {election.pollingStations.map((station) => (
                <Box key={station.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{station.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {station.votesCast} / {station.totalVoters} votes
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(station.votesCast / station.totalVoters) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Voting Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real-time Voting Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={election.votingTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="votes"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
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
        '& button:focus, & button:focus-visible': {
          outline: 'none',
        },
      }}
    >
      {!selectedElection ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3}}>
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
              <Tab label="Pending Elections" />
              <Tab label="Completed Elections" />
            </Tabs>
            <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
              {tabValue === 0 && (
                <ElectionList
                  elections={elections.filter((e) => e.status === 'active')}
                />
              )}
              {tabValue === 1 && (
                <ElectionList
                  elections={elections.filter((e) => e.status === 'pending')}
                />
              )}
              {tabValue === 2 && (
                <ElectionList
                  elections={elections.filter((e) => e.status === 'completed')}
                />
              )}
            </Box>
          </Paper>
        </>
      ) : (
        <ElectionDetails election={selectedElection} />
      )}

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