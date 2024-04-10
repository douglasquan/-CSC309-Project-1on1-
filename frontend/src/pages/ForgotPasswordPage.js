import React, {useContext} from 'react'
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext'
import { Container, Box, Typography, TextField, Button, Link } from '@mui/material';


const ForgotPasswordPage = () => {
    let {forgotPassword} = useContext(AuthContext)
    
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
            <Box
              sx={{
                backgroundColor: 'white',
                p: 5,
                borderRadius: 2,
                boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
             
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                
                <Box
                  component="form"
                  onSubmit={forgotPassword}
                  sx={{ flex: 1, mt: { xs: 4, md: 0 } }}
                  noValidate
                >
                  <Typography variant="h5" component="h1" gutterBottom textAlign="center">
                    Forgot Password
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Reset Password
                  </Button>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                    <Link component={NavLink} to="/login" variant="body2" sx={{ textDecoration: 'none' }}>
                      ← Back to Login
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
    );
}

export default ForgotPasswordPage;