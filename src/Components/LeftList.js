import React from 'react';
import { Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';

const LeftList = ({ data, name, onMoveItem }) => {

    const handleDrop = (e) => {
        e.preventDefault();
    
        // Retrieve the JSON string from the event's data transfer object
        const jsonString = e.dataTransfer.getData("application/json");
    
        // Check if jsonString is not empty and is valid JSON
        if (jsonString) {
            try {
                const item = JSON.parse(jsonString);
                // Proceed with handling the dropped item
                onMoveItem(item, 'transports', 'leftList'); // or 'transports', depending on the component
            } catch (error) {
                console.error("Error parsing JSON data:", error);
                // Handle the error (e.g., ignore the drop or show an error message)
            }
        }
    };
    

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragStart = (e, item) => {
        e.dataTransfer.setData("application/json", JSON.stringify(item));
    };

    
    return (
        <div onDrop={handleDrop} onDragOver={handleDragOver}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {name}
            </Typography>
            <List style={{ display: 'block' }}>
                {data.map((item) => (
                    <React.Fragment key={item.id}>
                        <ListItem draggable onDragStart={(e) => handleDragStart(e, item)}>
                            <ListItemText primary={item.name} />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </div>
    );
};

export default LeftList;
