import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Divider } from "@mui/material";
import ListData from "../Components/ListData";
import MyTab from "../Components/MyTab";
import LeftList from "../Components/LeftList";
import SaveTransport from "../Components/SaveTransport";
import InfoTransport from "../Components/InfoTransport";
import useOpenClose from "../Functions/useOpenClose";

const TripDetail = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [transports, setTransports] = useState([]);
  const [leftList, setLeftList] = useState([]);
  const [openTransport, handleOpenTransport, handleCloseTransport] =
    useOpenClose();
  const [openInfoTransport, handleOpenInfoTransport, handleCloseInfoTransport] =
    useOpenClose();
  const [selectedTransport, setSelectedTransport] = useState({
    name: "",
    type: "",
    dateOfDeparture: "",
    duration: "",
    from: "",
    to: "",
    price: "",
  });

  // Function to move item from one list to another
  const moveItem = async (item, sourceType, destinationType) => {
    // Initialize updated lists from the current state
    let updatedSourceList =
      sourceType === "transports" ? [...transports] : [...leftList];
    let updatedDestinationList =
      destinationType === "transports" ? [...transports] : [...leftList];

    // Find and remove the item from the source list
    const itemIndex = updatedSourceList.findIndex((i) => i.id === item.id);
    if (itemIndex > -1) {
      const [removedItem] = updatedSourceList.splice(itemIndex, 1); // Remove item from source

      // Add the removed item to the destination list
      updatedDestinationList.push(removedItem);

      // Update state based on the source and destination types
      if (sourceType === "transports") {
        setTransports(updatedSourceList);
        setLeftList(updatedDestinationList);
      } else if (sourceType === "leftList") {
        setLeftList(updatedSourceList);
        setTransports(updatedDestinationList);
      }

      const updatedTrip = {
        transports:
          sourceType === "transports"
            ? updatedSourceList.map((item) => item.id)
            : updatedDestinationList.map((item) => item.id),
        savedTransports:
          sourceType === "transports"
            ? updatedDestinationList.map((item) => item.id)
            : updatedSourceList.map((item) => item.id),
      };

      try {
        await fetch(`http://localhost:3001/trips/${tripId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTrip),
        });
      } catch (error) {
        console.error("Error updating trip:", error);
      }
    }
  };

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        // Fetch the trip details
        const tripResponse = await fetch(
          `http://localhost:3001/trips/${tripId}`
        );
        if (!tripResponse.ok) {
          throw new Error("Failed to fetch trip");
        }
        const trip = await tripResponse.json();
        setTrip(trip);

        // Fetch transports directly associated with the trip
        const transportPromises = trip.transports.map((transportId) =>
          fetch(`http://localhost:3001/transports/${transportId}`).then((res) =>
            res.json()
          )
        );

        // Fetch transports directly associated with the trip
        const savedTransportPromises = trip.savedTransports.map((transportId) =>
          fetch(`http://localhost:3001/transports/${transportId}`).then((res) =>
            res.json()
          )
        );

        // Wait for all transport data to be fetched
        const transportsData = await Promise.all(transportPromises);
        const savedTransportsData = await Promise.all(savedTransportPromises);

        // Update state with fetched data
        setTransports(transportsData);
        setLeftList(savedTransportsData);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  const handleSaveTransport = async (transport) => {
    try {
      const response = await fetch("http://localhost:3001/transports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: transport.name,
          type: transport.type,
          dateOfDeparture: transport.dateOfDeparture,
          duration: transport.duration,
          from: transport.from,
          to: transport.to,
          price: transport.price,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add new trip");
      }

      const newTransport = await response.json();
      setTransports((prevTransports) => [...prevTransports, newTransport]);
    } catch (error) {
      console.error("Error adding new transport:", error);
    }
    handleCloseTransport();
  };

  const handleDeleteTransport = async (transport) => {
    try {
      const response = await fetch(
        `http://localhost:3001/transports/${transport.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delte transport");
      }
      const updatedTransports = transports.filter((t) => t.id !== transport.id);
      setTransports(updatedTransports);
    } catch (error) {
      console.error("Error deleting a transport:", error);
    }

    handleCloseInfoTransport();
  };

  const handleEditTransport = async (transport) => {
    try {
      const response = await fetch(
        `http://localhost:3001/transports/${transport.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: transport.name,
            type: transport.type,
            dateOfDeparture: transport.dateOfDeparture,
            duration: transport.duration,
            from: transport.from,
            to: transport.to,
            price: transport.price,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change transport");
      }

      const updatedTransport = await response.json();

      setTransports((prevTransports) =>
        prevTransports.map((t) =>
          t.id === transport.id ? updatedTransport : t
        )
      );
      // const newTransport = await response.json();
      // setTransports((prevTransports) => [...prevTransports, newTransport]);
    } catch (error) {
      console.error("Error editing transport:", error);
    }
    handleCloseTransport();
    handleCloseInfoTransport();
  };

  useEffect(() => {
    if (transports.length === 0) return;
    const updateTrip = async () => {
      const updatedTrip = { transports: transports.map((t) => t.id) };
      try {
        await fetch(`http://localhost:3001/trips/${tripId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTrip),
        });
      } catch (error) {
        console.error("Error updating trip:", error);
      }
    };

    updateTrip();
  }, [transports]);

  if (!trip) return <div>Loading...</div>;

  return (
    <>
      <MyTab name={trip.name} />
      <Box sx={{ display: "flex", margin: "20px", height: "100vh" }}>
        <Box sx={{ width: "75%" }}>
          <LeftList
            data={leftList}
            name="Left List"
            onMoveItem={moveItem}
            listType="leftList"
          />
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ transform: "translateX(6px)", width: "25%" }}>
          <ListData
            data={transports}
            name="Transports"
            onMoveItem={moveItem}
            onOpenSave={handleOpenTransport}
            onOpenInfo={(transport) => {
              setSelectedTransport(transport);
              handleOpenInfoTransport();
            }}
          />
        </Box>
      </Box>
      <SaveTransport
        open={openTransport}
        onClose={handleCloseTransport}
        onSave={handleSaveTransport}
        oldTransport={selectedTransport}
      />
      <InfoTransport
        open={openInfoTransport}
        onClose={handleCloseInfoTransport}
        transport={selectedTransport}
        trip={trip}
        handleDelete={handleDeleteTransport}
        onEdit={handleEditTransport}
      />
    </>
  );
};

export default TripDetail;
