import React, { useEffect, useState } from "react";
import axios from "axios";
import { prikaziToast } from "./toast";
const MapDisplay = ({ address, showMap }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [errorShown, setErrorShown] = useState(false);

  useEffect(() => {
    if (showMap  && !errorShown) {
      const apiUrl = `http://127.0.0.1:8000/api/vratiKoordinate/${encodeURIComponent(
        address
      )}`;
      fetchCoordinates(apiUrl);
    }
  }, [showMap]); // useEffect se poziva kada se promeni showMap
  
  const fetchCoordinates = async (apiUrl) => {
    try {
      const response = await axios.get(apiUrl);
      const { coordinates } = response.data;
      const [longitude, latitude] = coordinates;
      setCoordinates({ latitude, longitude });
    } catch (error) {
      console.error("Greška prilikom dohvatanja koordinata:", error.message);
      if (!errorShown){prikaziToast("Sistem ne može da učita lokaciju događaja.",false);
      setErrorShown(true);}
    }
  };

  if (!showMap || !coordinates) {
    return null;
  }

  const { latitude, longitude } = coordinates;
  const zoom = 24;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    longitude - 0.1
  },${latitude - 0.1},${longitude + 0.1},${
    latitude + 0.1
  }&marker=${latitude},${longitude}&layers=M&zoom=${zoom}`;

  return (
    <div className="map-container">
      <iframe
        width="100%"
        height="200"
        src={mapUrl}
        title="Mapa lokacije"
      ></iframe>
    </div>
  );
};

export default MapDisplay;
