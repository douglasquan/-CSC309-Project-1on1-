import React, { useState, useEffect, useContext } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AuthContext from "../context/AuthContext";
import { getContacts } from "../controllers/ContactsController";
import { getUserDetails } from "../controllers/UserController";
import { addEvent } from "../controllers/EventsController";

// Assume events is an array of your event objects
import events from "./events";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(BigCalendar);

function CreateEventPage() {
  const [timeblock, setTimeblock] = useState(events);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [eventType, setEventType] = useState("");
  const [preference, setPreference] = useState("");
  const [deadline, setDeadline] = useState({ date: "" });
  const [description, setDescription] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedInvitee, setSelectedInvitee] = useState("");
  const [selectedContactUserId, setSelectedContactUserId] = useState("");
  const { authTokens } = useContext(AuthContext); // Assuming you're using AuthContext for tokens
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

  const handleInviteeChange = (event) => {
    const { value } = event.target;
    // Find the contact by its id from the contact list
    const selectedContact = contacts.find(
      (contact) => contact.id.toString() === value
    );

    if (selectedContact) {
      // Update both selectedInvitee with the contact list ID
      setSelectedInvitee(value);
      setSelectedContactUserId(selectedContact.contact);
    } else {
      setSelectedInvitee("");
      setSelectedContactUserId("");
    }
  };

  const handleSubmit = (e) => {
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
    console.log(eventData);
    console.log(timeblock)
    addEvent(eventData, authTokens)
      .then((data) => {
        console.log("Event added successfully:", data);
        // Handle post-submission logic, such as redirecting or clearing the form
      })
      .catch((error) => {
        console.error("Error adding event:", error);
        // Parsing error message object and setting error messages
        const messages = Object.keys(error).reduce((acc, key) => {
          const messageArray = error[key];
          const messageText = messageArray.join(" ");
          acc.push(`${key}: ${messageText}`);
          return acc;
        }, []);

        setErrorMessages(messages);
      });
  };

  // Calendar Timeblock:

  const moveTimeblock = ({
    event,
    start,
    end,
    isAllDay: droppedOnAllDaySlot,
  }) => {
    const idx = timeblock.indexOf(event);
    const updatedEvent = { ...event, start, end, allDay: droppedOnAllDaySlot };
    const nextEvents = [...timeblock];
    nextEvents.splice(idx, 1, updatedEvent);
    setTimeblock(nextEvents);
  };

  const resizeTimeblock = ({ event, start, end }) => {
    const nextEvents = timeblock.map((existingEvent) => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });
    setTimeblock(nextEvents);
  };

  const deleteTimeblock = (eventId) => {
    setTimeblock((currentEvents) =>
      currentEvents.filter((event) => event.id !== eventId)
    );
  };

  const CustomTimeblock = ({ event }) => {
    const formatTime = (date) => {
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
    };

    return (
      <div
        style={{
          backgroundColor: preferenceColor(event.preference),
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
          {formatTime(event.start)} - {formatTime(event.end)}
        </span>

        {/* Delete button */}
        <button
          onClick={() => deleteTimeblock(event.id)}
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

  const timeblockStyleGetter = (event) => {
    let backgroundColor = "#C7C9C6"; // Default background color
    if (event.preference) {
      switch (event.preference) {
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
    const title = "";
    const newId = Math.max(0, ...timeblock.map((event) => event.id)) + 1; // Adjusted to handle when timeblock is empty
    const newEvent = {
      id: newId,
      title,
      start: slotInfo.start,
      end: slotInfo.end,
      allDay: slotInfo.slots.length === 1,
      preference: preference,
    };
    setTimeblock([...timeblock, newEvent]);
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
  return (
    <div className="bg-custom-gradient m-2">
      <div className="flex flex-col md:flex-row gap-4 m-9">
        {/* Left Side  */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3 lg:w-2/5 mx-auto">
          {/* Form Section */}
          <div className="flex-auto my-6 lg:items-center justify-between">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold mb-0 mr-4">Create Event</h2>
            </div>
          </div>

          {/* Event Title */}
          <div className="mb-4 flex items-center gap-4">
            <label
              htmlFor="event-title"
              className="block text-lg flex-shrink-0"
            >
              Event Title:
            </label>
            <input
              id="event-title"
              className="flex-grow bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 text-sm"
              placeholder="Quick Event"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
          </div>

          {/* Set Deadline */}
          <div className="my-6 flex items-center gap-4">
            <label
              htmlFor="deadline-date"
              className="block text-lg font-medium text-gray-700"
              style={{ flexBasis: "35%" }} // Adjust the width of the label as needed
            >
              Deadline Date:
            </label>
            <div className="flex-1">
              <input
                type="date"
                id="deadline-date"
                className="p-2.5 border border-gray-300 rounded-lg block w-full"
                value={deadline.date}
                onChange={handleDateChange}
                required // Making sure the user knows this field is required
              />
            </div>
          </div>

          {/* Selecting Event Duration */}
          <div className="flex my-6 items-center w-full">
            <label
              htmlFor="event-duration"
              className="block text-lg lg:text-base flex-none lg:flex-1" // Ensures the label has a minimum width
            >
              Select Event Duration:
            </label>
            <div className="flex-1 relative">
              <select
                id="event-duration"
                className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
                value={eventDuration}
                onChange={handleDurationChange}
              >
                <option value="" disabled>
                  Select duration
                </option>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
                <option value="150">150 minutes</option>
                <option value="180">180 minutes</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Select Event Type */}
          <div className="my-6 flex flex-col lg:flex-row gap-4">
            <label className="block text-lg lg:text-base flex-none lg:flex-1">
              Select an Event Type*
            </label>
            <div className="flex gap-2">
              {[
                { label: "In Person", value: "in_person" },
                { label: "Phone", value: "phone" },
                { label: "Video", value: "video" },
              ].map((type) => (
                <div key={type.value} className="flex items-center">
                  <input
                    id={type.value}
                    name="event-type"
                    type="radio"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    value={type.value}
                    checked={eventType === type.value}
                    onChange={handleEventTypeChange}
                  />
                  <label
                    htmlFor={type.value}
                    className="ml-2 block text-sm font-medium text-gray-700"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="my-6 flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <h1 className="text-lg lg:text-base flex-none lg:flex-1">
              Preferences
            </h1>
            <div className="flex gap-2">
              {["High", "Medium", "Low"].map((pref) => (
                <div
                  key={pref}
                  className={`w-full border-b sm:border bg-green-${pref.toLowerCase()} rounded-lg`}
                >
                  <div className="flex items-center ps-3 mx-2">
                    <input
                      id={pref}
                      type="radio"
                      value={pref}
                      name="Preferences"
                      className="h-8 w-8" // Keeping the radio button size as previously adjusted
                      checked={preference === pref}
                      onChange={handlePreferenceChange}
                    />
                    {/* Reduced vertical padding for the label to decrease container height */}
                    <label
                      htmlFor={pref}
                      className="w-full py-1 ms-2 text-sm font-medium"
                    >
                      {pref}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description Box */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description/Instructions
            </label>
            <textarea
              id="description"
              rows="4"
              className="form-textarea mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5"
              placeholder="Add any information relevant to this event"
              value={description}
              onChange={handleDescriptionChange}
            ></textarea>
          </div>

          {/* Select Invitees */}
          <div className="mb-4">
            <label
              htmlFor="invitees"
              className="text-sm font-medium text-gray-700"
            >
              Invitees:
            </label>
            <select
              id="invitees"
              name="invitees"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 w-full lg:w-auto"
              value={selectedInvitee}
              onChange={handleInviteeChange}
            >
              <option value="">Choose an invitee</option>
              {/* Use contact.id for value as needed for filtering */}
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.userDetails
                    ? contact.userDetails.username
                    : "Loading..."}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          <div>
            {errorMessages.length > 0 && (
              <div style={{ color: "red", marginTop: "10px" }}>
                {errorMessages.map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
              </div>
            )}
          </div>

          {/* Create Meeting Button */}
          <div className="flex justify-end">
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              onClick={handleSubmit}
            >
              Create Event
            </button>
          </div>
        </div>

        {/* Calendar Component */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-4/5 flex-col">
          <DnDCalendar
            selectable
            localizer={localizer}
            events={timeblock}
            onEventDrop={moveTimeblock}
            resizable
            onEventResize={resizeTimeblock}
            onSelectSlot={newTimeblock}
            defaultView="week"
            defaultDate={new Date()}
            style={{ height: "800px" }}
            components={{
              event: (props) => (
                <CustomTimeblock {...props} preference={preference} />
              ),
            }}
            formats={formats}
            eventPropGetter={timeblockStyleGetter}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateEventPage;
