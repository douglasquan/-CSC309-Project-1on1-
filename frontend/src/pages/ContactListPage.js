import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

// Simple modal component for adding a new contact
function AddContactModal({ show, onClose }) {
  let { authTokens } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!show) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/contacts/add/",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      console.log(response.data);
      setEmail("");
      onClose(); // close the model when successful add
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.error || "An unexpected error occurred."
        );
      } else {
        setErrorMessage("The request could not be processed.");
      }
    }
  };

  return (
    <div
      id="addContactModal"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
      style={{ backdropFilter: "blur(10px)" }}
    >
      <div className="bg-white p-8 rounded-lg w-full md:w-1/3 lg:w-1/3 relative">
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Error message display */}
          {errorMessage && (
            <div className="mb-3 text-sm text-red-500">{errorMessage}</div>
          )}

          <div className="mt-4 flex justify-end space-x-3">
            {/* Cancel Button */}
            <button
              type="button"
              id="cancelBtn"
              className="py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none"
              onClick={onClose}
            >
              Cancel
            </button>
            {/* Save Contact Button */}
            <button
              type="submit"
              id="saveContactBtn"
              className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContactListPage() {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  let { authTokens } = useContext(AuthContext);

  // Get contact list when the page is loaded
  useEffect(() => {
    const fetchContacts = async () => {
      const response = await fetch("http://localhost:8000/contacts/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      if (response.ok) {
        const data = await response.json();
        // After fetching contacts, fetch each contact's details
        const detailedContacts = await Promise.all(
          data.map(async (contact) => {
            const detailResponse = await fetch(
              `http://127.0.0.1:8000/accounts/profile/${contact.contact}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + String(authTokens.access),
                },
              }
            );

            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              console.log(detailData);
              return { ...contact, userDetails: detailData };
            } else {
              console.error("Failed to fetch contact details");
              return contact;
            }
          })
        );
        console.log(detailedContacts);
        setContacts(detailedContacts);
      } else {
        console.error("Failed to fetch contacts");
      }
    };

    fetchContacts();
  }, []);
  
  // Delete Contact
  const deleteContact = async (id) => {
    // Assuming the backend expects a DELETE request to a URL with the contact's ID.
    const deleteUrl = `http://localhost:8000/contacts/${id}/delete`;

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      if (response.ok) {
        // If the delete request was successful, remove the contact from the state.
        setContacts(
          contacts.filter((contact) => contact.id !== id)
        );
        console.log("Contact deleted successfully");
      } else {
        console.error("Failed to delete contact");
      }
    } catch (error) {
      console.error("Error deleting contact", error);
    }

  };

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
      <div className="flex items-center justify-between pb-6">
        <div>
          <h2 className="text-4xl font-bold mb-3 mr-4">Contact List</h2>
          <span className="text-xs text-gray-700">
            List of Contacts who you can schedule a meeting with
          </span>
        </div>
        <div className="flex items-center justify-center sm:justify-start space-x-2">
          <button
            id="addContactBtn"
            className="flex items-center gap-1 sm:gap-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
            onClick={() => setShowModal(true)}
          >
            Add Contact
          </button>
          <AddContactModal
            show={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>
      </div>

      {/* Contact List Table */}
      <div className="overflow-y-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full" id="contactsTable">
            <thead>
              <tr className="bg-neutral-300	text-left text-xs font-semibold uppercase tracking-widest text-grey">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Added at</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="text-black-500">
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="whitespace-no-wrap">
                      {`${contact.userDetails.first_name} ${contact.userDetails.last_name}`}
                    </p>{" "}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="whitespace-no-wrap">
                      {contact.userDetails.email}
                    </p>
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="whitespace-no-wrap">
                      {new Date(contact.added_at).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>{" "}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <img
                      src="https://icons.getbootstrap.com/assets/icons/trash.svg"
                      className="h-4 w-4 cursor-pointer delete-icon"
                      alt="Delete"
                      onClick={() => deleteContact(contact.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ContactListPage;
