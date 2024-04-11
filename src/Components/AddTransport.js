import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, MenuItem } from '@mui/material';

const transportTypes = ['bus', 'train', 'plane', 'other'];

const AddTransport = ({ open, onClose, onAdd }) => {
    const [transport, setTransport] = useState({
        name: "",
        type: "",
        dateOfDeparture: "",
        duration: "",
        from: "",
        to: "",
        price: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransport(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const canAdd = Object.values(transport).every(value => value !== "");

    const handleClose = () => {
        onClose();
        setTransport({
            name: "",
            type: "",
            dateOfDeparture: "",
            duration: "",
            from: "",
            to: "",
            price: ""
        });
    };

    const handleAdd = () => {
        if (canAdd) {
            onAdd(transport);
            handleClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Transport</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    name="name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={transport.name}
                    onChange={handleChange}
                />
                <TextField
                    select
                    margin="dense"
                    id="type"
                    label="Type"
                    name="type"
                    fullWidth
                    variant="standard"
                    value={transport.type}
                    onChange={handleChange}
                >
                    {transportTypes.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    margin="dense"
                    id="dateOfDeparture"
                    label="Date of Departure"
                    name="dateOfDeparture"
                    type="datetime-local"
                    fullWidth
                    variant="standard"
                    value={transport.dateOfDeparture}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    margin="dense"
                    id="duration"
                    label="Duration"
                    name="duration"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={transport.duration}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="from"
                    label="From"
                    name="from"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={transport.from}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="to"
                    label="To"
                    name="to"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={transport.to}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="price"
                    label="Price"
                    name="price"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={transport.price}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAdd} disabled={!canAdd}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTransport;
