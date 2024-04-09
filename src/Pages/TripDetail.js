import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import ListData from '../Components/ListData';


const TripDetail = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [transports, setTransports] = useState([]);
    const [transportListVisible, setTransportListVisible] = useState(false);

    useEffect (() => {
        const fetchTrip = async () => {
            try {
                const response = await fetch(`http://localhost:3001/trips/${tripId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch trip");
                }
                const data = await response.json();
                setTrip(data);
                return data.transports;
            } catch (error) {
                console.error("Error fetching trip:", error);
            }
        };
        fetchTrip().then((transportIds) => {
            if (transportIds && transportIds.length > 0) {
                const fetchTransport = async (transportId) => {
                    try {
                        const response = transportIds.map((transportId) => 
                        fetch (`http://localhost:3001/transports/${transportId}`).then((res) => res.json())
                        );
                        const transportsData = await Promise.all(response);
                        setTransports(transportsData);
                    } catch (error) {
                        console.error("Error fetching transport:", error);
                    }
                };
                fetchTransport();
            }
        });
        
        
    }, [tripId])

    if (!trip) return <div>Loading...</div>

    return (
        <Box sx={{display: 'flex', margin: '20px'}}>
            {/* Left Part */}
            <Box sx={{width: '75%'}}>
                <Typography>Warsaw</Typography>
            </Box>

            {/* Right Part */}
            <Box sx={{width: '25%'}}>
                {/* <Typography variant="h6" onClick={() => setTransportListVisible(!transportListVisible)}
                sx={{cursor: 'pointer'}}>
                    Transports
                    {transportListVisible ? <ExpandLess /> : <ExpandMore />}
                </Typography>
                
                {transportListVisible && (
                    <List>
                        {transports.map((transport) => (
                            <React.Fragment key={transport.id}>
                                <ListItem>
                                    <ListItemText primary={transport.name}/>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                )} */}
                <ListData data={transports} name="Transports"/> 
            </Box>
        </Box>
    );
};

export default TripDetail;