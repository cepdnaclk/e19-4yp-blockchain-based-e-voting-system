import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  HowToVote as VoteIcon,
  Event as EventIcon,
} from '@mui/icons-material';

const Overview: React.FC = () => {
  const theme = useTheme();

  // Mock data - replace with actual data from your backend
  const stats = {
    totalVoters: 1000,
    votedVoters: 468,
    activeElections: 2,
    pollingStations: 10,
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    progress?: number;
  }> = ({ title, value, icon, color, progress }) => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: color,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: '50%',
            p: 1,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        {value}
      </Typography>
      {progress !== undefined && (
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: `${color}15`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
              },
            }}
          />
        </Box>
      )}
    </Paper>
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
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3} sx={{ width: '100%' }}>
      <Grid item xs={12} md={4}>
          <StatCard
            title="Active Elections"
            value={stats.activeElections}
            icon={<EventIcon sx={{ color: theme.palette.info.main }} />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Polling Stations"
            value={stats.pollingStations}
            icon={<EventIcon sx={{ color: theme.palette.info.main }} />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Voters"
            value={stats.totalVoters}
            icon={<PeopleIcon sx={{ color: theme.palette.primary.main }} />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Voters Voted"
            value={stats.votedVoters}
            icon={<VoteIcon sx={{ color: theme.palette.success.main }} />}
            color={theme.palette.success.main}
            progress={Number(((stats.votedVoters / stats.totalVoters) * 100).toFixed(2))}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview; 