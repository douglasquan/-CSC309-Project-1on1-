import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

// Function to get auth header
const getAuthHeaders = (authTokens) => ({
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${String(authTokens.access)}`,
    },
});

// Get user details by user ID
export const getUserDetails = async (userId, authTokens) => {
    try {
        const response = await axios.get(`${BASE_URL}/accounts/profile/${userId}`, getAuthHeaders(authTokens));
        return response.data; // Return user details
    } catch (error) {
        console.error(`Failed to fetch details for contact ID ${userId}:`, error);
        throw error; 
    }
};
