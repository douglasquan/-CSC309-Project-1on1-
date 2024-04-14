import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { addMinutes, format } from "date-fns";
import { useHistory } from "react-router-dom";

import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Box,
  Grid,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  TextField
} from "@mui/material";

import PhoneIcon from "@mui/icons-material/Phone";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

import AuthContext from "../context/AuthContext";
import { getAllAvailabilities, createAvailability } from "../controllers/AvailabilityController";
import { fetchEventDetails, updateEvent } from "../controllers/EventsController";
import { getUserDetails } from "../controllers/UserController";

import { useNotification } from "../components/NotificationContext";
import ConfirmDialog from "../components/ConfirmDialog";

const EventDetailsPage = () => {
  let { eventId, userId } = useParams();

  const [eventDetails, setEventDetails] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [preferredTime, setPreferredTime] = useState("high");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [hostDetails, setHostDetails] = useState("");
  const { authTokens } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const { triggerNotification } = useNotification();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [inviteeNote, setInviteeNote] = useState(""); 

  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when data fetch starts
      if (!authTokens) {
        console.error("Auth tokens are not available.");
        return;
      }

      try {
        const eventDetailsData = await fetchEventDetails(eventId, authTokens);
        setEventDetails(eventDetailsData);

        if (eventDetailsData.host) {
          const hostDetailsData = await getUserDetails(eventDetailsData.host, authTokens);
          setHostDetails(hostDetailsData);
        }

        if (eventDetailsData && userId) {
          const availabilitiesData = await getAllAvailabilities(authTokens, eventId, userId);
          setAvailabilities(availabilitiesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false); // Set loading to false when data fetch completes
    };

    fetchData();
  }, [eventId, userId, authTokens]);

  // Generate time slots when eventDetails or availabilities change
  useEffect(() => {
    if (eventDetails && availabilities.length > 0) {
      const updatedAvailabilities = availabilities.map((a) => {
        const start = new Date(a.start_time);
        const end = new Date(a.end_time);
        const duration = eventDetails.event_duration;
        return { ...a, timeSlots: generateTimeSlots(start, end, duration) };
      });

      setAvailabilities(updatedAvailabilities);
    }
  }, [eventDetails, availabilities.length]);

  const handleSubmitAvailability = async () => {
    if (selectedTimeSlots.length === 0) {
      setOpenAlert(true); // Show error alert
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const promises = selectedTimeSlots.map((selectedSlot) => {
        const availabilityData = {
          user_id: eventDetails.invitee,
          event_id: eventId,
          start_time: selectedSlot.start,
          end_time: selectedSlot.end,
          preference_type: selectedSlot.preference,
        };
        return createAvailability(authTokens, availabilityData);
      });

      await Promise.all(promises);
      console.log("All availabilities submitted");
      await updateEvent(eventId, { status: "C", invitee_description: inviteeNote}, authTokens);
      console.log("Event status updated to 'C'");
      triggerNotification("Availability submitted successfully!");
      history.push("/");
    } catch (error) {
      console.error("An error occurred while submitting availabilities:", error);
    }
    setConfirmOpen(false);
  };

  if (!eventDetails) {
    return <CircularProgress />;
  }

  const handleTimeSlotClick = (slot) => {
    setSelectedTimeSlots((prevSlots) => {
      const existingSlotIndex = prevSlots.findIndex(
        (s) => s.start === slot.start && s.end === slot.end
      );

      // If the slot already exists, update its preference or remove it if the preference is the same
      if (existingSlotIndex >= 0) {
        const existingSlot = prevSlots[existingSlotIndex];
        if (existingSlot.preference === preferredTime) {
          return prevSlots.filter((_, index) => index !== existingSlotIndex);
        } else {
          return [
            ...prevSlots.slice(0, existingSlotIndex),
            { ...slot, preference: preferredTime },
            ...prevSlots.slice(existingSlotIndex + 1),
          ];
        }
      } else {
        // If the slot is new, add it with the selected preference
        return [...prevSlots, { ...slot, preference: preferredTime }];
      }
    });
  };

  const preferenceColor = (preference) => {
    switch (preference) {
      case "high":
        return "#008000";
      case "medium":
        return "#4EF312";
      case "low":
        return "#B2FF59";
      default:
        return "#d3d3d3";
    }
  };

  // Helper function to format the DateTime object or string
  const formatDateTime = (dateTimeStr) => {
    // Assuming dateTimeStr is an ISO formatted date time string
    return format(new Date(dateTimeStr), "p"); // 'p' is for localized time format
  };

  const generateTimeSlots = (start, end, duration) => {
    let slots = [];
    let current = new Date(start);

    while (current < end) {
      let slotEnd = addMinutes(current, duration);
      if (slotEnd <= end) {
        // Make sure the slot does not exceed the availability window
        slots.push({ start: new Date(current), end: new Date(slotEnd) });
      }
      current = slotEnd;
    }

    return slots;
  };

  // Helper function to get the appropriate icon for an event type
  const getEventTypeIcon = (eventType) => {
    switch (eventType) {
      case "in_person":
        return <MeetingRoomIcon sx={{ mr: 1 }} />;
      case "phone":
        return <PhoneIcon sx={{ mr: 1 }} />;
      case "video":
        return <VideoCallIcon sx={{ mr: 1 }} />;
      default:
        return null; // Or some default icon
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box className='container mx-auto p-4'>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message='Availability submitted successfully!'
      />
      {openAlert && (
        <Alert severity='error' onClose={() => setOpenAlert(false)}>
          Please select at least one availability before submitting.
        </Alert>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
        title='Confirm Submission'
        message='Are you sure you want to submit these availabilities?'
      />
      <Grid container spacing={3}>
        {/* Event Details Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 2,
              boxShadow: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant='h6'
              component='h2'
              sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
            >
              Invitation From {hostDetails.username}
            </Typography>

            <Divider />

            <Typography
              variant='h5'
              component='h2'
              sx={{ color: "invitation.main", fontWeight: "bold", fontSize: "2rem" }}
            >
              {eventDetails.event_title}
            </Typography>

            <Typography
              variant='body1'
              sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
            >
              <AccessTimeIcon sx={{ mr: 1 }} /> {eventDetails.event_duration} minutes
            </Typography>

            {eventDetails.event_type !== "other" && (
              <Typography
                variant='body1'
                sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
              >
                {getEventTypeIcon(eventDetails.event_type)}
                {eventDetails.event_type.replace("_", " ")}
              </Typography>
            )}

            <Typography variant='body1' sx={{ fontWeight: "bold" }}>
              Event Deadline: {format(new Date(eventDetails.deadline), "PPPp")}
            </Typography>

            <Typography variant='body1' sx={{ fontWeight: "bold" }}>
              Notes from {hostDetails.username} :
            </Typography>
            <Typography variant='body2'>
              {eventDetails.description || "No description provided."}
            </Typography>

            <TextField
              label="Your Notes"
              multiline
              rows={4}
              fullWidth
              value={inviteeNote}
              onChange={(e) => setInviteeNote(e.target.value)}
              variant="outlined"
              margin="dense"
            />

          </Box>
        </Grid>
        {/* Availabilities Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 2,
              boxShadow: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* <h2 className='text-xl mb-2'>Select Your Availabilities</h2> */}
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Select Your Preferred Date and Time</FormLabel>
              <RadioGroup
                row
                aria-label='preferred-time'
                name='row-radio-buttons-group'
                value={preferredTime}
                onChange={(event) => setPreferredTime(event.target.value)}
              >
                <FormControlLabel value='high' control={<Radio />} label='High' />
                <FormControlLabel value='medium' control={<Radio />} label='Medium' />
                <FormControlLabel value='low' control={<Radio />} label='Low' />
              </RadioGroup>
            </FormControl>
            <div className='flex flex-col space-y-4'>
              {availabilities.map((availability, index) => (
                <div key={index} className='flex flex-col'>
                  <h3 className='text-gray-500 text-lg'>
                    {format(new Date(availability.start_time), "PPPP")}
                  </h3>
                  <div className='grid grid-cols-2 gap-2'>
                    {availability.timeSlots &&
                      availability.timeSlots.map((slot, slotIndex) => {
                        const isSelected = selectedTimeSlots.some(
                          (s) => s.start === slot.start && s.end === slot.end
                        );
                        const selectedSlot = selectedTimeSlots.find(
                          (s) => s.start === slot.start && s.end === slot.end
                        );
                        return (
                          <Chip
                            key={slotIndex}
                            label={`${formatDateTime(slot.start)} - ${formatDateTime(slot.end)}`}
                            onClick={() => handleTimeSlotClick(slot)}
                            style={{
                              backgroundColor: isSelected
                                ? preferenceColor(selectedSlot.preference)
                                : undefined,
                              borderColor: isSelected
                                ? preferenceColor(selectedSlot.preference)
                                : "#d3d3d3",
                            }}
                            variant='outlined'
                          />
                        );
                      })}
                  </div>
                </div>
              ))}
              <Button variant='contained' color='primary' onClick={handleSubmitAvailability}>
                Submit Availability
              </Button>
            </div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export default EventDetailsPage;
