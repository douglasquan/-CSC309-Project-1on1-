import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import {
  getUserDetails,
  updateUserDetails,
} from "../controllers/UserController";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

const ProfilePage = () => {
  const { authTokens, user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [passwordDetails, setPasswordDetails] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const details = await getUserDetails(user.user_id, authTokens);
        setUserDetails({
          username: details.username || "",
          first_name: details.first_name || "",
          last_name: details.last_name || "",
          email: details.email || "",
          phone_number: details.phoneNumber || "",
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [user, authTokens]);

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission for user info
    try {
      await updateUserDetails(user.user_id, authTokens, userDetails);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Failed to update profile.");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission for password

    // Check if the new passwords match
    if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
      alert("Passwords do not match.");
      return; // Stop the form submission
    }

    try {
      await updateUserDetails(user.user_id, authTokens, {
        password: passwordDetails.newPassword,
      });
      alert("Password updated successfully!");
      setPasswordDetails({ newPassword: "", confirmPassword: "" }); // Reset password fields
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password.");
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* Add padding on the Grid container for smaller screens */}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ maxWidth: "500px", width: "100%", px: 2 }}
      >
        <Grid item xs={12}>
          <form onSubmit={handleUserUpdate} style={{ width: "100%" }}>
            {/* User info fields here */}
            <TextField
              id="username"
              label="Username"
              name="username"
              value={userDetails.username}
              onChange={handleUserInputChange}
              variant="standard"
              fullWidth
              margin="normal"
            />
            <TextField
              id="first-name"
              label="First Name"
              name="first_name"
              value={userDetails.first_name}
              onChange={handleUserInputChange}
              variant="standard"
              fullWidth
              margin="normal"
            />
            <TextField
              id="last-name"
              label="Last Name"
              name="last_name"
              value={userDetails.last_name}
              onChange={handleUserInputChange}
              variant="standard"
              fullWidth
              margin="normal"
            />
            <TextField
              id="email"
              label="Email"
              name="email"
              value={userDetails.email}
              onChange={handleUserInputChange}
              variant="standard"
              fullWidth
              margin="normal"
            />
            <TextField
              id="phone-number"
              label="Phone Number"
              name="phone_number"
              value={userDetails.phone_number}
              onChange={handleUserInputChange}
              variant="standard"
              fullWidth
            />
            <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
              Update Profile
            </Button>
          </form>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handlePasswordUpdate} style={{ width: "100%" }}>
            {/* Password fields here */}
            <TextField
              id="new-password"
              label="New Password"
              name="newPassword"
              value={passwordDetails.newPassword} // Ensure this uses passwordDetails
              onChange={handlePasswordChange}
              type="password"
              variant="standard"
              fullWidth
              margin="normal"
            />

            <TextField
              id="confirm-password"
              label="Confirm New Password"
              name="confirmPassword"
              value={passwordDetails.confirmPassword} // Ensure this uses passwordDetails
              onChange={handlePasswordChange}
              type="password"
              variant="standard"
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
              Update Password
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
