import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AuthContext from "../context/AuthContext";
import { getContacts } from "../controllers/ContactsController";
import { getUserDetails } from "../controllers/UserController";
import { addEvent } from "../controllers/EventsController";
import { createAvailability } from "../controllers/AvailabilityController";
import { useNotification } from "../components/NotificationContext";
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
  Select,
  MenuItem,
  Alert,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Container,
} from "@mui/material";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(BigCalendar);

function getSteps() {
  return ["Fill Event Details", "Choose Preferences & Times"];
}

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
  const [activeStep, setActiveStep] = useState(0);
  const [dynamicStyles, setDynamicStyles] = useState({});

  const [eventTitleError, setEventTitleError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");
  const [eventDurationError, setEventDurationError] = useState("");
  const [eventTypeError, setEventTypeError] = useState("");
  const [inviteeError, setInviteeError] = useState("");

  const { authTokens, user } = useContext(AuthContext);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { triggerNotification } = useNotification();

  const validateForm = () => {
    let isValid = true;

    if (!eventTitle) {
      setEventTitleError("Event title is required.");
      isValid = false;
    } else {
      setEventTitleError("");
    }

    if (!deadline.date) {
      setDeadlineError("Deadline is required.");
      isValid = false;
    } else {
      setDeadlineError("");
    }

    if (!eventDuration) {
      setEventDurationError("Event duration is required.");
      isValid = false;
    } else {
      setEventDurationError("");
    }

    if (!eventType) {
      setEventTypeError("Event type is required.");
      isValid = false;
    } else {
      setEventTypeError("");
    }

    if (!selectedInvitee) {
      setInviteeError("An invitee must be selected.");
      isValid = false;
    } else {
      setInviteeError("");
    }

    return isValid;
  };

  const history = useHistory();

  // -------stepper-------
  const steps = getSteps();
  // All other state declarations remain the same

  const handleNext = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  // -------stepper-------

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
              const userDetails = await getUserDetails(contact.contact, authTokens);
              return { ...contact, userDetails }; // Combine contact with userDetails
            } catch (error) {
              console.error(`Error fetching details for contact ${contact.contact}:`, error);
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

  // Dynamically adjust the length of the stepper line
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const dynamicMargin = Math.max(20, windowWidth * 0.1); // Example calculation
      setDynamicStyles({
        "--dynamicMargin": `${dynamicMargin}px`,
      });
    };

    // Call once to set initial state
    handleResize();

    // Add window resize listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setEventTitle(value);

    if (value) {
      setEventTitleError("");
    }
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDeadline({ date: value });
    if (value) {
      setDeadlineError("");
    }
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    setEventDuration(value);
    if (value) {
      setEventDurationError("");
    }
  };

  const handleEventTypeChange = (e) => {
    const value = e.target.value;
    setEventType(value);
    if (value) {
      setEventTypeError("");
    }
  };

  const handlePreferenceChange = (e) => {
    setPreference(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleInviteeChange = (e) => {
    const value = e.target.value;
    const selectedContact = contacts.find((contact) => contact.id === value);
    if (selectedContact) {
      setSelectedInvitee(value);
      setSelectedContactUserId(selectedContact.contact);
      setInviteeError("");
    } else {
      setSelectedInvitee("");
      setSelectedContactUserId("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      triggerNotification("Event Created Successfully");
      history.push("/");

      console.log("All availabilities created successfully");
    } catch (error) {
      console.error("Error in the process:", error);
    }
  };

  // Calendar Timeblock:

  const moveTimeblock = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const currentTime = new Date();
    const newStartTime = new Date(start);
    const newEndTime = new Date(end);

    // Prevent moving timeblock to the past
    if (newStartTime < currentTime) {
      setAlertMessage("You cannot move a timeblock to a time in the past.");
      return;
    }

    // Check if the new end time is later than the deadline
    if (moment(end).isAfter(moment(deadline.date))) {
      setShowAlert(true);
      setAlertMessage("Timeblock end time cannot be later than the event deadline.");
      return;
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
      return;
    }

    const idx = timeblocks.indexOf(event);
    const updatedEvent = { ...event, start, end, allDay: false };
    const nextTimeblocks = [...timeblocks];
    nextTimeblocks.splice(idx, 1, updatedEvent);
    setTimeblocks(nextTimeblocks);
  };

  const resizeTimeblock = ({ event: timeblock, start, end }) => {
    const nextEvents = timeblocks.map((existingEvent) => {
      return existingEvent.id === timeblock.id ? { ...existingEvent, start, end } : existingEvent;
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
      setAlertMessage("Please select a preference before creating a timeblock.");
      return; // Exit the function
    }

    // Check if the selected end time is later than the deadline
    if (moment(slotInfo.end).isAfter(moment(deadline.date))) {
      setShowAlert(true);
      setAlertMessage("Timeblock end time cannot be later than the event deadline.");
      return;
    }

    // Check if the selected start time is in the past
    if (selectedStartTime < currentTime) {
      setAlertMessage("You cannot add a timeblock in the past.");
      return; // Exit the function
    }

    // Check for overlapping timeblocks
    const isOverlapping = timeblocks.some((timeblock) => {
      return (
        selectedStartTime < new Date(timeblock.end) && selectedEndTime > new Date(timeblock.start)
      );
    });

    if (isOverlapping) {
      setAlertMessage("Schedule time cannot overlap.");
      return; // Exit the function
    }

    const newId = Math.max(0, ...timeblocks.map((timeblock) => timeblock.id)) + 1;
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
    <Container>
      {showAlert && (
        <Alert
          severity='warning'
          onClose={() => setShowAlert(false)} // Adds a close icon to dismiss the alert
          sx={{ mb: 2 }} // Margin bottom for spacing
        >
          {alertMessage}
        </Alert>
      )}
      <Box
        sx={{
          width: "100%",
          maxWidth: activeStep === 0 ? 700 : "90%",
          mx: "auto",
          my: 4,
        }}
      >
        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 2,
            padding: 0,
            // Assuming direct usage within `sx` might not directly work for dynamic values like this
          }}
          style={dynamicStyles} // Apply dynamic styles as regular inline styles
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length ? (
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
        ) : (
          <div>
            {activeStep === 0 && (
              // Create Event Form
              <Box
                sx={{
                  p: 3,
                  boxShadow: 2,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  height: "auto",
                }}
              >
                <Typography variant='h4' component='h2' sx={{ mb: 2 }}>
                  Create Event
                </Typography>

                {/* Event Title */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    id='event-title'
                    label='Event Title'
                    variant='outlined'
                    value={eventTitle}
                    onChange={handleTitleChange}
                    error={!!eventTitleError}
                    helperText={eventTitleError}
                  />
                </Box>

                {/* Set Deadline */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <FormControl fullWidth>
                    <TextField
                      type='date'
                      id='deadline-date'
                      label='Deadline Date'
                      InputLabelProps={{ shrink: true }}
                      value={deadline.date}
                      onChange={handleDateChange}
                      required
                      error={!!deadlineError}
                      helperText={deadlineError}
                    />
                  </FormControl>
                </Box>

                {/* Selecting Event Duration */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel id='event-duration-label'>Select Event Duration</InputLabel>
                    <Select
                      labelId='event-duration-label'
                      id='event-duration'
                      value={eventDuration}
                      label='Select Event Duration'
                      onChange={handleDurationChange}
                      error={!!eventDurationError}
                      helperText={eventDurationError}
                    >
                      <MenuItem value={30}>30 minutes</MenuItem>
                      <MenuItem value={60}>60 minutes</MenuItem>
                      <MenuItem value={90}>90 minutes</MenuItem>
                      <MenuItem value={120}>120 minutes</MenuItem>
                      <MenuItem value={150}>150 minutes</MenuItem>
                      <MenuItem value={180}>180 minutes</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Selecting Event Type */}
                <FormControl component='fieldset' sx={{ mb: 2 }}>
                  <FormLabel component='legend'>Select an Event Type</FormLabel>
                  <RadioGroup
                    row
                    aria-label='event-type'
                    name='event-type'
                    value={eventType}
                    onChange={handleEventTypeChange}
                    error={!!eventTypeError}
                    helperText={eventTypeError}
                  >
                    <FormControlLabel value='in_person' control={<Radio />} label='In Person' />
                    <FormControlLabel value='video' control={<Radio />} label='Video' />
                    <FormControlLabel value='phone' control={<Radio />} label='Phone' />
                  </RadioGroup>
                </FormControl>

                {/* Description Box */}
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    id='description'
                    label='Description/Instructions'
                    multiline
                    rows={4}
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </Box>

                {/* Select Invitees */}
                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel id='invitees-label'>Invitee</InputLabel>
                    <Select
                      labelId='invitees-label'
                      id='invitees'
                      value={selectedInvitee}
                      label='Invitee'
                      onChange={handleInviteeChange}
                      error={!!inviteeError}
                      helperText={inviteeError}
                    >
                      {contacts.map((contact) => (
                        <MenuItem key={contact.id} value={contact.id}>
                          {contact.userDetails ? contact.userDetails.username : "Loading..."}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}
            {activeStep === 1 && (
              <Box
                sx={{
                  p: 3,
                  boxShadow: 2,
                  borderRadius: 2,
                  maxHeight: "70vh",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  mb: 2,
                  backgroundColor: "background.default",
                }}
              >
                {/* Preference */}
                <Box
                  sx={{
                    mb: 1,
                    padding: 1,
                    // backgroundColor: "action.selected",
                    borderRadius: 1,
                    height: "70px", // Add this line to reduce the height of the box
                  }}
                >
                  <FormControl component='fieldset' sx={{ mb: 2, width: "100%" }}>
                    <FormLabel component='legend'>Select Your Preferred Date and Time</FormLabel>

                    <RadioGroup
                      row
                      aria-label='preference'
                      name='preference'
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
                            // color: preferenceColors[pref], // Apply color to the label text based on the preference
                            flexGrow: 1,
                            ".MuiFormControlLabel-label": {
                              // This targets the label within FormControlLabel
                              // color: preferenceColors[pref], // Apply the color to the label text
                              fontSize: "small", // Decrease the font size for the label text
                            },
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
                {/* Calendar */}
                <Box sx={{ flexGrow: 1 }}>
                  <DnDCalendar
                    selectable
                    localizer={localizer}
                    events={timeblocks}
                    onEventDrop={moveTimeblock}
                    resizable
                    onEventResize={resizeTimeblock}
                    onSelectSlot={newTimeblock}
                    defaultView='week'
                    defaultDate={new Date()}
                    components={{
                      event: (props) => <CustomTimeblock {...props} />,
                    }}
                    formats={formats}
                    eventPropGetter={timeblockStyleGetter}
                    style={{ height: "100%", flex: 1 }} // Make the calendar responsive to the Box's height
                  />
                </Box>
              </Box>
            )}
            {/* step back and next button */}
            <Box sx={{ display: "flex", justifyContent: "center", pt: 2, mt: 2 }}>
              <Button
                color='inherit'
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                /* Create Meeting Button */
                <Button variant='contained' onClick={handleSubmit}>
                  Create Meeting
                </Button>
              ) : (
                <Button onClick={handleNext}>Next</Button>
              )}
            </Box>
          </div>
        )}
      </Box>
    </Container>
  );
}

export default CreateEventPage;
