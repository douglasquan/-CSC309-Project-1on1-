import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Typography, useMediaQuery, useTheme } from '@mui/material';

function RequestAvailabilityDialog({ open, onClose, inviteeUsername, inviteeEmail }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleSendEmail = () => {
    console.log(`Sending email to: ${inviteeEmail}`);

    const emailBody = encodeURIComponent(
      `Hello ${inviteeUsername},\n\nPlease fill out your availability for the meeting at this link: [Dummy Link](http://example.com/availability).\n\nBest regards.`
    );

    // Open the user's default mail client pre-filled with the email
    window.open(`mailto:${inviteeEmail}?subject=Request for Meeting Availability&body=${emailBody}`);

    onClose(); // Close the dialog after "sending" the email
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{"Request Availability"}</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          You are about to send an email to {inviteeUsername} ({inviteeEmail}) to request their availability for the meeting.
        </Typography>
        <Button 
          onClick={handleSendEmail} 
          color="secondary" 
          variant="contained"
          sx={{ mt: 4 }}
          autoFocus
        >
          Send Email
        </Button>
      </DialogContent>
    </Dialog>
  );
}
export default RequestAvailabilityDialog;
