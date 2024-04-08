import React, { useState, useEffect, useContext } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AuthContext from "../context/AuthContext";
import { getContacts } from "../controllers/ContactsController";
import { getUserDetails } from "../controllers/UserController";
import { addEvent } from "../controllers/EventsController";
import { createAvailability } from "../controllers/AvailabilityController";
import {
  Box,
  TextField,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextareaAutosize,
  Select,
  MenuItem,
  Grid,
  Alert,
  InputLabel,
} from "@mui/material";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(BigCalendar);

function CreateEventPage() {
  const [timeblocks, setTimeblocks] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [eventType, setEventType] = useState("");
  const [preference, setPreference] = useState("");
  const [deadline, setDeadline] = useState({ date: "" });
  const [description, setDescription] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedInvitee, setSelectedInvitee] = useState("");
  const [selectedContactUserId, setSelectedContactUserId] = useState("");
  const { authTokens, user } = useContext(AuthContext); // Assuming you're using AuthContext for tokens
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    // Fetch contacts and their details when the component mounts
    const fetchContactsWithDetails = async () => {
      try {
        // Fetch the contact list
        const contactsData = await getContacts(authTokens);
        // Fetch user details for each contact
        const contactsDetails = await Promise.all(
          contactsData.map(async (contact) => {
            try {
              const userDetails = await getUserDetails(
                contact.contact,
                authTokens
              );
              return { ...contact, userDetails }; // Combine contact with userDetails
            } catch (error) {
              console.error(
                `Error fetching details for contact ${contact.contact}:`,
                error
              );
              return contact; // Return the contact without userDetails in case of error
            }
          })
        );
        setContacts(contactsDetails);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContactsWithDetails();
  }, [authTokens]); // Depend on authTokens to refetch if authTokens change

  const handleDateChange = (e) => {
    setDeadline({ date: e.target.value });
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    setEventDuration(value);
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
  };

  const handlePreferenceChange = (e) => {
    setPreference(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleInviteeChange = (e) => {
    const { value } = e.target;
    console.log(value); // output is the selected contact's id
    // Find the contact by its id from the contact list
    const selectedContact = contacts.find((contact) => contact.id === value);
    console.log(contacts); // output is undefined
    if (selectedContact) {
      // Update both selectedInvitee with the contact list ID
      setSelectedInvitee(value);
      setSelectedContactUserId(selectedContact.contact);
    } else {
      setSelectedInvitee("");
      setSelectedContactUserId("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]); // Resetting error messages at the beginning of submission

    const eventData = {
      invitee: selectedContactUserId,
      event_title: eventTitle,
      event_duration: parseInt(eventDuration, 10),
      event_type: eventType,
      description: description,
      deadline: deadline.date,
    };

    console.log("eventData: ", eventData);
    console.log("Timeblocks: ", timeblocks);

    try {
      // create the event
      const eventResponse = await addEvent(eventData, authTokens);
      console.log("Event added successfully:", eventResponse);

      // Create an availability for each timeblock
      await Promise.all(
        timeblocks.map((timeblock) =>
          createAvailability(authTokens, {
            user_id: user.user_id,
            event_id: eventResponse.id,
            start_time: moment(timeblock.start).toISOString(),
            end_time: moment(timeblock.end).toISOString(),
            preference_type: timeblock.preference.toLowerCase(),
          })
        )
      );

      console.log("All availabilities created successfully");
    } catch (error) {
      console.error("Error in the process:", error);
      setErrorMessages((prevMessages) => [...prevMessages, error.toString()]);
    }
  };

  // Calendar Timeblock:

  const moveTimeblock = ({
    event,
    start,
    end,
    isAllDay: droppedOnAllDaySlot,
  }) => {
    const currentTime = new Date();
    const newStartTime = new Date(start);
    const newEndTime = new Date(end);

    // Prevent moving timeblock to the past
    if (newStartTime < currentTime) {
      alert("You cannot move a timeblock to a time in the past.");
      return; // Exit the function
    }

    // Check for overlapping with other timeblocks, excluding the current timeblock being moved
    const isOverlapping = timeblocks.some((timeblock) => {
      return (
        timeblock.id !== event.id &&
        newStartTime < new Date(timeblock.end) &&
        newEndTime > new Date(timeblock.start)
      );
    });

    if (isOverlapping) {
      // alert("Timeblocks cannot overlap.");
      return; // Exit the function
    }

    const idx = timeblocks.indexOf(event);
    const updatedEvent = { ...event, start, end, allDay: false };
    const nextTimeblocks = [...timeblocks];
    nextTimeblocks.splice(idx, 1, updatedEvent);
    setTimeblocks(nextTimeblocks);
  };

  const resizeTimeblock = ({ event: timeblock, start, end }) => {
    const nextEvents = timeblocks.map((existingEvent) => {
      return existingEvent.id === timeblock.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });
    setTimeblocks(nextEvents);
  };

  const deleteTimeblock = (timeblockId) => {
    setTimeblocks((currentEvents) =>
      currentEvents.filter((timeblock) => timeblock.id !== timeblockId)
    );
  };

  const CustomTimeblock = ({ event: timeblock }) => {
    const formatTime = (date) => {
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
    };

    return (
      <div
        style={{
          backgroundColor: preferenceColor(timeblock.preference),
          padding: "4px",
          borderRadius: "5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Displaying the start to end time */}
        <span style={{ color: "black", fontSize: "smaller" }}>
          {formatTime(timeblock.start)} - {formatTime(timeblock.end)}
        </span>

        {/* Delete button */}
        <button
          onClick={() => deleteTimeblock(timeblock.id)}
          style={{
            color: "black",
            cursor: "pointer",
            fontSize: "smaller",
            padding: "0px 5px",
          }}
        >
          X
        </button>
      </div>
    );
  };

  const timeblockStyleGetter = (timeblock) => {
    let backgroundColor = "#C7C9C6"; // Default background color
    if (timeblock.preference) {
      switch (timeblock.preference) {
        case "High":
          backgroundColor = "#CCE5CC";
          break;
        case "Medium":
          backgroundColor = "#E4F1D0";
          break;
        case "Low":
          backgroundColor = "#E6FFB2";
          break;
        default:
          backgroundColor = "#3174ad";
      }
    }

    return {
      style: {
        backgroundColor,
        opacity: 0.8,
        border: "0px solid white",
      },
    };
  };

  const formats = {
    // remove the default time inside the timeblock
    eventTimeRangeFormat: () => {
      return "";
    },
  };

  const newTimeblock = (slotInfo) => {
    const currentTime = new Date();
    const selectedStartTime = new Date(slotInfo.start);
    const selectedEndTime = new Date(slotInfo.end);

    // Ensure a preference is selected
    if (!preference) {
      alert("Please select a preference before creating a timeblock.");
      return; // Exit the function
    }
    // Check if the selected start time is in the past
    if (selectedStartTime < currentTime) {
      alert("You cannot add a timeblock in the past.");
      return; // Exit the function
    }

    // Check for overlapping timeblocks
    const isOverlapping = timeblocks.some((timeblock) => {
      return (
        selectedStartTime < new Date(timeblock.end) &&
        selectedEndTime > new Date(timeblock.start)
      );
    });

    if (isOverlapping) {
      alert("Schedule time cannot overlap.");
      return; // Exit the function
    }

    const newId =
      Math.max(0, ...timeblocks.map((timeblock) => timeblock.id)) + 1;
    const newTimeblock = {
      id: newId,
      start: slotInfo.start,
      end: slotInfo.end,
      preference: preference,
    };

    setTimeblocks([...timeblocks, newTimeblock]);
  };

  function preferenceColor(preference) {
    switch (preference) {
      case "High":
        return "#008000";
      case "Medium":
        return "#4EF312";
      case "Low":
        return "#B2FF59";
      default:
        return "#d3d3d3";
    }
  }

  const preferenceColors = {
    High: "#008000",
    Medium: "#4EF312",
    Low: "#B2FF59",
  };

  return (
    <div className="">
      {/* Left Side  */}
      <Grid container spacing={1} sx={{ p: 3, justifyContent: "center" }}>
        {/* Form Section */}
        <Grid item xs={12} md={4} lg={2.7}>
          {" "}
          <Box
            sx={{
              maxWidth: { xs: "100%", md: "400px" },
              p: 3,
              boxShadow: 2,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
              Create Event
            </Typography>

            {/* Event Title */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                id="event-title"
                label="Event Title"
                variant="outlined"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </Box>

            {/* Set Deadline */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <TextField
                  type="date"
                  id="deadline-date"
                  label="Deadline Date"
                  InputLabelProps={{ shrink: true }}
                  value={deadline.date}
                  onChange={handleDateChange}
                  required
                />
              </FormControl>
            </Box>

            {/* Selecting Event Duration */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="event-duration-label">
                  Select Event Duration
                </InputLabel>
                <Select
                  labelId="event-duration-label"
                  id="event-duration"
                  value={eventDuration}
                  label="Select Event Duration"
                  onChange={handleDurationChange}
                >
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={60}>60 minutes</MenuItem>
                  <MenuItem value={120}>120 minutes</MenuItem>
                  <MenuItem value={150}>150 minutes</MenuItem>
                  <MenuItem value={180}>180 minutes</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Selecting Event Type */}
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Select an Event Type</FormLabel>
              <RadioGroup
                row
                aria-label="event-type"
                name="event-type"
                value={eventType}
                onChange={handleEventTypeChange}
              >
                <FormControlLabel
                  value="in_person"
                  control={<Radio />}
                  label="In Person"
                />
                <FormControlLabel
                  value="video"
                  control={<Radio />}
                  label="Video"
                />
                <FormControlLabel
                  value="phone"
                  control={<Radio />}
                  label="Phone"
                />
              </RadioGroup>
            </FormControl>

            {/* Preference */}
            <FormControl component="fieldset" sx={{ mb: 2, width: "100%" }}>
              <FormLabel component="legend">Preferences</FormLabel>
              <RadioGroup
                row
                aria-label="preference"
                name="preference"
                value={preference}
                onChange={handlePreferenceChange}
              >
                {["High", "Medium", "Low"].map((pref) => (
                  <FormControlLabel
                    key={pref}
                    value={pref}
                    control={
                      <Radio
                        sx={{
                          "&.Mui-checked": {
                            color: preferenceColors[pref], // Apply color to the radio button when it's checked
                          },
                          color: preferenceColors[pref], // This will color the unchecked state as well
                        }}
                      />
                    }
                    label={pref}
                    sx={{
                      color: preferenceColors[pref], // Apply color to the label text based on the preference
                      flexGrow: 1,
                      ".MuiFormControlLabel-label": {
                        // This targets the label within FormControlLabel
                        color: preferenceColors[pref], // Apply the color to the label text
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* Description Box */}
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                id="description"
                label="Description/Instructions"
                multiline
                rows={4}
                value={description}
                onChange={handleDescriptionChange}
              />
            </Box>

            {/* Select Invitees */}
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="invitees-label">Invitee</InputLabel>
                <Select
                  labelId="invitees-label"
                  id="invitees"
                  value={selectedInvitee}
                  label="Invitee"
                  onChange={handleInviteeChange}
                >
                  {contacts.map((contact) => (
                    <MenuItem key={contact.id} value={contact.id}>
                      {contact.userDetails
                        ? contact.userDetails.username
                        : "Loading..."}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Error Message */}
            {errorMessages.length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessages.map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
              </Alert>
            )}

            {/* Create Meeting Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Create Event
              </Button>
            </Box>
          </Box>
        </Grid>
        {/* Calendar Component */}
        <Grid item xs={12} md={8} lg={9}>
          {" "}
          {/* Adjusts to full width on xs screens, 2/3 on medium and 3/5 on large screens */}
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 3,
              borderRadius: 2,
              boxShadow: 2,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              minHeight: 800,
              mx: "auto", // Centers the box
            }}
          >
            <DnDCalendar
              selectable
              localizer={localizer}
              events={timeblocks}
              onEventDrop={moveTimeblock}
              resizable
              onEventResize={resizeTimeblock}
              onSelectSlot={newTimeblock}
              defaultView="week"
              defaultDate={new Date()}
              components={{
                event: (props) => <CustomTimeblock {...props} />,
              }}
              formats={formats}
              eventPropGetter={timeblockStyleGetter}
              style={{ height: "100%", flex: 1 }} // Make the calendar responsive to the Box's height
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default CreateEventPage;
