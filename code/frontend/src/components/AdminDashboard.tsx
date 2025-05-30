import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Avatar,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  HowToVote as ElectionIcon,
  Person as CandidateIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Groups as PartyIcon,
} from '@mui/icons-material';
import Overview from './admin/Overview';
import Elections from './admin/Elections';
import Candidates from './admin/Candidates';
import Parties from './admin/Parties';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

const AdminDashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { id: 'overview', text: 'Overview', icon: <DashboardIcon /> },
    { id: 'elections', text: 'Elections', icon: <ElectionIcon /> },
    { id: 'parties', text: 'Parties', icon: <PartyIcon /> },
    { id: 'candidates', text: 'Candidates', icon: <CandidateIcon /> },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: !isCollapsed ? 2 : 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: theme.palette.primary.main,
          color: 'white',
          position: 'relative',
          minHeight: !isCollapsed ? 80 : 70,
        }}
      >
        {!isCollapsed && (
          <>
            <Avatar
              sx={{
                bgcolor: 'white',
                color: theme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              A
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Admin Panel
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Welcome back!
              </Typography>
            </Box>
          </>
        )}
        <Tooltip title={isCollapsed ? "Expand navigation" : "Collapse navigation"}>
          <IconButton
            onClick={handleCollapseToggle}
            aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
            sx={{
              position: 'absolute',
              right: 10 ,
              transform: !isCollapsed ? 'translateX(0)' : 'translateX(-50%)',
              bgcolor: 'white',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'grey.100',
              },
              width: 30,
              height: 30,
            }}
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <Tooltip title={isCollapsed ? item.text : ''} placement="right">
              <ListItemButton
                selected={selectedTab === item.id}
                onClick={() => setSelectedTab(item.id)}
                sx={{
                  borderRadius: 2,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  '&.Mui-selected': {
                    backgroundColor: `${theme.palette.primary.main}15`,
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}25`,
                    },
                  },
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}10`,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedTab === item.id ? theme.palette.primary.main : 'inherit',
                    minWidth: isCollapsed ? 'auto' : 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      color: selectedTab === item.id ? theme.palette.primary.main : 'inherit',
                      fontWeight: selectedTab === item.id ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <Tooltip title={isCollapsed ? 'Settings' : ''} placement="right">
            <ListItemButton
              sx={{
                borderRadius: 2,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}10`,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="Settings" />}
            </ListItemButton>
          </Tooltip>
        </ListItem>
        <ListItem disablePadding>
          <Tooltip title={isCollapsed ? 'Logout' : ''} placement="right">
            <ListItemButton
              sx={{
                borderRadius: 2,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                '&:hover': {
                  backgroundColor: `${theme.palette.error.main}10`,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40, color: theme.palette.error.main }}>
                <LogoutIcon />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary="Logout"
                  sx={{ color: theme.palette.error.main }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return <Overview/>;
      case 'elections':
        return <Elections />;
      case 'candidates':
        return <Candidates />;
      case 'parties':
        return <Parties />;
      default:
        return <Overview />;
    }
  };
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5', minWidth: '100vw'}}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)` },
          ml: { sm: `${isCollapsed ? collapsedDrawerWidth : drawerWidth}px` },
          minHeight: !isCollapsed ? 80 : 70,
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          justifyContent: 'center',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center'}}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              {(() => {
                const selectedMenuItem = menuItems.find(item => item.id === selectedTab);
                return selectedMenuItem?.text === "Overview" ? "Dashboard Overview" : selectedMenuItem?.text + " Overview";
              })()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton>
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: isCollapsed ? collapsedDrawerWidth : drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '0 0 15px rgba(0,0,0,0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
              border: 'none',
              boxShadow: '0 0 15px rgba(0,0,0,0.1)',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: '100vh',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
