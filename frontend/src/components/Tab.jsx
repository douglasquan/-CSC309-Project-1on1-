import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Drawer from "@mui/material/Drawer";

import AuthContext from "../context/AuthContext";
import {
  fetchEventsByHost,
  fetchEventsByInvitee,
  fetchEventDetails,
  deleteEvent,
} from "../controllers/EventsController";
import { getUserDetails } from "../controllers/UserController";
import RequestAvailabilityDialog from "./RequestAvailabilityDialog";
import ViewEventPage from "../pages/ViewEventPage";

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={onConfirm} color='primary' autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function MeetingItem({
  eventId,
  eventName,
  inviteeId,
  authTokens,
  onEdit,
  onDelete,
  onFinalize,
  onRequest,
  onAccept,
  onView,
  context,
  createdAt,
  updatedAt,
  isActive,
}) {
  const [inviteeUsername, setInviteeUsername] = useState("Loading...");
  const [openRequestDialog, setOpenRequestDialog] = React.useState(false);
  const [inviteeEmail, setInviteeEmail] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const backgroundColor = isActive ? "background.paper" : "#e0e0e0"; // Grey out if not active

  const eventData = {
    id: eventId,
    event_title: eventName,
    inviteeId: inviteeId,
    // Add other necessary details that you want to pass to the ViewEventPage
  };

  const handleOpenRequestDialog = () => {
    setOpenRequestDialog(true);
  };

  const handleCloseRequestDialog = () => {
    setOpenRequestDialog(false);
  };

  let history = useHistory();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails(inviteeId, authTokens);
        setInviteeUsername(userDetails.username);
        setInviteeEmail(userDetails.email);
      } catch (error) {
        setInviteeUsername("Unknown user");
        console.error(error);
      }
    };

    fetchUserDetails();
  }, [inviteeId, authTokens]);

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
    history.push(`/submit-availability/event/${eventId}/user/${inviteeId}`);
  };

  const handleView = async (context) => {
    try {
      // Here you should fetch the full event details
      const eventDetailsData = await fetchEventDetails(eventId, authTokens);
      setSelectedEvent({ ...eventDetailsData, context });
      setDrawerOpen(true); // Open the drawer
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const handleFinalize = () => {
    if (onFinalize) {
      onFinalize();
    }
    history.push(`/finalize-event/event/${eventId}`);
  };
  return (
    <Accordion sx={{ my: 1, boxShadow: 1, bgcolor: backgroundColor }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${eventId}-content`}
        id={`panel${eventId}-header`}
      >
        <Typography>{`${eventName} - ${inviteeUsername}`}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant='caption' color='textSecondary' display='block'>
              Created: {new Date(createdAt).toLocaleString()}
            </Typography>
            <Typography variant='caption' color='textSecondary' display='block'>
              Updated: {new Date(updatedAt).toLocaleString()}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            {onRequest && (
              <Button
                variant='outlined'
                onClick={handleOpenRequestDialog}
                sx={{
                  color: context === "invited" ? "invitation.main" : "primary.main",
                  borderColor: context === "invited" ? "invitation.main" : "primary.main",
                  "&:hover": {
                    backgroundColor: context === "invited" ? "invitation.light" : "primary.light",
                    borderColor: context === "invited" ? "invitation.main" : "primary.main",
                  },
                }}
              >
                Request Availability
              </Button>
            )}
            {onAccept && (
              <Button
                variant='outlined'
                onClick={handleAccept}
                sx={{
                  color: context === "invited" ? "invitation.main" : "primary.main",
                  borderColor: context === "invited" ? "invitation.main" : "primary.main",
                  "&:hover": {
                    backgroundColor: context === "invited" ? "invitation.light" : "primary.light",
                    borderColor: context === "invited" ? "invitation.main" : "primary.main",
                  },
                }}
              >
                Accept Invitation
              </Button>
            )}
            {onView && (
              <Button
                variant='outlined'
                onClick={() => handleView(eventData)}
                sx={{
                  color: context === "invited" ? "invitation.main" : "primary.main",
                  borderColor: context === "invited" ? "invitation.main" : "primary.main",
                  "&:hover": {
                    backgroundColor: context === "invited" ? "invitation.light" : "primary.light",
                    borderColor: context === "invited" ? "invitation.main" : "primary.main",
                  },
                }}
              >
                View Meeting
              </Button>
            )}
            {onFinalize && (
              <Button
                variant='outlined'
                onClick={handleFinalize}
                sx={{
                  color: context === "invited" ? "invitation.main" : "primary.main",
                  borderColor: context === "invited" ? "invitation.main" : "primary.main",
                  "&:hover": {
                    backgroundColor: context === "invited" ? "invitation.light" : "primary.light",
                    borderColor: context === "invited" ? "invitation.main" : "primary.main",
                  },
                }}
              >
                Finalize Meeting
              </Button>
            )}
            <IconButton aria-label='delete' onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
          <RequestAvailabilityDialog
            open={openRequestDialog}
            onClose={handleCloseRequestDialog}
            inviteeUsername={inviteeUsername}
            inviteeEmail={inviteeEmail}
          />
        </Box>
      </AccordionDetails>
      <Drawer anchor='bottom' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {selectedEvent && <ViewEventPage eventDetails={selectedEvent} />}
      </Drawer>
    </Accordion>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// for responsive designs
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize(); // Call the function immediately to set the initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ onDelete }) {
  const [tabValue, setTabValue] = useState(0); // For top-level tabs
  const [subTabValue, setSubTabValue] = useState(0); // For sub-tabs within "My Hosted Meetings"
  const [invitedTabValue, setInvitedTabValue] = useState(0); // For sub-tabs within "Invited Meetings"

  const [hostedMeetingsPending, setHostedMeetingsPending] = useState([]);
  const [hostedMeetingsReady, setHostedMeetingsReady] = useState([]);
  const [hostedMeetingsFinalized, setHostedMeetingsFinalized] = useState([]);
  const [invitedMeetingsPending, setInvitedMeetingsPending] = useState([]);
  const [invitedMeetingsReady, setInvitedMeetingsReady] = useState([]);
  const [invitedMeetingsFinalized, setInvitedMeetingsFinalized] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authTokens, user } = useContext(AuthContext);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const size = useWindowSize();
  const isSmallScreen = size.width < 1435 && size.width > 900;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubTabChange = (event, newValue) => {
    setSubTabValue(newValue);
  };

  const handleInvitedTabChange = (event, newValue) => {
    setInvitedTabValue(newValue);
  };

  const showDeleteConfirmation = (eventId) => {
    setEventToDelete(eventId);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      try {
        await onDelete(eventToDelete);
        setHostedMeetingsPending((prevMeetings) =>
          prevMeetings.filter((meeting) => meeting.id !== eventToDelete)
        );
        console.log("Event deleted successfully.");
      } catch (error) {
        console.error("Error deleting event:", error);
      } finally {
        setEventToDelete(null);
        setIsConfirmDialogOpen(false);
      }
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (user && user.user_id) {
        try {
          setIsLoading(true);
          const hostedEvents = await fetchEventsByHost(user.user_id, authTokens);
          const invitedEvents = await fetchEventsByInvitee(user.user_id, authTokens);

          // Filter hosted events based on status
          setHostedMeetingsPending(hostedEvents.filter((event) => event.status === "A"));
          setHostedMeetingsReady(hostedEvents.filter((event) => event.status === "C"));
          setHostedMeetingsFinalized(hostedEvents.filter((event) => event.status === "F"));

          setInvitedMeetingsPending(invitedEvents.filter((event) => event.status === "A"));
          setInvitedMeetingsReady(invitedEvents.filter((event) => event.status === "C"));
          setInvitedMeetingsFinalized(invitedEvents.filter((event) => event.status === "F"));
          console.log("hostedEvents", hostedEvents);
          console.log("invitedEvents", invitedEvents);
        } catch (error) {
          console.error("Error fetching events:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user && user.user_id) {
      fetchEvents();
    }
  }, [user, authTokens]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label='basic tabs example'
          allowScrollButtonsMobile
          centered
          sx={{
            // Conditionally change the indicator color when the "Invitations" tab is selected
            ".MuiTabs-indicator": {
              backgroundColor: tabValue === 1 ? "#EE9B1E" : "",
            },
          }}
        >
          <Tab label='Hosted Meetings' {...a11yProps(0)} />
          <Tab
            label='Invitations'
            {...a11yProps(1)}
            sx={{
              color: tabValue === 1 ? "#FFDDC1" : "",
              "&.Mui-selected": {
                color: "#D17D00", // Ensure the color remains when selected
              },
            }}
          />
        </Tabs>
      </Box>

      {/* Hosted Meetings */}
      <TabPanel value={tabValue} index={0}>
        <Tabs
          value={subTabValue}
          onChange={handleSubTabChange}
          variant={isSmallScreen ? "scrollable" : "standard"}
          scrollButtons={isSmallScreen ? "auto" : "false"}
          centered={!isSmallScreen}
          allowScrollButtonsMobile
        >
          <Tab
            label={<Box component='span'>Pending ({hostedMeetingsPending.length})</Box>}
            wrapped
          />
          <Tab
            label={<Box component='span'>Ready to Finalize ({hostedMeetingsReady.length})</Box>}
            wrapped
          />
          <Tab
            label={<Box component='span'>Finalized ({hostedMeetingsFinalized.length})</Box>}
            wrapped
          />
        </Tabs>

        <ConfirmDialog
          open={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title='Confirm Deletion'
          message='Are you sure you want to delete this event? This action cannot be undone.'
        />

        {/* List hostedMeetingsPending */}
        <TabPanel value={subTabValue} index={0}>
          {hostedMeetingsPending.map((meeting) => (
            <MeetingItem
              key={meeting.id}
              eventId={meeting.id}
              eventName={meeting.event_title}
              inviteeId={meeting.invitee}
              authTokens={authTokens}
              context='hosted'
              createdAt={meeting.created_at}
              updatedAt={meeting.updated_at}
              isActive={meeting.is_active}
              onEdit={() => {
                console.log("Edit:", meeting.id);
              }}
              onRequest={() => {
                console.log("Request:", meeting.id);
              }}
              onDelete={() => showDeleteConfirmation(meeting.id)}
            />
          ))}
        </TabPanel>

        {/* List hostedMeetingsReady */}
        <TabPanel value={subTabValue} index={1}>
          {hostedMeetingsReady.map((meeting) => (
            <MeetingItem
              key={meeting.id}
              eventId={meeting.id}
              eventName={meeting.event_title}
              inviteeId={meeting.invitee}
              authTokens={authTokens}
              context='hosted'
              createdAt={meeting.created_at}
              updatedAt={meeting.updated_at}
              isActive={meeting.is_active}
              onEdit={() => {
                console.log("Edit:", meeting.id);
              }}
              onFinalize={() => {
                console.log("Finalize:", meeting.id);
              }}
              onDelete={() => showDeleteConfirmation(meeting.id)}
            />
          ))}
        </TabPanel>

        {/* List hostedMeetingsFinalized */}
        <TabPanel value={subTabValue} index={2}>
          {hostedMeetingsFinalized.map((meeting) => (
            <MeetingItem
              key={meeting.id}
              eventId={meeting.id}
              eventName={meeting.event_title}
              inviteeId={meeting.invitee}
              authTokens={authTokens}
              context='hosted'
              createdAt={meeting.created_at}
              updatedAt={meeting.updated_at}
              isActive={meeting.is_active}
              onView={() => {
                console.log("FINALIED:", hostedMeetingsFinalized);
                console.log("View:", meeting.id);
              }}
              onDelete={() => showDeleteConfirmation(meeting.id)}
            />
          ))}
        </TabPanel>
      </TabPanel>

      {/* Invited Meetings */}
      <TabPanel value={tabValue} index={1}>
        <Tabs
          value={invitedTabValue}
          onChange={handleInvitedTabChange}
          variant={isSmallScreen ? "scrollable" : "standard"}
          scrollButtons={isSmallScreen ? "auto" : "false"}
          centered={!isSmallScreen}
          allowScrollButtonsMobile
          sx={{
            ".MuiTabs-indicator": {
              backgroundColor: "#EE9B1E", // change the indicator color
            },
            ".Mui-selected": {
              // change text color of the selected tab
              color: "#D17D00", // override the color for the selected tab
            },
          }}
        >
          <Tab
            label={<Box component='span'>Pending ({invitedMeetingsPending.length})</Box>}
            wrapped
          />
          <Tab
            label={
              <Box component='span'>Waiting host to Finalize ({invitedMeetingsReady.length})</Box>
            }
            wrapped
          />
          <Tab
            label={<Box component='span'>Finalized ({invitedMeetingsFinalized.length})</Box>}
            wrapped
          />
        </Tabs>

        {/* List invitedMeetingsPending */}
        <TabPanel value={invitedTabValue} index={0}>
          {invitedMeetingsPending.map((meeting) => (
            <MeetingItem
              key={meeting.id}
              eventId={meeting.id}
              eventName={meeting.event_title}
              inviteeId={meeting.host}
              authTokens={authTokens}
              context='invited'
              createdAt={meeting.created_at}
              updatedAt={meeting.updated_at}
              isActive={meeting.is_active}
              onAccept={() => {}}
              onDelete={() => showDeleteConfirmation(meeting.id)}
            />
          ))}
        </TabPanel>

        {/* List invitedMeetingsReady */}
        <TabPanel value={invitedTabValue} index={1}>
          {invitedMeetingsReady.map((meeting) => (
            <MeetingItem
              key={meeting.id}
              eventId={meeting.id}
              eventName={meeting.event_title}
              inviteeId={meeting.host}
              authTokens={authTokens}
              context='invited'
              createdAt={meeting.created_at}
              updatedAt={meeting.updated_at}
              isActive={meeting.is_active}
              onView={() => {}}
              onDelete={() => deleteEvent(meeting.id, authTokens)}
            />
          ))}
        </TabPanel>

        {/* List invitedMeetingsFinalized */}
        <TabPanel value={invitedTabValue} index={2}>
          {invitedMeetingsFinalized.map((meeting) => (
            <MeetingItem
              key={meeting.id}
              eventId={meeting.id}
              eventName={meeting.event_title}
              inviteeId={meeting.host}
              authTokens={authTokens}
              context='invited'
              createdAt={meeting.created_at}
              updatedAt={meeting.updated_at}
              isActive={meeting.is_active}
              onView={() => {
                console.log("View:", meeting.id);
              }}
              onDelete={() => showDeleteConfirmation(meeting.id)}
            />
          ))}
        </TabPanel>
      </TabPanel>
    </Box>
  );
}
