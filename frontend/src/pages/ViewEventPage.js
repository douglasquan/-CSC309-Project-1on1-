import React, { useState, useEffect, useContext } from "react";
import { format, parseISO } from "date-fns";

import {
  Box,
  Grid,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";

import PhoneIcon from "@mui/icons-material/Phone";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import Face6Icon from "@mui/icons-material/Face6";

import AuthContext from "../context/AuthContext";

import { getUserDetails } from "../controllers/UserController";

const ViewEventPage = ({ eventDetails }) => {
  const { authTokens, user } = useContext(AuthContext);
  const [relatedUserDetails, setRelatedUserDetails] = useState(""); // This will store either the host or invitee details based on context
  // Determine the color based on user role
  const titleColor =
    user.user_id === eventDetails.host ? "primary.main" : "invitation.main";

  useEffect(() => {
    const fetchRelatedUserDetails = async () => {
      try {
        const userIdToFetch = eventDetails.context.inviteeId;
        const userDetailsData = await getUserDetails(userIdToFetch, authTokens);
        setRelatedUserDetails(userDetailsData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (eventDetails) {
      fetchRelatedUserDetails();
    }
  }, [eventDetails, authTokens]);

  // Helper function to get the appropriate icon for an event type
  const getEventTypeIcon = (eventType) => {
    switch (eventType) {
      case "in_person":
        return <MeetingRoomIcon sx={{ mr: 1 }} />;
      case "phone":
        return <PhoneIcon sx={{ mr: 1 }} />;
      case "video":
        return <VideoCallIcon sx={{ mr: 1 }} />;
      default:
        return null; // Or some default icon
    }
  };

  // Helper function to format finalized event time
  const formatFinalizedTime = () => {
    if (eventDetails.finalized_start_time && eventDetails.finalized_end_time) {
      const startTime = format(parseISO(eventDetails.finalized_start_time), "PPPp");
      const endTime = format(parseISO(eventDetails.finalized_end_time), "p");
      return `${startTime} to ${endTime}`;
    }
    return null; // Return null if any of the values are not available
  };

  if (!eventDetails || !relatedUserDetails) {
    return <CircularProgress />;
  }

  return (
    <Box
      sx={{
        height: "100%", // Or set a specific height if you want
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // This centers content vertically
        alignItems: "center", // This centers content horizontally
        p: 3, // Adding some padding around the content
      }}
    >
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            p: 2,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
          >
            <Face6Icon sx={{ mr: 0.75 }} /> {relatedUserDetails.username}
          </Typography>

          <Divider />

          <Typography
            variant="h5"
            component="h2"
            sx={{ color: titleColor, fontWeight: "bold", fontSize: "2rem" }}
          >
            {eventDetails.event_title}
          </Typography>

          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
          >
            <AccessTimeIcon sx={{ mr: 1 }} /> {eventDetails.event_duration}{" "}
            minutes
          </Typography>

          {eventDetails.event_type !== "other" && (
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
            >
              {getEventTypeIcon(eventDetails.event_type)}
              {eventDetails.event_type.replace("_", " ")}
            </Typography>
          )}

          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Event Deadline: {format(new Date(eventDetails.deadline), "PPPp")}
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {user.user_id === eventDetails.host
              ? "Your notes:"
              : `Notes from ${user.username}:`}
              
          {/* Display finalized event time */}
          {formatFinalizedTime() && (
            <Typography variant='body1' sx={{ fontWeight: "bold" }}>
              Finalized Time: {formatFinalizedTime()}
            </Typography>
          )}

          <Typography variant='body1' sx={{ fontWeight: "bold" }}>
            Notes from {relatedUserDetails.username} :
          </Typography>
          <Typography variant="body2">
            {eventDetails.description || "No description provided."}
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {user.user_id === eventDetails.invitee
              ? "Your notes:"
              : `Notes from ${relatedUserDetails.username}:`}
          </Typography>
          <Typography variant="body2">
            {eventDetails.invitee_description || "No description provided."}
          </Typography>
          
        </Box>
      </Grid>
    </Box>
  );
};

export default ViewEventPage;
