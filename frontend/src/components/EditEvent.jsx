// import React from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   FormLabel,
//   TextareaAutosize,
//   Select,
//   MenuItem,
//   Grid,
//   Alert,
//   InputLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
// } from "@mui/material";


// const EditEvent = ({ open, onClose, eventDetails, updateEvent }) => {
//   // State for form fields, prefill with eventDetails props
//   const [formValues, setFormValues] = React.useState(eventDetails);

//   React.useEffect(() => {
//     setFormValues(eventDetails); // Update form values when eventDetails changes
//   }, [eventDetails]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = () => {
//     updateEvent(formValues); // Function to update the event
//     onClose(); // Close the dialog
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Edit Event</DialogTitle>
//       <DialogContent>
//         {/* Event Title */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
//           <TextField
//             fullWidth
//             id="event-title"
//             label="Event Title"
//             variant="outlined"
//             value={eventTitle}
//             onChange={(e) => setEventTitle(e.target.value)}
//           />
//         </Box>

//         {/* Set Deadline */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
//           <FormControl fullWidth>
//             <TextField
//               type="date"
//               id="deadline-date"
//               label="Deadline Date"
//               InputLabelProps={{ shrink: true }}
//               value={deadline.date}
//               onChange={handleDateChange}
//               required
//             />
//           </FormControl>
//         </Box>

//         {/* Selecting Event Duration */}
//         <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//           <FormControl fullWidth>
//             <InputLabel id="event-duration-label">
//               Select Event Duration
//             </InputLabel>
//             <Select
//               labelId="event-duration-label"
//               id="event-duration"
//               value={eventDuration}
//               label="Select Event Duration"
//               onChange={handleDurationChange}
//             >
//               <MenuItem value={30}>30 minutes</MenuItem>
//               <MenuItem value={60}>60 minutes</MenuItem>
//               <MenuItem value={120}>120 minutes</MenuItem>
//               <MenuItem value={150}>150 minutes</MenuItem>
//               <MenuItem value={180}>180 minutes</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         {/* Selecting Event Type */}
//         <FormControl component="fieldset" sx={{ mb: 2 }}>
//           <FormLabel component="legend">Select an Event Type</FormLabel>
//           <RadioGroup
//             row
//             aria-label="event-type"
//             name="event-type"
//             value={eventType}
//             onChange={handleEventTypeChange}
//           >
//             <FormControlLabel
//               value="in_person"
//               control={<Radio />}
//               label="In Person"
//             />
//             <FormControlLabel value="video" control={<Radio />} label="Video" />
//             <FormControlLabel value="phone" control={<Radio />} label="Phone" />
//           </RadioGroup>
//         </FormControl>

//         {/* Preference */}
//         <FormControl component="fieldset" sx={{ mb: 2, width: "100%" }}>
//           <FormLabel component="legend">Preferences</FormLabel>
//           <RadioGroup
//             row
//             aria-label="preference"
//             name="preference"
//             value={preference}
//             onChange={handlePreferenceChange}
//           >
//             {["High", "Medium", "Low"].map((pref) => (
//               <FormControlLabel
//                 key={pref}
//                 value={pref}
//                 control={
//                   <Radio
//                     sx={{
//                       "&.Mui-checked": {
//                         color: preferenceColors[pref], // Apply color to the radio button when it's checked
//                       },
//                       color: preferenceColors[pref], // This will color the unchecked state as well
//                     }}
//                   />
//                 }
//                 label={pref}
//                 sx={{
//                   color: preferenceColors[pref], // Apply color to the label text based on the preference
//                   flexGrow: 1,
//                   ".MuiFormControlLabel-label": {
//                     // This targets the label within FormControlLabel
//                     color: preferenceColors[pref], // Apply the color to the label text
//                   },
//                 }}
//               />
//             ))}
//           </RadioGroup>
//         </FormControl>

//         {/* Description Box */}
//         <Box sx={{ mb: 2 }}>
//           <TextField
//             fullWidth
//             id="description"
//             label="Description/Instructions"
//             multiline
//             rows={4}
//             value={description}
//             onChange={handleDescriptionChange}
//           />
//         </Box>

//         {/* Select Invitees */}
//         <Box sx={{ mb: 2 }}>
//           <FormControl fullWidth>
//             <InputLabel id="invitees-label">Invitee</InputLabel>
//             <Select
//               labelId="invitees-label"
//               id="invitees"
//               value={selectedInvitee}
//               label="Invitee"
//               onChange={handleInviteeChange}
//             >
//               {contacts.map((contact) => (
//                 <MenuItem key={contact.id} value={contact.id}>
//                   {contact.userDetails
//                     ? contact.userDetails.username
//                     : "Loading..."}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Box>

//         {/* Error Message */}
//         {errorMessages.length > 0 && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {errorMessages.map((msg, index) => (
//               <div key={index}>{msg}</div>
//             ))}
//           </Alert>
//         )}

//         {/* Create Meeting Button */}
//         <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//           <Button variant="contained" color="primary" onClick={handleSubmit}>
//             Create Event
//           </Button>
//         </Box>
//         <Button onClick={handleSubmit} color="primary" variant="contained">
//           Save Changes
//         </Button>
//       </DialogContent>
//     </Dialog>
//   );
// };
