import axios from 'axios';

// const BASE_URL = 'http://127.0.0.1:8000';

// deployment
const BASE_URL = "/choreo-apis/meethomie/backend/rest-api-be2/v1.0";

// Function to get auth header
const getAuthHeaders = (authTokens) => ({
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${String(authTokens.access)}`,
    },
});


// Add a new contact
export const addEvent = (eventData, authTokens) => {
  return new Promise((resolve, reject) => {
      axios.post(`${BASE_URL}/events/add/`, eventData, getAuthHeaders(authTokens))
          .then(response => resolve(response.data))
          .catch(error => reject(error.response.data));
  });
};

// Function to get all events hosted by a specific user
export const fetchEventsByHost = (hostId, authTokens) => {
    return new Promise((resolve, reject) => {
      axios.get(`${BASE_URL}/events/all/host/${hostId}/`, getAuthHeaders(authTokens))
        .then(response => resolve(response.data))
        .catch(error => reject(error.response ? error.response.data : "Network error"));
    });
  };
  

  // Function to get all events where a specific user is the invitee
export const fetchEventsByInvitee = (inviteeId, authTokens) => {
    return new Promise((resolve, reject) => {
      axios.get(`${BASE_URL}/events/all/invitee/${inviteeId}/`, getAuthHeaders(authTokens))
        .then(response => resolve(response.data))
        .catch(error => reject(error.response ? error.response.data : "Network error"));
    });
  };
  

  // Function to get details of a specific event
export const fetchEventDetails = (eventId, authTokens) => {
    return new Promise((resolve, reject) => {
      axios.get(`${BASE_URL}/events/${eventId}/details/`, getAuthHeaders(authTokens))
        .then(response => resolve(response.data))
        .catch(error => reject(error.response ? error.response.data : "Network error"));
    });
  };
  

  // Function to update a specific event
export const updateEvent = (eventId, eventData, authTokens) => {
    return new Promise((resolve, reject) => {
      axios.patch(`${BASE_URL}/events/${eventId}/edit/`, eventData, getAuthHeaders(authTokens))
        .then(response => resolve(response.data))
        .catch(error => reject(error.response ? error.response.data : "Network error"));
    });
  };
  

  // Function to delete a specific event
export const deleteEvent = (eventId, authTokens) => {
    return new Promise((resolve, reject) => {
      axios.delete(`${BASE_URL}/events/${eventId}/delete/`, getAuthHeaders(authTokens))
        .then(response => resolve(response.data))
        .catch(error => reject(error.response ? error.response.data : "Network error"));
    });
  };
  