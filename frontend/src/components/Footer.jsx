import React, { useState, useEffect } from 'react';
import './Footer.css';
import axios from 'axios';

const Footer = ({ onEventTypeSelect ,showAllEvents  }) => {
  const [eventTypes, setEventTypes] = useState([]);

  const fetchEventTypes = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.log('Korisnik nije autentifikovan.');
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/tipoviDogadjaja', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setEventTypes(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Greška pri dobavljanju tipova događaja:', error);
    }
  };

  const handleEventTypeSelect = (eventType) => {
    onEventTypeSelect(eventType.id); // Prosleđujemo samo ID tipa događaja
  };
  useEffect(() => {
    fetchEventTypes();
  }, []);
  const handleShowAllEvents = () => {
    showAllEvents();  //ovo nam treba za kalendar, da javimo da vrati sve dogadjaje za korisnika
  };
  return (
    <div className="footer">
      <div className="left-links">
        <div className="dropdown">
          <button className="dropbtn">Tipovi Događaja</button>
          <div className="dropdown-content">
            {eventTypes.map((type) => (
              <a key={type.id} onClick={() => handleEventTypeSelect(type)}>
                {type.naziv}
                <span className="tooltip">{type.opis}</span>
              </a>
            ))}
          </div>
        </div>
        <button className="show-all-btn" onClick={handleShowAllEvents}>Svi događaji</button>
      </div>
    </div>
  );
};

export default Footer;
