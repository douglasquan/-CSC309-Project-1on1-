import axios from "axios";

// const BASE_URL = "http://127.0.0.1:8000";


// deployment
const BASE_URL = "/choreo-apis/meethomie/backend/rest-api-be2/v1.0";

// Function to get auth header
const getAuthHeaders = (authTokens) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${String(authTokens.access)}`,
  },
});

// Create an availability
async function createAvailability(authTokens, availabilityData) {
  try {
    console.log(availabilityData);
    const response = await axios.post(
      `${BASE_URL}/availability/add/`,
      availabilityData,
      getAuthHeaders(authTokens)
    );
    console.log("Availability created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating availability:", error.response?.data || error.message);
    throw error;
  }
}

// Get all availabilities for a specific event and user
async function getAllAvailabilities(authTokens, event_id, user_id) {
  try {
    const response = await axios.get(
      `${BASE_URL}/availability/${event_id}/${user_id}/all`,
      getAuthHeaders(authTokens)
    );
    console.log("Availabilities:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting availabilities:", error.response?.data || error.message);
    throw error;
  }
}

// Delete an availability
async function deleteAvailability(authTokens, event_id, availability_id) {
  try {
    await axios.delete(
      `${BASE_URL}/availability/${event_id}/${availability_id}/delete/`,
      getAuthHeaders(authTokens)
    );
    console.log("Availability deleted");
  } catch (error) {
    console.error("Error deleting availability:", error.response?.data || error.message);
    throw error;
  }
}

export { createAvailability, getAllAvailabilities, deleteAvailability };
