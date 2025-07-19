import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BarChartIcon from "@mui/icons-material/BarChart";

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Blockchain E-Voting System
        </Typography>
        <Box>
          {isAdminPage && (
            <>
              <Button
                color="inherit"
                startIcon={<HomeIcon />}
                onClick={() => navigate("/")}
                sx={{ mr: 2 }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                startIcon={<BarChartIcon />}
                onClick={() => navigate("/results")}
                sx={{ mr: 2 }}
              >
                Results
              </Button>
            </>
          )}
          {isHomePage && (
            <>
              <Button
                color="inherit"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => navigate("/admin/login")}
              >
                Admin Login
              </Button>
              <Button
                color="inherit"
                startIcon={<BarChartIcon />}
                onClick={() => navigate("/results")}
                sx={{ mr: 2 }}
              >
                Results
              </Button>
            </>
          )}
          {!isHomePage && !isAdminPage && (
            <>
              <Button
                color="inherit"
                startIcon={<HomeIcon />}
                onClick={() => navigate("/")}
                sx={{ mr: 2 }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => navigate("/admin/login")}
              >
                Admin Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
