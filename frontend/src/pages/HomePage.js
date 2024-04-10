import React, { useState, useEffect, useContext } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import BasicTabs from "../components/Tab";
import { fetchEventsByHost, fetchEventsByInvitee } from "../controllers/EventsController";
import { getUserDetails } from "../controllers/UserController"; // Assuming this exists
import AuthContext from "../context/AuthContext";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {  deleteEvent,} from "../controllers/EventsController";

const EventComponent = ({ event }) => {
  const startTime = moment(event.start).format("LT");
  const endTime = moment(event.end).format("LT");
  let backgroundColor = event.is_host ? "#DBF3E1" : "#FFDDC1"; // Example: greenish for host, orangish for invitee

  return (
    <div
      style={{
        backgroundColor: backgroundColor, 
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
        padding: "4px",
        width: "100%",
      }}
    >
      
      <div style={{ color: "black" }}>{event.title}</div>
      <div style={{ color: "black", fontSize: "smaller",  marginTop: "4px" }}>{`${startTime} - ${endTime}`}</div>
    </div>
  );
};

const HomePage = () => {
  const { authTokens, user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const localizer = momentLocalizer(moment);
  const EventComponentWrapper = (props) => (
    <EventComponent {...props} view={currentView} />
  );
  const [currentView, setCurrentView] = useState("week");

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId, authTokens);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  useEffect(() => {
    const fetchEventsForUser = async () => {
      setIsLoading(true);
      try {
        // Fetch events hosted by the user
        const hostedEvents = await fetchEventsByHost(user.user_id, authTokens);
        
        // Fetch events where the user is the invitee
        // Assuming fetchEventsByInvitee is similar to fetchEventsByHost
        const invitedEvents = await fetchEventsByInvitee(user.user_id, authTokens);
  
        const combinedEvents = [...hostedEvents, ...invitedEvents];
        
        // Filter events with status "F" and fetch invitee details (if needed)
        const finalizedEvents = combinedEvents.filter(event => event.status === "F");
  
        const eventsWithDetails = await Promise.all(finalizedEvents.map(async (event) => {
          const inviteeDetails = await getUserDetails(event.invitee, authTokens);
          const isHost = event.host === user.user_id;
          return { ...event, inviteeDetails, is_host: isHost };        }));
  
        setEvents(eventsWithDetails);
      } catch (e) {
        console.error("Failed to fetch events:", e);
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchEventsForUser();
  }, [user.user_id, authTokens]);

  console.log(events);

  // Convert your event data to the format required by BigCalendar
  const calendarEvents = events.map((finalizedEvent) => ({
    title: finalizedEvent.is_host 
      ? `${finalizedEvent.event_title} - ${user.username}` // Use host username when is_host is true
      : `${finalizedEvent.event_title} - ${finalizedEvent.inviteeDetails.username}`, // Use invitee username otherwise
    start: moment(finalizedEvent.finalized_start_time).toDate(),
    end: moment(finalizedEvent.finalized_end_time).toDate(),
    is_host: finalizedEvent.is_host,
  }));
  

  const formats = {
    // remove the default time inside the timeblock
    eventTimeRangeFormat: () => {
      return "";
    },
  };
  
  const eventStyleGetter = (event) => {
    let backgroundColor = event.is_host ? "#DBF3E1" : "#FFDDC1"; // Example: greenish for host, orangish for invitee
    return {
      style: {
        backgroundColor,
        opacity: 0.8,
        border: "0px solid white",
      },
    };  
  }

  if (isLoading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box className="min-h-screen" sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {/* Left container with tabs */}
        <Grid item xs={12} md={4} lg={4}>
          <BasicTabs onDelete={handleDeleteEvent} />
        </Grid>

        {/* Right container - Calendar Component */}
        <Grid item xs={12} md={8} lg={8}>
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
            <Calendar
              resizable
              onView={(view) => setCurrentView(view)}
              defaultView="month"
              localizer={localizer}
              formats={formats}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              components={{
                event: EventComponentWrapper, 
              }}
              eventPropGetter={eventStyleGetter}

              style={{ height: 1000 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
