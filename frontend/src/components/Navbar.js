import React, { useState, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom'; // Import useHistory for navigation
import AuthContext from '../context/AuthContext';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Tooltip, Divider, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ContactsIcon from '@mui/icons-material/Contacts';
import EventIcon from '@mui/icons-material/Event';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import FaceIcon from '@mui/icons-material/Face';
import LogoutIcon from '@mui/icons-material/Logout';  

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 65;

const pastelColors = {
  background: '#c9e4de', // A pastel background color
  iconColor: '#f5b5fc', // A pastel icon color
  activeItemBackground: '#a8d1d1', // A pastel active item background color
};

const NavbarComponent = () => {
  let { user, logoutUser } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const history = useHistory();
  const [expanded, setExpanded] = useState(false);
  const location = useLocation(); // Get the current location

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path) => {
    history.push(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setDrawerOpen(false);
    history.push('/login');
  };

  const navigationItems = user ? [
    { title: "Home", path: "/", icon: <HomeIcon /> },
    { title: "Profile", path: "/profile", icon: <PersonIcon /> },
    { title: "Contacts", path: "/contact-list", icon: <ContactsIcon /> },
    { title: "Create Event", path: "/create-event", icon: <EventIcon /> },
  ] : [
    { title: "Login", path: "/login", icon: <LoginIcon /> },
    { title: "Register", path: "/register", icon: <PersonAddIcon /> },
  ];

  return (
    <Box onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)} sx={{ display: 'flex' }}>
      <IconButton onClick={() => setExpanded(!expanded)} color="inherit" sx={{ color: pastelColors.iconColor }}>
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="permanent"
        sx={{
          width: expanded ? drawerWidthExpanded : drawerWidthCollapsed,
          '& .MuiDrawer-paper': {
            width: expanded ? drawerWidthExpanded : drawerWidthCollapsed,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            backgroundColor: pastelColors.background,
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: expanded ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
            }),
          },
        }}
        open={expanded}
      >
        <List style={{ padding: expanded ? '10px' : '20px 6px' }}>
          {navigationItems.map((item) => (
            <Tooltip title={expanded ? '' : item.title} placement="right" key={item.title}>
              <ListItem
                button
                component={Link}
                to={item.path}
                onClick={drawerOpen ? handleDrawerToggle : null}
                style={{ 
                  marginTop: '20px',
                  backgroundColor: location.pathname === item.path ? pastelColors.activeItemBackground : 'transparent',
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={expanded ? item.title : ''} />
              </ListItem>
            </Tooltip>
          ))}
        </List>
        {user && (
          <Box sx={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center'}}>
            <Divider />
            <Tooltip title={!expanded ? "Logout" : ''} placement="right">
              <ListItem 
                button 
                onClick={handleLogout} 
                sx={{ 
                  justifyContent: expanded ? 'flex-start' : 'center', 
                  p: expanded ? '10px' : '10px 50px',
                }}
              >
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" sx={{ display: expanded ? 'block' : 'none'}} />
              </ListItem>
            </Tooltip>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default NavbarComponent;
