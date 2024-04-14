import React, { useState, useEffect } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddTrip from "../Components/AddTrip";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:3001/trips");
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  const handleAddTrip = async (trip) => {
    try {
      const response = await fetch("http://localhost:3001/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trip,
          transports: [],
          savedTransports: [],
          living: [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add new trip");
      }

      const newTrip = await response.json();

      setTrips((prevTrips) => [...prevTrips, newTrip]);
    } catch (error) {
      console.error("Error adding new trip:", error);
    }

    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ margin: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Trip Planner
      </Typography>
      <List>
        {trips.map((trip, index) => (
          <React.Fragment key={trip.id}>
            <ListItemButton onClick={() => navigate(`/trips/${trip.id}`)}>
              <ListItemText primary={trip.name} />
            </ListItemButton>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={handleClickOpen}
      >
        <AddCircleIcon />
      </Fab>
      <AddTrip open={open} onClose={handleClose} onAdd={handleAddTrip} />
    </div>
  );
}

export default MainPage;
