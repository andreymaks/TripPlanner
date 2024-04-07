import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';

const TripDetail = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);

    useEffect (() => {
        const fetchTrip = async () => {
            try {
                const response = await fetch(`http://localhost:3001/trips/${tripId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch trip");
                }
                const data = await response.json();
                setTrip(data);
            } catch (error) {
                console.error("Error fetching trip:", error);
            }
        };
        fetchTrip();
    }, [tripId])

    if (!trip) return <div>Loading...</div>

    return (
        <div style={{margin: '20px'}}>
            <Typography variant="h5">{trip.name}</Typography>
        </div>
    );
};

export default TripDetail;