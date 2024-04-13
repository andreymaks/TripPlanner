import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Divider } from "@mui/material";
import ListData from "../Components/ListData";
import MyTab from "../Components/MyTab";
import LeftList from "../Components/LeftList";
import SaveTransport from "../Components/SaveTransport";
import InfoTransport from "../Components/InfoTransport";
import useOpenClose from "../Functions/useOpenClose";
import { useTripDetails } from "../Functions/useTripDetails";
import { apiCall } from "../Functions/apiCall";

const TripDetail = () => {
  const { tripId } = useParams();
  const { trip, transports, setTransports, leftList, setLeftList } =
    useTripDetails(tripId);
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
      await apiCall(
        `http://localhost:3001/trips/${tripId}`,
        "PATCH",
        updatedTrip
      );
    }
  };

  const handleSaveTransport = async (transport) => {
    try {
      const newTransport = await apiCall(
        "http://localhost:3001/transports",
        "POST",
        transport
      );
      setTransports((prevTransports) => [...prevTransports, newTransport]);
    } catch (error) {
      console.error("Error adding new transport:", error);
    }
    handleCloseTransport();
  };

  const handleDeleteTransport = async (transport) => {
    try {
      await apiCall(
        `http://localhost:3001/transports/${transport.id}`,
        "DELETE"
      );
      setTransports(transports.filter((t) => t.id !== transport.id));
    } catch (error) {
      console.error("Error deleting a transport:", error);
    }

    handleCloseInfoTransport();
  };

  const handleEditTransport = async (transport) => {
    try {
      const updatedTransport = await apiCall(
        `http://localhost:3001/transports/${transport.id}`,
        "PUT",
        transport
      );
      setTransports((prevTransports) =>
        prevTransports.map((t) =>
          t.id === transport.id ? updatedTransport : t
        )
      );
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
      await apiCall(
        `http://localhost:3001/trips/${tripId}`,
        "PATCH",
        updatedTrip
      );
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
            onOpenSave={() => {
              setSelectedTransport({
                name: "",
                type: "",
                dateOfDeparture: "",
                duration: "",
                from: "",
                to: "",
                price: "",
              });
              handleOpenTransport();
            }}
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
