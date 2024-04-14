import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { addMinutes, format } from "date-fns";

import { Box, Grid, Typography, Chip, Divider, Stack, Button } from "@mui/material";

import Face6Icon from "@mui/icons-material/Face6";
import EventIcon from "@mui/icons-material/Event";
import PhoneIcon from "@mui/icons-material/Phone";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MeetingRoom from "@mui/icons-material/MeetingRoom";

import { getAllAvailabilities } from "../controllers/AvailabilityController";
import { fetchEventDetails, updateEvent } from "../controllers/EventsController";
import { getUserDetails } from "../controllers/UserController";

import { useNotification } from "../components/NotificationContext";
import ConfirmDialog from "../components/ConfirmDialog";

const FinalizeEventPage = () => {
  let { eventId } = useParams();
  const { authTokens } = useContext(AuthContext);

  const [eventDetails, setEventDetails] = useState(null);
  const [hostAvailabilities, setHostAvailabilities] = useState([]);
  const [inviteeAvailabilities, setInviteeAvailabilities] = useState([]);
  const [inviteeDetails, setInviteeDetails] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [error, setError] = useState(null);
  const [matchedAvailabilities, setMatchedAvailabilities] = useState([]);
  const { triggerNotification } = useNotification();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const history = useHistory();

  // fetch availabilities of host and invitee
  useEffect(() => {
    const fetchDetailsAndAvailabilities = async () => {
      try {
        setIsLoading(true);
        const event = await fetchEventDetails(eventId, authTokens);
        setEventDetails(event);
        console.log(event);
        console.log(event.host);
        console.log(event.invitee);
        const hostAvailabilityPromise = getAllAvailabilities(authTokens, eventId, event.host);
        const inviteeAvailabilityPromise = getAllAvailabilities(authTokens, eventId, event.invitee);

        const [hostAvail, inviteeAvail] = await Promise.all([
          hostAvailabilityPromise,
          inviteeAvailabilityPromise,
        ]);

        setHostAvailabilities(hostAvail);
        setInviteeAvailabilities(inviteeAvail);
      } catch (e) {
        setError(e);
        console.error("Error fetching data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailsAndAvailabilities();
  }, [eventId, authTokens]);

  // Matching and scoring availabilities
  useEffect(() => {
    if (eventDetails && hostAvailabilities.length > 0 && inviteeAvailabilities.length > 0) {
      // Generate time slots for the host that are the same duration as the event
      const hostSlots = generateHostTimeSlots();

      const matches = [];

      inviteeAvailabilities.forEach((inviteeSlot) => {
        hostSlots.forEach((hostSlot) => {
          if (
            hostSlot.start.getTime() === new Date(inviteeSlot.start_time).getTime() &&
            hostSlot.end.getTime() === new Date(inviteeSlot.end_time).getTime()
          ) {
            const score =
              preferenceScore(inviteeSlot.preference_type) +
              preferenceScore(hostSlot.preference_type);
            matches.push({
              start_time: hostSlot.start,
              end_time: hostSlot.end,
              score,
              date: format(hostSlot.start, "PPPP"), // Format the date for display
            });
          }
        });
      });

      // Sort the matches by score in descending order and keep the top 5
      const topMatches = matches.sort((a, b) => b.score - a.score).slice(0, 5);
      setMatchedAvailabilities(topMatches);
    }
  }, [eventDetails, hostAvailabilities, inviteeAvailabilities]);

  // Fetch host details
  useEffect(() => {
    if (eventDetails && eventDetails.invitee) {
      // Check if eventDetails is not null and has a host
      const fetchUserDetails = async () => {
        try {
          const inviteeDetails = await getUserDetails(eventDetails.invitee, authTokens);
          console.log(inviteeDetails);
          setInviteeDetails(inviteeDetails);
        } catch (error) {
          console.error("Error fetching invitee details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [eventDetails, authTokens]); // Depend on eventDetails directly

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

  // Function to handle selection of a time slot
  const handleSelectTimeSlot = (availability) => {
    setSelectedTimeSlot(availability);
  };

  // Function to handle finalization submission
  const handleInitiateSubmit = () => {
    if (!selectedTimeSlot) {
      alert("Please select a time slot.");
      return;
    }
    setConfirmOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const updateData = {
        status: "F", // Finalized status
        finalized_start_time: selectedTimeSlot.start_time,
        finalized_end_time: selectedTimeSlot.end_time,
      };
      await updateEvent(eventId, updateData, authTokens);
      triggerNotification("Event Finalized Successfully");
      history.push("/");
      console.log("Event status updated to 'F' (Finalized)");
    } catch (error) {
      console.error("Failed to update event status:", error);
    }
    setConfirmOpen(false); // Close the confirmation dialog
  };

  // Function to break down host's availabilities into event duration-sized slots
  const generateHostTimeSlots = () => {
    return hostAvailabilities.flatMap((availability) =>
      generateTimeSlots(
        new Date(availability.start_time),
        new Date(availability.end_time),
        eventDetails.event_duration
      ).map((slot) => ({
        ...slot,
        preference_type: availability.preference_type,
      }))
    );
  };

  // Calculate the preference score
  const preferenceScore = (preference) => {
    switch (preference) {
      case "high":
        return 3;
      case "medium":
        return 2;
      case "low":
        return 1;
      default:
        return 0;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Helper function to get the appropriate icon for an event type
  const getEventTypeIcon = (eventType) => {
    switch (eventType) {
      case "in_person":
        return <MeetingRoom sx={{ mr: 1 }} />;
      case "phone":
        return <PhoneIcon sx={{ mr: 1 }} />;
      case "video":
        return <VideoCallIcon sx={{ mr: 1 }} />;
      default:
        return null; // Or some default icon
    }
  };

  return (
    <Box className='container mx-auto p-4'>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSubmit}
        title='Confirm Finalization'
        message='Are you sure you want to finalize this event with the selected time slot?'
      />
      <Grid container spacing={3} alignItems='stretch'>
        {/* Event Details Section */}
        <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
          <Stack spacing={2} sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <Typography
              variant='h4'
              component='h2'
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                fontSize: "2rem",
              }}
            >
              {eventDetails.event_title}
            </Typography>

            <Divider />

            <Typography
              variant='body1'
              sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
            >
              <Face6Icon sx={{ mr: 0.75 }} /> {inviteeDetails.username}
            </Typography>

            <Typography
              variant='body1'
              sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
            >
              <AccessTimeIcon sx={{ mr: 1 }} /> {eventDetails.event_duration} minutes
            </Typography>

            <Typography
              variant='body1'
              sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
            >
              {getEventTypeIcon(eventDetails.event_type)}
              {eventDetails.event_type.replace("_", " ")}
            </Typography>

            <Typography variant='body1' sx={{ fontWeight: "bold" }}>
              Event Deadline: {format(new Date(eventDetails.deadline), "PPPp")}
            </Typography>

            <Typography variant='body1' sx={{ fontWeight: "bold" }}>
              Notes from {inviteeDetails.username}:
            </Typography>

            <Typography variant='body2'>
              {eventDetails.description || "No description provided."}
            </Typography>
          </Stack>
        </Grid>
        {/* Matched Availabilities Section */}
        <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              p: 2,
              boxShadow: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              width: "100%", // Ensure the box takes up all available width
              minHeight: "100%", // Ensure the box takes up minimum height of 100%
              // display: "flex", // Use flex layout to allow children to expand
              flexDirection: "column", // Stack children vertically
            }}
          >
            <Typography variant='h6' component='h2' sx={{ fontWeight: "bold", mb: 2 }}>
              Select the finalized time for the event
            </Typography>
            <Typography variant='subtitle1' sx={{ mb: 3 }}>
              Here are the top 5 best matched timeslots
            </Typography>
            <Stack
              direction='column'
              sx={{
                my: 2,
                // Since we're stacking vertically, you might want to adjust the spacing here
                gap: 1, // This adds space between each Chip vertically
                alignItems: "flex-start", // Align items to the start of the flex container
              }}
            >
              {matchedAvailabilities.map((availability, index) => (
                <Chip
                  key={index}
                  label={`${availability.date}: ${formatDateTime(
                    availability.start_time
                  )} - ${formatDateTime(availability.end_time)}`}
                  clickable
                  color={selectedTimeSlot === availability ? "primary" : "default"}
                  onClick={() => handleSelectTimeSlot(availability)}
                  variant={selectedTimeSlot === availability ? "filled" : "outlined"}
                  sx={{
                    fontSize: "0.875rem",
                    height: "36px", // Ensure consistent height
                    alignItems: "center", // Align text in the center vertically
                    display: "flex", // Use flexbox to align text
                    lineHeight: "normal", // Ensure the line height does not affect alignment
                    padding: "6px 8px",
                    marginRight: "8px", // Apply right margin to all items
                    marginBottom: "8px", // Apply bottom margin to all items for wrapping
                    "&:first-of-type": {
                      marginLeft: 0, // Remove left margin for the first Chip
                    },
                  }}
                />
              ))}
            </Stack>

            <Button
              variant='contained'
              color='secondary'
              onClick={handleInitiateSubmit}
              sx={{ mt: 1, fontSize: "0.75rem", padding: "6px 12px" }} // Makes the button smaller and aligns with chip font size
            >
              Submit Finalized Time
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinalizeEventPage;
