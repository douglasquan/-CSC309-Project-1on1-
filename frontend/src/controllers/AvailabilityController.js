import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

// Function to get auth header
const getAuthHeaders = (authTokens) => ({
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${String(authTokens.access)}`,
    },
});

// Create an availability
async function createAvailability(authTokens, event_id, availabilityData) {
    try {
        const response = await axios.post(`${BASE_URL}/${event_id}/availability/`, availabilityData, getAuthHeaders(authTokens));
        console.log('Availability created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating availability:', error.response?.data || error.message);
        throw error;
    }
}

// Get all availabilities for a specific event and user
async function getAllAvailabilities(authTokens, event_id, user_id) {
    try {
        const response = await axios.get(`${BASE_URL}/${event_id}/availability/${user_id}/`, getAuthHeaders(authTokens));
        console.log('Availabilities:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting availabilities:', error.response?.data || error.message);
        throw error;
    }
}

// Delete an availability
async function deleteAvailability(authTokens, event_id, availability_id) {
    try {
        await axios.delete(`${BASE_URL}/${event_id}/availability/${availability_id}/`, getAuthHeaders(authTokens));
        console.log('Availability deleted');
    } catch (error) {
        console.error('Error deleting availability:', error.response?.data || error.message);
        throw error;
    }
}

export { createAvailability, getAllAvailabilities, deleteAvailability };
