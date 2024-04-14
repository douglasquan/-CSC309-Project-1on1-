import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Container, Box, TextField, Button, Typography, Link } from '@mui/material';
import logo from '../img/logo1.png';

const LoginPage = () => {
  let { loginUser, error } = useContext(AuthContext);
  const history = useHistory();

  const handleLinkClick = (path) => {
    history.push(path);
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(45deg, #a8d1d1, #bdb2ff)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{display: 'flex', mb: 5, textAlign: 'center', justifyContent: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: 500, height: 'auto' }} />
        </Box>

        <Box sx={{ backgroundColor: 'white', p: 5, borderRadius: 2, boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)', width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            User Login
          </Typography>
          {error && (
            <Typography color="error" textAlign="center">
              {error}  {/* Displaying the error message from context */}
            </Typography>
          )}      
          <Box component="form" onSubmit={loginUser} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              Login
            </Button>

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Link component="button" variant="body2" onClick={() => handleLinkClick('/forgot-password')}>
                Forgot password?
              </Link>
              <Link component="button" variant="body2" onClick={() => handleLinkClick('/register')}>
                {"Create your Account →"}
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
