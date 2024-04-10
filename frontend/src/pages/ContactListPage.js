import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import {
  addContact,
  getContacts,
  deleteContact,
} from "../controllers/ContactsController"; 
import { getUserDetails } from "../controllers/UserController";
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Simple modal component for adding a new contact
function AddContactModal({ open, onClose, onAddContact }) {
  let { authTokens } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addContact(email, authTokens);
      console.log(response.data);
      setEmail("");
      onAddContact(response.data);
      onClose(); // close the model when successful add
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      setErrorMessage(errorMessage);
    }
  };

  return (
    <Dialog open={open} 
    onClose={onClose} 
    aria-labelledby="form-dialog-title" 
    maxWidth="md"
    BackdropProps={{
      style: {
        backdropFilter: 'blur(5px)' // Adjust blur value as needed
      }
    }}
    sx={{ '& .MuiDialog-paper': { minWidth: '600px' } }}
    >
      <DialogTitle id="form-dialog-title">Add Contact</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!errorMessage}
            helperText={errorMessage}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Save Contact
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function DelContactModal({ contactToDelete, onConfirmDelete, onCancelDelete, open }) {
  return (
    <Dialog
      open={open}
      onClose={onCancelDelete}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this contact?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelDelete} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onConfirmDelete(contactToDelete)} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ContactListPage() {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const pastelColors = {
    tableHeadColor: '#a8d1d1', //Table head color
    deleteIconColor: '#e8a2a2', // A pastel delete icon color
    contactCellsColor: '#d5e3e8', // Color for active item background
    tableRowColor: '#dfebeb', // Color for table row
    hoverColor: '#c9e4de', // Color for hover
  };

  let { authTokens } = useContext(AuthContext);
  const handleAddContact = async (newContact) => {
    if (!newContact.userDetails) {
      try {
        // Assuming `newContact.contact` is the ID needed to fetch the user details
        const userDetails = await getUserDetails(newContact.contact, authTokens);
        newContact.userDetails = userDetails;
      } catch (error) {
        console.error("Failed to fetch user details for the new contact:", error);
        return;
      }
    }
    setContacts([...contacts, newContact]);
  };

  // Get contact list when the page is loaded
  useEffect(() => {

    const getContactsAndDetails = async () => {
      try {
        const contactsData = await getContacts(authTokens); // Get the contact list
        const detailedContacts = await Promise.all(  // Get the user info for each contact in the list
          contactsData.map(async (contact) => {
            try {
              const userDetails = await getUserDetails(
                contact.contact,
                authTokens
              );
              return { ...contact, userDetails };
            } catch (error) {
              return contact; 
            }
          })
        );
        setContacts(detailedContacts);
      } catch (error) {
        console.error("Failed to fetch contacts or contact details:", error);
      }
    };

    getContactsAndDetails();
  }, [authTokens]);

  // Delete Contact
  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
  };

  const handleConfirmDelete = async (contact) => {
    const updatedContacts = contacts.filter((c) => c.id !== contact.id);
    setContacts(updatedContacts);
    try {
      await deleteContact(contact.id, authTokens);
      setContacts(contacts.filter((c) => c.id !== contact.id));
      setContactToDelete(null); // Close the confirmation dialog
      console.log("Contact deleted successfully");
    } catch (error) {
      console.error("Error deleting contact", error);
    }
    setContactToDelete(null); // Close the confirmation dialog
  };



  return (
    <Container maxWidth="lg" className="py-8">
      <div className="flex items-center justify-between pb-6">
        <div>
          <Typography variant="h4" gutterBottom>
            Contact List
          </Typography>
          <Typography variant="subtitle1">
            List of Contacts who you can schedule a meeting with
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: pastelColors.tableHeadColor, '&:hover': { backgroundColor: pastelColors.deleteIconColor } }} // Applying pastel colors
          onClick={() => setShowModal(true)}
        >
          Add Contact
        </Button>
        <AddContactModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onAddContact={handleAddContact}
        />
      </div>
      <TableContainer component={Paper} sx={{ overflowHidden: 'rounded-lg'}}>
        <Table aria-label="contacts table">
          <TableHead sx={{ backgroundColor: pastelColors.tableHeadColor }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Added at</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} sx={{ backgroundColor: pastelColors.tableRowColor, '&:hover': { backgroundColor: pastelColors.hoverColor } }}>
                <TableCell>{`${contact.userDetails.first_name} ${contact.userDetails.last_name}`}</TableCell>
                <TableCell>{contact.userDetails.username}</TableCell>
                <TableCell>{contact.userDetails.email}</TableCell>
                <TableCell>{new Date(contact.added_at).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    sx={{ color: pastelColors.deleteIconColor }}
                    onClick={() => handleDeleteClick(contact)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DelContactModal
        contactToDelete={contactToDelete}
        onConfirmDelete={handleConfirmDelete}
        onCancelDelete={() => setContactToDelete(null)}
        open={Boolean(contactToDelete)}
      />
    </Container>
  );
}

export default ContactListPage;
