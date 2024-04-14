import React, { useState } from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Fab,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InfoIcon from "@mui/icons-material/Info";

const ListData = ({ data, name, onMoveItem, onOpenSave, onOpenInfo }) => {
  const [listVisible, setListVisible] = useState(false);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  const handleDrop = (e) => {
    e.preventDefault();

    // Retrieve the JSON string from the event's data transfer object
    const jsonString = e.dataTransfer.getData("application/json");

    // Check if jsonString is not empty and is valid JSON
    if (jsonString) {
      try {
        const item = JSON.parse(jsonString);
        // Proceed with handling the dropped item
        const fromCategory =
          item.category === "transports" ? "savedTransports" : "savedLiving";
        const toCategory =
          item.category === "transports" ? "transports" : "living";
        if (name.toLowerCase() === item.category)
          onMoveItem(item, fromCategory, toCategory); // or 'transports', depending on the component
      } catch (error) {
        console.error("Error parsing JSON data:", error);
        // Handle the error (e.g., ignore the drop or show an error message)
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver}>
      <Box
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => setListVisible(!listVisible)}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {name}
        </Typography>
        <Box sx={{ transform: "translateY(4px)" }}>
          {listVisible ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </Box>
      <List style={{ display: listVisible ? "block" : "none" }}>
        {data.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem
              sx={{ display: "flex", flexDirection: "row" }}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <ListItemText primary={item.name} />
              <Fab
                color="primary"
                size="small"
                onClick={() => onOpenInfo(item)}
              >
                <InfoIcon />
              </Fab>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
        <React.Fragment>
          <ListItem
            sx={{ display: "flex", flexDirection: "row", cursor: "pointer" }}
            onClick={() => onOpenSave()}
          >
            <ListItemText primary={`New ${name}`} /> <AddCircleIcon />
          </ListItem>
          <Divider />
        </React.Fragment>
      </List>
    </div>
  );
};

export default ListData;
