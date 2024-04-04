import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import CSS for BigCalendar

// Assume events is an array of your event objects
import events from './events'; 

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(BigCalendar);

function CreateEventPage() {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDuration, setEventDuration] = useState('');
  const [customDuration, setCustomDuration] = useState({ value: '', unit: 'minutes' });
  const [eventType, setEventType] = useState('');
  const [preference, setPreference] = useState('');
  const [deadline, setDeadline] = useState({ set: false, date: '' });
  const [description, setDescription] = useState('');
  const [selectedInvitee, setSelectedInvitee] = useState('');

  const toggleDeadline = () => {
    setDeadline({ ...deadline, set: !deadline.set });
  };

  const handleDateChange = (e) => {
    setDeadline({ ...deadline, date: e.target.value });
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    setEventDuration(value);
  };

  const handleCustomDurationChange = (e) => {
    const { name, value } = e.target;
    setCustomDuration(prevState => ({ ...prevState, [name]: value }));
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
    setSelectedInvitee(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you would handle the form submission,
    // such as sending data to a backend server or processing it further.
    console.log({
      eventDuration,
      customDuration,
      eventType,
      preference,
      description,
      selectedInvitee,
    });
    // After successful submission, you might want to redirect the user or clear the form.
  };


  // Calendar Timeblock:
  const [timeblock, setTimeblock] = useState(events);

  const moveTimeblock = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const idx = timeblock.indexOf(event);
    const updatedEvent = { ...event, start, end, allDay: droppedOnAllDaySlot };
    const nextEvents = [...timeblock];
    nextEvents.splice(idx, 1, updatedEvent);
    setTimeblock(nextEvents);
  };

  const resizeTimeblock = ({ event, start, end }) => {
    const nextEvents = timeblock.map(existingEvent => {
      return existingEvent.id === event.id ? { ...existingEvent, start, end } : existingEvent;
    });
    setTimeblock(nextEvents);
  };
  
  const deleteTimeblock = (eventId) => {
    setTimeblock(currentEvents => currentEvents.filter(event => event.id !== eventId));
  };

  const CustomTimeblock = ({ event }) => {
    const formatTime = (date) => {
      const options = { hour: 'numeric', minute: 'numeric', hour12: true };
      return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    };

    return (
      <div
        style={{
          backgroundColor: preferenceColor(event.preference),
          padding: '4px',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%', 
        }}
      >
        {/* Displaying the start to end time */}
        <span style={{ color: 'black', fontSize: 'smaller' }}>
          {formatTime(event.start)} - {formatTime(event.end)}
        </span>

        {/* Delete button */}
        <button
          onClick={() => deleteTimeblock(event.id)}
          style={{
            color: 'black',
            cursor: 'pointer',
            fontSize: 'smaller',
            padding: '0px 5px',
          }}
        >
          X
        </button>
      </div>
    );
  };

  const timeblockStyleGetter = (event) => {
    let backgroundColor = '#C7C9C6'; // Default background color
    if (event.preference) {
      switch (event.preference) {
        case 'High':
          backgroundColor = '#CCE5CC'; 
          break;
        case 'Medium':
          backgroundColor = '#E4F1D0'; 
          break;
        case 'Low':
          backgroundColor = '#E6FFB2'; 
          break;
        default:
          backgroundColor = '#3174ad'; 
      }
    }

    return {
      style: {
        backgroundColor,
        opacity: 0.8,
        border: '0px solid white', 
      }
    };
  };

  const formats = {
    // remove the default time inside the timeblock
    eventTimeRangeFormat: () => { 
      return "";
    },
  };

  function preferenceColor(preference) {
    switch (preference) {
      case 'High':
        return "#008000"; 
      case 'Medium':
        return "#4EF312"; 
      case 'Low':
        return "#B2FF59";
      default:
        return '#d3d3d3'; 
    }
  }
  

  const newTimeblock = (slotInfo) => {
    const title = ''; 
    const newId = Math.max(0, ...timeblock.map(event => event.id)) + 1; // Adjusted to handle when timeblock is empty
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
            <label htmlFor="event-title" className="block text-lg flex-shrink-0">Event Title:</label>
            <input
              id="event-title"
              className="flex-grow bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 text-sm"
              placeholder="Quick Event"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
          </div>

          {/* Set Deadline */}
          <div className="my-6">
            <div className="flex items-center mb-4">
              <input
                id="deadline-checkbox"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={deadline.set}
                onChange={toggleDeadline}
              />
              <label htmlFor="deadline-checkbox" className="ml-2 text-sm font-medium text-gray-700">Set a deadline</label>
            </div>

            {deadline.set && (
              <div>
                <input
                  type="date"
                  className="p-2.5 border border-gray-300 rounded-lg block"
                  value={deadline.date}
                  onChange={handleDateChange}
                />
              </div>
            )}
          </div>

          {/* Selecting Event Duration */}
          <div className="flex my-6">
            <div className="flex flex-col lg:flex-row gap-4 w-full">
              <label htmlFor="event-duration" className="block text-lg lg:text-base lg:flex-shrink-0">Select Event Duration*</label>
              <select id="event-duration" className="w-full lg:w-1/6 p-2 border rounded" value={eventDuration} onChange={handleDurationChange}>
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
                <option>3 hours</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {/* Custom duration input fields, show if eventDuration is 'custom' */}
          {eventDuration === 'custom' && (
            <div className="space-y-2 my-5 w-full sm:w-1/3">
              <input type="number" placeholder="Enter duration" className="p-2 border rounded w-full" name="duration" value={customDuration.duration} onChange={handleCustomDurationChange} />
              <select className="p-2 border rounded w-full" name="unit" value={customDuration.unit} onChange={handleCustomDurationChange}>
                <option value="minutes">minutes</option>
                <option value="hours">hours</option>
              </select>
            </div>
          )}

          {/* Select Event Type */}
          <div className="my-6 flex flex-col lg:flex-row gap-4">
            <label className="block text-lg lg:text-base flex-none lg:flex-1">Select a Event Type*</label>
            <div className="flex gap-2">
              {["In Person", "Phone", "Video"].map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    id={type}
                    name="event-type"
                    type="radio"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    value={type}
                    checked={eventType === type}
                    onChange={handleEventTypeChange}
                  />
                  <label htmlFor={type} className="ml-2 block text-sm font-medium text-gray-700">{type}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="my-6 flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <h1 className="text-lg lg:text-base flex-none lg:flex-1">Preferences</h1>
            <div className="flex gap-2">
              {["High", "Medium", "Low"].map((pref) => (
                <div key={pref} className={`w-full border-b sm:border bg-green-${pref.toLowerCase()} rounded-lg`}>
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
                    <label htmlFor={pref} className="w-full py-1 ms-2 text-sm font-medium">{pref}</label>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Description Box */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description/Instructions</label>
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
            <label htmlFor="invitees" className="text-sm font-medium text-gray-700">Invitees:</label>
            <select
              id="invitees"
              name="invitees"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 w-full lg:w-auto"
              value={selectedInvitee}
              onChange={handleInviteeChange}
            >
              <option value="">Choose an invitee</option>
              {/* Assuming these options are dynamic, they should come from a state or props */}
              <option value="1">[contact 1]</option>
              <option value="2">[contact 2]</option>
              <option value="3">[contact 3]</option>
              <option value="4">[contact 4]</option>
              <option value="5">[contact 5]</option>
            </select>
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
        <div class="bg-white p-6 rounded-lg shadow-md w-full md:w-4/5 flex-col">

          <DnDCalendar
            selectable
            localizer={localizer}
            events={timeblock}
            onEventDrop={moveTimeblock}
            resizable
            onEventResize={resizeTimeblock}
            onSelectSlot={newTimeblock} // Updated to use newTimeblock
            defaultView="week"
            defaultDate={new Date()}
            style={{ height: '800px' }}
            components={{
              event: (props) => <CustomTimeblock {...props} preference={preference} />,
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
