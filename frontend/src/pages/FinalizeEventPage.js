import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { addMinutes, format } from "date-fns";

import { Box, Grid, Typography, Chip, Divider, Stack, Button} from "@mui/material";

import { getAllAvailabilities } from "../controllers/AvailabilityController";
import {
  fetchEventDetails,
  updateEvent,
} from "../controllers/EventsController";

import { getUserDetails } from "../controllers/UserController";

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
        const hostAvailabilityPromise = getAllAvailabilities(
          authTokens,
          eventId,
          event.host
        );
        const inviteeAvailabilityPromise = getAllAvailabilities(
          authTokens,
          eventId,
          event.invitee
        );

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
    if (
      eventDetails &&
      hostAvailabilities.length > 0 &&
      inviteeAvailabilities.length > 0
    ) {
      // Generate time slots for the host that are the same duration as the event
      const hostSlots = generateHostTimeSlots();

      const matches = [];

      inviteeAvailabilities.forEach((inviteeSlot) => {
        hostSlots.forEach((hostSlot) => {
          if (
            hostSlot.start.getTime() ===
              new Date(inviteeSlot.start_time).getTime() &&
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
          const inviteeDetails = await getUserDetails(
            eventDetails.invitee,
            authTokens
          );
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
  const handleSubmit = async () => {
    if (!selectedTimeSlot) {
      alert("Please select a time slot.");
      return;
    }
  
    try {
      // Assuming the event's final date and time are set based on the selectedTimeSlot
      // You might need to adjust the object structure based on your backend requirements
      const updateData = {
        status: "F", // finalized status
        finalized_start_time: selectedTimeSlot.start_time, 
        finalized_end_time: selectedTimeSlot.end_time,
      };
  
      await updateEvent(eventId, updateData, authTokens);
      console.log("Event status updated to 'F' (Finalized)");
  
    } catch (error) {
      console.error("Failed to update event status:", error);
    }
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

  return (
    <Box className="container mx-auto p-4">
      <Grid container spacing={3}>
        {/* Event Details Section */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2} sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" component="span">
              {eventDetails.event_title}
            </Typography>{" "}
            <Typography variant="h6" component="span">
              with {inviteeDetails.username}
            </Typography>
            <Divider />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Duration
            </Typography>
            <Typography variant="body2">
              {eventDetails.event_duration} minutes
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Notes from {inviteeDetails.username}
            </Typography>
            <Typography variant="body2">
              {eventDetails.description || "No description provided."}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Event Type
            </Typography>
            <Typography variant="body2">{eventDetails.event_type}</Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Event Deadline
            </Typography>
            <Typography variant="body2">
              {format(new Date(eventDetails.deadline), "PPPp")}
            </Typography>
            <Divider />
          </Stack>
        </Grid>
        {/* Matched Availabilities Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <h2>Top Matched Availabilities</h2>
            <Stack direction="row" spacing={1} sx={{ my: 2, flexWrap: "wrap" }}>
              {matchedAvailabilities.map((availability, index) => (
                <Chip
                  key={index}
                  label={`${availability.date}: ${formatDateTime(
                    availability.start_time
                  )} - ${formatDateTime(availability.end_time)}`}
                  clickable
                  color={
                    selectedTimeSlot === availability ? "primary" : "default"
                  }
                  onClick={() => handleSelectTimeSlot(availability)}
                  variant={
                    selectedTimeSlot === availability ? "filled" : "outlined"
                  }
                />
              ))}
            </Stack>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit Finalized Time
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinalizeEventPage;
