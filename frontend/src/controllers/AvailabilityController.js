import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

// Function to get auth header
const getAuthHeaders = (authTokens) => ({
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${String(authTokens.access)}`,
    },
});
