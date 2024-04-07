import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material';


const AddTrip = ({open, onClose, onAdd}) => {
    const [trip, setTrip] = useState('');

    const handleClose = () => {
        onClose();
        setTrip('');
    }

    const handleAdd = () => {
        onAdd(trip);
        setTrip('');
        onClose();
    }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Trip</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Input a trip name
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={trip}
          onChange={(e) => setTrip(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTrip;
