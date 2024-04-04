import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

// Function to get auth header
const getAuthHeaders = (authTokens) => ({
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${String(authTokens.access)}`,
    },
});

// Get user details by contact ID
export const getUserDetails = async (contactId, authTokens) => {
    try {
        const response = await axios.get(`${BASE_URL}/accounts/profile/${contactId}`, getAuthHeaders(authTokens));
        return response.data; // Return user details
    } catch (error) {
        console.error(`Failed to fetch details for contact ID ${contactId}:`, error);
        throw error; // Rethrowing the error to handle it in the component
    }
};
