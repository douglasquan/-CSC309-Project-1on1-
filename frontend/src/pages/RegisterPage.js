import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Grid } from "@mui/material";
import { Link, useHistory } from 'react-router-dom';
import logo from "../img/logo1.png"; // Ensure the path to your logo is correct
import dummy from '../img/register.png'; // Ensure the path to your image is correct

const RegisterPage = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password1: "",
    password2: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
 const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password1 !== formData.password2) {
      alert("Passwords do not match!");
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
        console.log("User created successfully", data);
        history.push('/login'); // This is the recommended way to redirect
      } else {
        alert("An error occurred: " + data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
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

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField fullWidth label="Username" variant="outlined" name="username" value={formData.username} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Email" variant="outlined" name="email" type="email" value={formData.email} onChange={handleChange} margin="normal" />
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
