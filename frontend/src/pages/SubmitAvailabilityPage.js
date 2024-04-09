import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { addMinutes, format } from "date-fns";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";


import AuthContext from "../context/AuthContext";
import { getAllAvailabilities, createAvailability } from "../controllers/AvailabilityController";
import { fetchEventDetails, updateEvent } from "../controllers/EventsController";

const EventDetailsPage = () => {
  let { eventId, userId } = useParams();

  const [eventDetails, setEventDetails] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [preferredTime, setPreferredTime] = useState("high");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const { authTokens } = useContext(AuthContext);

  // Fetch event details only once or when eventId changes
  useEffect(() => {
    fetchEventDetails(eventId, authTokens)
      .then((data) => {
        setEventDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
      });
  }, [eventId, authTokens]);

  // Fetch availabilities only once or when eventId and userId change
  useEffect(() => {
    getAllAvailabilities(authTokens, eventId, userId).then(setAvailabilities).catch(console.error);
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
    try {
      const promises = selectedTimeSlots.map((selectedSlot) => {
        const availabilityData = {
          user_id: eventDetails.invitee,
          event_id: eventId,
          start_time: selectedSlot.start,
          end_time: selectedSlot.end,
          preference_type: selectedSlot.preference, // Include preference type in the payload
        };
        return createAvailability(authTokens, availabilityData);
      });

      await Promise.all(promises);
      console.log("All availabilities submitted");

      // Update event status to "C" after successfully submitting all availabilities
      await updateEvent(eventId, { status: "C" }, authTokens);
      console.log("Event status updated to 'C'");

      // Update local state to reflect the new status
      setEventDetails((prevDetails) => ({ ...prevDetails, status: "C" }));

      // You might want to clear the selected slots or show a success message after submission
      setSelectedTimeSlots([]);
    } catch (error) {
      console.error("An error occurred while submitting availabilities:", error);
    }
  };

  if (!eventDetails) {
    return <div>Loading...</div>;
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

  return (
    <Box className='container mx-auto p-4'>
      <Grid container spacing={3}>
        {/* Event Details Section */}
        <Grid item xs={12} md={6}>
          <Box className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <h2 className='text-xl mb-2'>Invitation From {eventDetails.host}</h2>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2'>Meeting Title</label>
              <p className='border rounded w-full py-2 px-3 text-gray-700'>
                {eventDetails.event_title}
              </p>
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2'>Duration</label>
              <p className='border rounded w-full py-2 px-3 text-gray-700'>
                {eventDetails.event_duration} minutes
              </p>
            </div>
            <FormControl component='fieldset' className='mb-4'>
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

            <TextField
              className='w-full mb-4'
              label='Notes for the meeting (optional)'
              multiline
              rows={4}
              placeholder='Add any information relevant to this event'
            />

          </Box>
        </Grid>
        {/* Availabilities Section */}
        <Grid item xs={12} md={6}>
          <Box className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-auto h-full'>
            <h2 className='text-xl mb-2'>Available Times</h2>
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
