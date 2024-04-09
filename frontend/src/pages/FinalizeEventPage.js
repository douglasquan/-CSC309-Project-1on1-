import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { addMinutes, format } from "date-fns";

import { Box, Grid } from "@mui/material";

import { getAllAvailabilities } from "../controllers/AvailabilityController";
import { fetchEventDetails, updateEvent } from "../controllers/EventsController";

const FinalizeEventPage = () => {
  let { eventId } = useParams();
  const { authTokens } = useContext(AuthContext);

  const [eventDetails, setEventDetails] = useState(null);
  const [hostAvailabilities, setHostAvailabilities] = useState([]);
  const [inviteeAvailabilities, setInviteeAvailabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Function to break down host's availabilities into event duration-sized slots
  const generateHostTimeSlots = () => {
    return hostAvailabilities.flatMap((availability) =>
      generateTimeSlots(
        new Date(availability.start_time),
        new Date(availability.end_time),
        eventDetails.event_duration
      ).map((slot) => ({ ...slot, preference_type: availability.preference_type }))
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
    <Box className='container mx-auto p-4'>
      {/* Matched Availabilities Section */}
      <Grid item xs={12}>
        <Box className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
          <h2 className='text-xl mb-2'>Top Matched Availabilities</h2>
          {matchedAvailabilities.map((availability, index) => (
            <div key={index} className='flex justify-between items-center my-2 p-2 shadow'>
              <span>{`${availability.date}: ${formatDateTime(
                availability.start_time
              )} - ${formatDateTime(availability.end_time)}`}</span>
              <span>Preference Score: {availability.score}</span>
            </div>
          ))}
        </Box>
      </Grid>
    </Box>
  );
};

export default FinalizeEventPage;
