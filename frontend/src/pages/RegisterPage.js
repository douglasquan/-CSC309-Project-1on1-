import React, { useState, useContext } from "react";
import { Container, Box, Typography, TextField, Button, Alert } from "@mui/material";
import { Link, useHistory } from 'react-router-dom';
import AuthContext from "../context/AuthContext";
import { checkUsernameExists, checkEmailExists } from '../controllers/UserController'


const RegisterPage = () => {
  const { authTokens } = useContext(AuthContext);
  const history = useHistory();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password1: "",
    password2: "",
  });

  // Validate email
  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // At least one number, one lowercase, one uppercase letter, and 8 or more characters
    return re.test(password);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUsernameChange = async (event) => {
    const username = event.target.value;
    handleChange(event);
    if (username.length >= 3) {
      const available = await checkUsernameExists(username);
      setUsernameAvailable(available);
      setError(available ? 'Username is already taken.' : '');
    }
  };

  const handleEmailChange = async (event) => {
    const email = event.target.value;
    handleChange(event);
    if (validateEmail(email)) {
        const exists = await checkEmailExists(email);
        if (exists) {
            setError('Email is already in use. Please use a different email.');
        } else {
            setError('');
        }
    }
  };

  // Handle form submission
 const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.first_name || !formData.last_name || !formData.phone_number || !formData.password1 || !formData.password2) {
      setError("Please fill in all fields.");
      return;
    }
  
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(formData.password1)) {
      setError("Password must contain at least 8 characters, including uppercase, lowercase, and numbers.");
      return;
    }

    const isUsernameTaken = await checkUsernameExists(formData.username);
    if (isUsernameTaken) {
        setError('Username is already taken. Please choose another one.');
        return;
    }

    if (formData.password1 !== formData.password2) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          password: formData.password1,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      if (response.status === 201) {
        setError('');
        setSuccess("User created successfully. Redirecting to login...");
        console.log("User created successfully", data);
        setTimeout(() => {
          history.push('/login');
        }, 2000);
      } else {
        throw new Error(data.message || "An error occurred during registration.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
      setSuccess('');
    }
  };

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
    <Container component="main" maxWidth="md">
    <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            p: 6,
            borderRadius: 2,
            boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Create Account
          </Typography>

          {/* Error Message */}
          {error && (
            <Alert severity="error" style={{ width: '100%' }}>{error}</Alert>
          )}
          {success && (
            <Alert severity="success" style={{ width: '100%' }}>{success}</Alert>
          )}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField fullWidth label="Username" variant="outlined" name="username" value={formData.username} onChange={handleUsernameChange} margin="normal" />
            <TextField fullWidth label="Email" variant="outlined" name="email" type="email" value={formData.email} onChange={handleEmailChange} margin="normal" />
            <TextField fullWidth label="First Name" variant="outlined" name="first_name" value={formData.first_name} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Last Name" variant="outlined" name="last_name" value={formData.last_name} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Phone Number" variant="outlined" name="phone_number" value={formData.phone_number} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Password" variant="outlined" name="password1" type="password" value={formData.password1} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Confirm Password" variant="outlined" name="password2" type="password" value={formData.password2} onChange={handleChange} margin="normal" />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              Create Account
            </Button>

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Link component="button" variant="body2" onClick={() => handleLinkClick('/login')}>
                ← Back to Login
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
