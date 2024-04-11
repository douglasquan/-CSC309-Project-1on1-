import React, { useState, useContext, useEffect, useRef  } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom'; // Import useHistory for navigation
import AuthContext from '../context/AuthContext';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Tooltip, Divider, Box, useMediaQuery } from '@mui/material';
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
import {getUserDetails} from "../controllers/UserController";

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 65;

const pastelColors = {
  background: '#c9e4de', // A pastel background color
  iconColor: '#9ea1d4', // A pastel icon color
  activeItemBackground: '#a8d1d1', // A pastel active item background color
};

const NavbarComponent = () => {
  let { user, logoutUser, authTokens } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const history = useHistory();
  const [expanded, setExpanded] = useState(false);
  const location = useLocation(); // Get the current location
  const isMobile = useMediaQuery('(max-width:600px)');
  const drawerRef = useRef();
  const [userName, setUserName] = useState({ first_name: '', last_name: '' });

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return 'NN'; // Add a check for undefined or empty values
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };


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

  useEffect(() => {
    // Click outside listener
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawerOpen(false);
      }
    }
  
    if (isMobile && drawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
  
    // Clean up the click outside listener
    const cleanUpClickOutsideListener = () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  
    // Fetch user details
    const fetchUserDetails = async () => {
      if (user && user.user_id && authTokens) {
        try {
          const details = await getUserDetails(user.user_id, authTokens);
          setUserName({
            first_name: details.first_name || '',
            last_name: details.last_name || '',
          });
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };
  
    fetchUserDetails();
  
    // The return here is for cleanup of the click outside event listener
    return cleanUpClickOutsideListener;
  }, [isMobile, drawerOpen, user, authTokens]);

  return (
    <Box onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)} sx={{ display: 'flex' }}>
      {isMobile ? (
        <IconButton 
          onClick={handleDrawerToggle} 
          color="inherit" 
          sx={{ 
            color: pastelColors.background,
            position: 'fixed', // fixed or absolute, depending on layout
            top: 10,
            left: 14,
            zIndex: 1201 // above the Drawer and AppBar's zIndex
          }}
        >
          <MenuIcon />
        </IconButton>
      ) : null}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          ref={drawerRef}
          open={drawerOpen}
          onClose={handleDrawerToggle}
          sx={{
            width: expanded ? drawerWidthExpanded : drawerWidthCollapsed,
            '& .MuiDrawer-paper': {
              width: isMobile ? drawerWidthExpanded : (expanded ? drawerWidthExpanded : drawerWidthCollapsed),
              boxSizing: 'border-box',
              overflowX: 'hidden',
              backgroundColor: pastelColors.background,
              transition: (theme) => theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: expanded ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
              }),
            },
          }}
        >
          {user && (
          <List style={{ padding: isMobile ? '20px 6px' : (expanded ? '10px' : '20px 6px')}}>
            <ListItem   
              button 
              component={Link} 
              to="/profile"
              sx={{ justifyContent: 'flex-start', paddingY: 1, marginBottom: '10px', paddingX:1 }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <Box sx={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%', // make it circular
                  backgroundColor: pastelColors.iconColor,
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}>
                  {getInitials(userName.first_name, userName.last_name)}
                </Box>
              </ListItemIcon>
              {expanded && (
                <ListItemText primary={`${userName.first_name} ${userName.last_name}`} sx={{ marginLeft: '10px' }} />
              )}
            </ListItem>
            {navigationItems.map((item) => (
              <Tooltip title={isMobile ? item.title : (expanded ? '' : item.title)} placement="right" key={item.title}>
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
                  <ListItemText primary={isMobile ? item.title : (expanded ? item.title : '')} />
                </ListItem>
              </Tooltip>
            ))}
          </List>
          )}
          {user && (
            <Box sx={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center'}}>
              <Divider />
              <Tooltip title={isMobile ? "Logout" : (!expanded ? "Logout" : '')} placement="right">
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
