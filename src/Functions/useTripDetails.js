import { useState, useEffect } from "react";
import LeftList from "../Components/LeftList";

const fetchData = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
  return response.json();
};

export const useTripDetails = (tripId) => {
  const [trip, setTrip] = useState(null);
  const [transports, setTransports] = useState([]);
  const [savedTransports, setSavedTransports] = useState([]);
  const [living, setLiving] = useState([]);
  const [savedLiving, setSavedLiving] = useState([]);
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

        const livingData = await Promise.all(
          tripDetails.living.map((id) =>
            fetchData(`http://localhost:3001/living/${id}`)
          )
        );
        setLiving(livingData);

        const savedTransportsData = await Promise.all(
          tripDetails.savedTransports.map((id) =>
            fetchData(`http://localhost:3001/transports/${id}`)
          )
        );
        setSavedTransports(savedTransportsData);

        const savedLivingData = await Promise.all(
          tripDetails.savedLiving.map((id) =>
            fetchData(`http://localhost:3001/living/${id}`)
          )
        );
        setSavedLiving(savedLivingData);

        setLeftList([...savedTransports, ...savedLiving]);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    loadTripData();
  }, [tripId]);

  return {
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
  };
};
