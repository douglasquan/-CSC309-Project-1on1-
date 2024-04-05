import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

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