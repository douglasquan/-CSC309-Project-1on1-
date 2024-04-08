import React, { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";

import AuthContext from "../context/AuthContext";
import { fetchEventsByHost, fetchEventsByInvitee } from "../controllers/EventsController";
import { getUserDetails } from "../controllers/UserController";
import RequestAvailabilityDialog from './RequestAvailabilityDialog';

// Dummy data arrays for each tab
const finalizedMeetings = [
  { id: 1, name: "Sprint Planning", participant: "Eve", status: "Finalized" },
  { id: 2, name: "Retrospective", participant: "Frank", status: "Finalized" },
];

function MeetingItem({
  eventName,
  inviteeId,
  authTokens,
  onEdit,
  onDelete,
  onFinalize,
  onRequest,
  onAccept,
  onView,
}) {
  const [inviteeUsername, setInviteeUsername] = useState("Loading...");
  const [openRequestDialog, setOpenRequestDialog] = React.useState(false);
  const [inviteeEmail, setInviteeEmail] = useState("");

  // Handler to open the dialog
  const handleOpenRequestDialog = () => {
    setOpenRequestDialog(true);
  };

  // Handler to close the dialog
  const handleCloseRequestDialog = () => {
    setOpenRequestDialog(false);
  };

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
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "lightgrey",
        p: 2,
        my: 1,
        borderRadius: "8px",
        boxShadow: 1,
      }}
    >
      <span>{`${eventName} - ${inviteeUsername}`}</span>
      <Box>
        {onEdit && (
          <Button variant='outlined' color='primary' onClick={onEdit}>
            Edit Meeting
          </Button>
        )}
        {onRequest && (
          <Button variant='outlined' color='primary' onClick={handleOpenRequestDialog}>
            Request Availability
          </Button>
        )}
        {onAccept && (
          <Button variant='outlined' color='primary' onClick={onAccept}>
            Accept Invitation
          </Button>
        )}
        {onView && (
          <Button variant='outlined' color='primary' onClick={onView}>
            View Meeting
          </Button>
        )}
        {onFinalize && (
          <Button variant='outlined' color='success' onClick={onFinalize}>
            Finalize Meeting
          </Button>
        )}
        <IconButton aria-label='delete' onClick={onDelete}>
          <DeleteIcon />
        </IconButton>

        <RequestAvailabilityDialog
          open={openRequestDialog}
          onClose={handleCloseRequestDialog}
          inviteeUsername={inviteeUsername}
          inviteeEmail={inviteeEmail} 
        />
      </Box>
    </Box>
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const [hostedMeetings, setHostedMeetings] = useState([]);
  const [invitedMeetings, setInvitedMeetings] = useState([]);
  //   const [finalizedMeetings, setFinalizedMeetings] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const { authTokens, user } = useContext(AuthContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (user && user.user_id) {
        try {
          setIsLoading(true);
          const hostedEvents = await fetchEventsByHost(user.user_id, authTokens);
          console.log("hosted events", hostedEvents);
          const invitedEvents = await fetchEventsByInvitee(user.user_id, authTokens);
          console.log("invited events", invitedEvents);
          setHostedMeetings(hostedEvents); // Assuming the fetched data is an array
          setInvitedMeetings(invitedEvents); // Assuming the fetched data is an array
        } catch (error) {
          console.error("Error fetching events:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error("Auth tokens are not available.");
      }
    };

    if (user && user.user_id) {
      fetchEvents();
    }
  }, [user, value, authTokens]); // Re-run the effect if user or value changes

  if (isLoading) {
    return <div>Loading...</div>; // Or some loading indicator
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
          centered
          variant='fullWidth'
        >
          <Tab label='My Hosted Meetings' {...a11yProps(0)} sx={{ bgcolor: "lightblue" }} />
          <Tab label='Invitation Received' {...a11yProps(1)} sx={{ bgcolor: "lightgreen" }} />
          <Tab label='Finalized Meetings' {...a11yProps(2)} sx={{ bgcolor: "lightgrey" }} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        {hostedMeetings.map((meeting) => (
          <MeetingItem
            key={meeting.id}
            eventName={meeting.event_title}
            inviteeId={meeting.invitee}
            authTokens={authTokens}
            onEdit={() => {
              console.log("Edit:", meeting.id);
            }}
            onRequest={() => {
              console.log("Request:", meeting.id);
            }}
            onDelete={() => {
              console.log("Delete:", meeting.id);
            }}
          />
        ))}
      </TabPanel>

      <TabPanel value={value} index={1}>
        {invitedMeetings.map((meeting) => (
          <MeetingItem
            key={meeting.id}
            eventName={meeting.event_title}
            inviteeId={meeting.host}
            authTokens={authTokens}
            onAccept={() => {
              console.log("Accept:", meeting.id);
            }}
            onDelete={() => {
              console.log("Delete:", meeting.id);
            }}
          />
        ))}
      </TabPanel>

      <TabPanel value={value} index={2}>
        {finalizedMeetings.map((meeting) => (
          <MeetingItem
            key={meeting.id}
            meetingName={meeting.name}
            participantName={meeting.participant}
            onDelete={() => {
              console.log("Delete:", meeting.id);
            }}
          />
        ))}
      </TabPanel>
    </Box>
  );
}
