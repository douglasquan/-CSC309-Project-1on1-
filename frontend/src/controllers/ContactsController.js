import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const getAuthHeaders = (authTokens) => ({
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${String(authTokens.access)}`,
    },
});

// Get contacts list
export const getContacts = async (authTokens) => {
  try {
      const response = await axios.get(`${BASE_URL}/contacts/`, getAuthHeaders(authTokens));
      return response.data; // Return the list of contacts
  } catch (error) {
      console.error("Failed to fetch contacts:", error);
      throw error; // Rethrowing the error to handle it in the component
  }
};


// Add a new contact
export const addContact = async (email, authTokens) => {
    return await axios.post(
        `${BASE_URL}/contacts/add/`,
        { email },
        getAuthHeaders(authTokens)
    );
};

// Delete a contact
export const deleteContact = async (id, authTokens) => {
    const response = await fetch(`${BASE_URL}/contacts/${id}/delete`, {
        method: "DELETE",
        ...getAuthHeaders(authTokens),
    });

    if (!response.ok) throw new Error('Failed to delete contact');
    return await response.json();
};
