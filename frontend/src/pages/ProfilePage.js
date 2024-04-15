import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getUserDetails, updateUserDetails } from "../controllers/UserController";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Grid,
  Button,
  TextField,
  Box,
} from "@mui/material";

const ProfilePage = () => {
  // All for 'profile' or 'password'
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [dialogContent, setDialogContent] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  const { authTokens, user } = useContext(AuthContext);
  const [initialUserDetails, setInitialUserDetails] = useState({});

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
        const formattedDetails = {
          username: details.username || "",
          first_name: details.first_name || "",
          last_name: details.last_name || "",
          email: details.email || "",
          phone_number: details.phoneNumber || "",
        };
        setUserDetails(formattedDetails);
        setInitialUserDetails(formattedDetails); // Store initial details for comparison
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
  // check the field is changed
  const isValueChanged = (name) => {
    return userDetails[name] !== initialUserDetails[name];
  };

  const handleUpdateProfileClick = (e) => {
    e.preventDefault();
    setConfirmAction("profile");
    setDialogContent("Are you sure you want to update your profile?");
    setOpenDialog(true);
  };

  const handleUpdatePasswordClick = (e) => {
    e.preventDefault();
    setConfirmAction("password");
    setDialogContent("Are you sure you want to update your password?");
    setOpenDialog(true);
  };

  const confirmUpdate = async () => {
    setOpenDialog(false);
    try {
      if (confirmAction === "profile") {
        await updateUserDetails(user.user_id, authTokens, userDetails);
        setAlertMessage("Profile updated successfully!");
        setAlertSeverity("success");
      } else if (confirmAction === "password") {
        if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
          setAlertMessage("Passwords do not match.");
          setAlertSeverity("error");
          setShowAlert(true);
          return;
        }

        await updateUserDetails(user.user_id, authTokens, {
          password: passwordDetails.newPassword,
        });
        setAlertMessage("Password updated successfully!");
        setAlertSeverity("success");
        setPasswordDetails({ newPassword: "", confirmPassword: "" }); // Reset password fields
      }
    } catch (error) {
      console.error("Error updating:", error);
      setAlertMessage(`Failed to update ${confirmAction === "profile" ? "profile" : "password"}.`);
      setAlertSeverity("error");
    }
    setShowAlert(true);
    setConfirmAction(null); // Reset the confirmed action
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
      <Grid
        container
        spacing={2}
        justifyContent='center'
        sx={{ maxWidth: "500px", width: "100%", px: 2, py: 2 }}
      >
        {showAlert && (
          <Alert severity={alertSeverity} onClose={() => setShowAlert(false)} sx={{ mb: 2 }}>
            {alertMessage}
          </Alert>
        )}

        {/* User info fields */}
        <Grid item xs={12}>
          <form onSubmit={handleUpdateProfileClick} style={{ width: "100%" }}>
            <TextField
              id='username'
              label='Username'
              name='username'
              value={userDetails.username}
              onChange={handleUserInputChange}
              variant='standard'
              fullWidth
              margin='normal'
              style={{
                backgroundColor: isValueChanged("username") ? "#E4FFE4" : "transparent",
              }}
            />
            <TextField
              id='first-name'
              label='First Name'
              name='first_name'
              value={userDetails.first_name}
              onChange={handleUserInputChange}
              variant='standard'
              fullWidth
              margin='normal'
              style={{
                backgroundColor: isValueChanged("first_name") ? "#E4FFE4" : "transparent",
              }}
            />
            <TextField
              id='last-name'
              label='Last Name'
              name='last_name'
              value={userDetails.last_name}
              onChange={handleUserInputChange}
              variant='standard'
              fullWidth
              margin='normal'
              style={{
                backgroundColor: isValueChanged("last_name") ? "#E4FFE4" : "transparent",
              }}
            />
            <TextField
              id='email'
              label='Email'
              name='email'
              value={userDetails.email}
              onChange={handleUserInputChange}
              variant='standard'
              fullWidth
              margin='normal'
              style={{
                backgroundColor: isValueChanged("email") ? "#E4FFE4" : "transparent",
              }}
            />
            <TextField
              id='phone-number'
              label='Phone Number'
              name='phone_number'
              value={userDetails.phone_number}
              onChange={handleUserInputChange}
              variant='standard'
              fullWidth
              style={{
                backgroundColor: isValueChanged("phone_number") ? "#E4FFE4" : "transparent",
              }}
            />
            <Button type='submit' variant='contained' color='secondary' sx={{ marginTop: 2 }}>
              Update Profile
            </Button>
          </form>
        </Grid>

        {/* Password fields */}
        <Grid item xs={12}>
          <form onSubmit={handleUpdatePasswordClick} style={{ width: "100%" }}>
            <TextField
              id='new-password'
              label='New Password'
              name='newPassword'
              value={passwordDetails.newPassword} // Ensure this uses passwordDetails
              onChange={handlePasswordChange}
              type='password'
              variant='standard'
              fullWidth
              margin='normal'
            />

            <TextField
              id='confirm-password'
              label='Confirm New Password'
              name='confirmPassword'
              value={passwordDetails.confirmPassword} // Ensure this uses passwordDetails
              onChange={handlePasswordChange}
              type='password'
              variant='standard'
              fullWidth
              margin='normal'
            />
            <Button type='submit' variant='contained' color='secondary' sx={{ marginTop: 2 }}>
              Update Password
            </Button>
          </form>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{"Confirm Update"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmUpdate} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
