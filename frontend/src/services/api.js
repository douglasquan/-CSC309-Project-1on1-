import axios from "axios";

// Assuming you have a similar constants file for the access token key
import { ACCESS_TOKEN } from "../constants";


// Create an Axios instance for user services
const api = axios.create({
  baseURL: 'http://localhost:8000/accounts/',
});

// Attach the JWT token to each request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to handle user registration
export const registerUser = async (userData) => {
    return api.post('register/', userData);
};

export default api;