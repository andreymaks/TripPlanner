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
  const {
    trip,
    transports,
    setTransports,
    savedTransports,
    setSavedTransports,
    living,
    setLiving,
    savedLiving,
    setSavedLiving,
    leftList,
    setLeftList,
  } = useTripDetails(tripId);
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
  const listMapping = {
    transports: {
      data: transports,
      setData: setTransports,
    },
    savedTransports: {
      data: savedTransports,
      setData: setSavedTransports,
    },
    living: {
      data: living,
      setData: setLiving,
    },
    savedLiving: {
      data: savedLiving,
      setData: setSavedLiving,
    },
  };

  // Function to move item from one list to another
  const moveItem = async (item, from, to) => {
    // Update source list
    console.log(from, to);
    listMapping[from].setData((prevSourceList) => {
      return prevSourceList.filter((i) => i.id !== item.id);
    });

    // Update destination list
    listMapping[to].setData((prevDestinationList) => {
      return [...prevDestinationList, item];
    });
  };

  useEffect(() => {
    const updateTrip = async () => {
      const updatedTrip = {
        transports: transports.map((t) => t.id),
        savedTransports: savedTransports.map((st) => st.id),
        living: living.map((l) => l.id),
        savedLiving: savedLiving.map((sl) => sl.id),
      };

      try {
        await apiCall(
          `http://localhost:3001/trips/${tripId}`,
          "PATCH",
          updatedTrip
        );
      } catch (error) {
        console.error("Error updating the trip:", error);
      }
    };

    // Call updateTrip if there's relevant data
    if (
      transports.length > 0 ||
      savedTransports.length > 0 ||
      living.length > 0 ||
      savedLiving.length > 0
    ) {
      updateTrip();
    }
  }, [transports, savedTransports, living, savedLiving, tripId]);

  const handleSaveTransport = async (transport) => {
    transport.category = "transports";
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
    setLeftList([...savedTransports, ...savedLiving]);
  }, [savedTransports, savedLiving]);

  useEffect(() => {
    setTransports(transports);
  }, [transports]);

  useEffect(() => {
    setLiving(living);
  }, [living]);

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
          <ListData
            data={living}
            name="Living"
            onMoveItem={moveItem}
            // onOpenSave={() => {
            //   setSelectedTransport({
            //     name: "",
            //     type: "",
            //     dateOfDeparture: "",
            //     duration: "",
            //     from: "",
            //     to: "",
            //     price: "",
            //   });
            //   handleOpenTransport();
            // }}
            onOpenSave={() => {}}
            // onOpenInfo={(transport) => {
            //   setSelectedTransport(transport);
            //   handleOpenInfoTransport();
            // }}
            onOpenInfo={() => {}}
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
