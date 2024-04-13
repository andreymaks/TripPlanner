import { useState, useEffect } from "react";

const fetchData = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
  return response.json();
};

export const useTripDetails = (tripId) => {
  const [trip, setTrip] = useState(null);
  const [transports, setTransports] = useState([]);
  const [leftList, setLeftList] = useState([]);

  useEffect(() => {
    const loadTripData = async () => {
      try {
        const tripDetails = await fetchData(
          `http://localhost:3001/trips/${tripId}`
        );
        setTrip(tripDetails);

        const transportsData = await Promise.all(
          tripDetails.transports.map((id) =>
            fetchData(`http://localhost:3001/transports/${id}`)
          )
        );
        setTransports(transportsData);

        const leftListData = await Promise.all(
          tripDetails.savedTransports.map((id) =>
            fetchData(`http://localhost:3001/transports/${id}`)
          )
        );
        setLeftList(leftListData);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    loadTripData();
  }, [tripId]);

  return { trip, transports, setTransports, leftList, setLeftList };
};
