import {
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  HowToVote as VoteIcon,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { useFetch } from "../../hooks/useFetch";

interface Stats {
  totalVoters: number;
  votedVoters: number;
  activeElections: number;
  systemStatus: "Active" | "Inactive";
  blockchainStatus: "Active" | "Inactive";
  activeCandidates: number;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

const Overview: React.FC = () => {
  const theme = useTheme();
  const { showToast } = useToast();

  const { sendRequest } = useFetch({});
  const [stats, setstats] = useState<Stats>({
    totalVoters: 0,
    votedVoters: 0,
    activeElections: 0,
    systemStatus: "Inactive",
    blockchainStatus: "Inactive",
    activeCandidates: 0,
  });

  useEffect(() => {
    fetchActiveElections();
    fetchActiveCandidates();
    fetchSystemStatus();
    fetchBlockchainStatus();
    fetchVoters();
    fetchVotedCount();
  }, []);

  const fetchActiveElections = async () => {
    try {
      const response: {
        status: number;
        data: {
          message: string;
          data: { id: number; startDateTime: Date; endDateTime: Date }[];
        };
      } = await sendRequest({
        url: `${baseUrl}/api/admin/election/list`,
        options: {
          method: "GET",
        },
      });
      const activeElections = response.data.data.filter(
        (entry) =>
          new Date(entry.startDateTime) < new Date() &&
          new Date(entry.endDateTime) > new Date()
      ).length;

      setstats((prev) => ({ ...prev, activeElections: activeElections }));
    } catch (err) {
      console.error(err);
      showToast("Unexpected error occured", "error");
    }
  };

  const fetchActiveCandidates = async () => {
    try {
      const response: {
        status: number;
        data: {
          message: string;
          data: { id: number; status: "active" | "inactive" }[];
        };
      } = await sendRequest({
        url: `${baseUrl}/api/admin/candidate/list`,
        options: {
          method: "GET",
        },
      });

      const activeCandidates = response.data.data.filter(
        (entry) => entry.status === "active"
      ).length;

      setstats((prev) => ({ ...prev, activeCandidates: activeCandidates }));
    } catch (err) {
      console.error(err);
      showToast("Unexpected error occured", "error");
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const responseSystem: { status: number } = await fetch(
        "http://localhost:5000/api/test",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (responseSystem.status === 200) {
        setstats((prev) => ({ ...prev, systemStatus: "Active" }));
      } else {
        setstats((prev) => ({ ...prev, systemStatus: "Inactive" }));
      }
    } catch (err) {
      console.error(err);
      showToast("Unexpected error occured", "error");
    }
  };

  const fetchBlockchainStatus = async () => {
    try {
      const responseBlockchain: { status: number } = await fetch(
        "http://localhost:4000/api/test",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (responseBlockchain.status === 200) {
        setstats((prev) => ({ ...prev, blockchainStatus: "Active" }));
      } else {
        setstats((prev) => ({ ...prev, blockchainStatus: "Inactive" }));
      }
    } catch (err) {
      console.error(err);
      showToast("Unexpected error occured", "error");
    }
  };

  const fetchVoters = async () => {
    try {
      const response: {
        status: number;
        data: {
          message: string;
          data: { count: number };
        };
      } = await sendRequest({
        url: `${baseUrl}/api/voter/count  `,
        options: {
          method: "GET",
        },
      });

      const voterCount = response.data.data.count;

      setstats((prev) => ({ ...prev, totalVoters: voterCount }));
    } catch (err) {
      console.error(err);
      showToast("Unexpected error occured", "error");
    }
  };

  const fetchVotedCount = async () => {
    try {
      const response: {
        status: number;
        data: {
          message: string;
          data: { count: number };
        };
      } = await sendRequest({
        url: `${baseUrl}/api/votes/count  `,
        options: {
          method: "GET",
        },
      });

      const votedVoterCount = response.data.data.count;

      setstats((prev) => ({ ...prev, votedVoters: votedVoterCount }));
    } catch (err) {
      console.error(err);
      showToast("Unexpected error occured", "error");
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    progress?: number;
    status?: string;
  }> = ({ title, value, icon, color, progress, status }) => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: color,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            backgroundColor: alpha(color, 0.08),
            borderRadius: "50%",
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
        {status && (
          <Chip
            label={status}
            size="small"
            sx={{
              bgcolor: `${color}15`,
              color: color,
              fontWeight: 500,
            }}
          />
        )}
      </Box>
      {progress !== undefined && (
        <Box sx={{ mt: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
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
              "& .MuiLinearProgress-bar": {
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
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 3,
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <Grid container spacing={3} sx={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="System Status"
            value={stats.systemStatus}
            status={stats.systemStatus}
            icon={
              <CheckCircleIcon
                sx={{
                  color:
                    stats.systemStatus === "Active"
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                }}
              />
            }
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Blockchain Network"
            value={stats.blockchainStatus}
            status={stats.blockchainStatus}
            icon={
              <CheckCircleIcon
                sx={{
                  color:
                    stats.blockchainStatus === "Active"
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                }}
              />
            }
            color={theme.palette.success.main}
          />
        </Grid>
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
            title="Active Candidates"
            value={stats.activeCandidates}
            icon={<LocationIcon sx={{ color: theme.palette.primary.main }} />}
            color={theme.palette.primary.main}
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
            progress={Number(
              stats.totalVoters < 1
                ? 0
                : ((stats.votedVoters / stats.totalVoters) * 100).toFixed(2)
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default Overview;
