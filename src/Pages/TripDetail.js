import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Divider } from '@mui/material';
import ListData from '../Components/ListData';
import MyTab from '../Components/MyTab';
import LeftList from '../Components/LeftList';



const TripDetail = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    // Adjust the states to handle drag and drop
    const [transports, setTransports] = useState([]);
    const [leftList, setLeftList] = useState([]);

    // Function to move item from one list to another
    const moveItem = (item, sourceType, destinationType) => {
        // Initialize updated lists from the current state
        let updatedSourceList = sourceType === 'transports' ? [...transports] : [...leftList];
        let updatedDestinationList = destinationType === 'transports' ? [...transports] : [...leftList];
    
        // Find and remove the item from the source list
        const itemIndex = updatedSourceList.findIndex((i) => i.id === item.id);
        if (itemIndex > -1) {
            const [removedItem] = updatedSourceList.splice(itemIndex, 1); // Remove item from source
    
            // Add the removed item to the destination list
            updatedDestinationList.push(removedItem);
    
            // Update state based on the source and destination types
            if (sourceType === 'transports') {
                setTransports(updatedSourceList);
            } else if (sourceType === 'leftList') {
                setLeftList(updatedSourceList);
            }
    
            if (destinationType === 'transports') {
                setTransports(updatedDestinationList);
            } else if (destinationType === 'leftList') {
                setLeftList(updatedDestinationList);
            }
        }
    };
    
    

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                // Fetch the trip details
                const tripResponse = await fetch(`http://localhost:3001/trips/${tripId}`);
                if (!tripResponse.ok) {
                    throw new Error("Failed to fetch trip");
                }
                const trip = await tripResponse.json();
                setTrip(trip);
    
                // Fetch transports directly associated with the trip
                const transportPromises = trip.transports.map((transportId) =>
                    fetch(`http://localhost:3001/transports/${transportId}`).then(res => res.json())
                );

                // Fetch transports directly associated with the trip
                const savedTransportPromises = trip.savedTransports.map((transportId) =>
                    fetch(`http://localhost:3001/transports/${transportId}`).then(res => res.json())
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
    

    if (!trip) return <div>Loading...</div>

    return (
        <>
            <MyTab name={trip.name} />
            <Box sx={{ display: 'flex', margin: '20px', height: '100vh' }}>
                <Box sx={{ width: '75%' }}>
                    <LeftList data={leftList} name="Left List" onMoveItem={moveItem} listType="leftList" />
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ transform: 'translateX(6px)', width: '25%' }}>
                    <ListData data={transports} name="Transports" onMoveItem={moveItem} listType="transports" />
                </Box>
            </Box>
        </>
    );
};

export default TripDetail;