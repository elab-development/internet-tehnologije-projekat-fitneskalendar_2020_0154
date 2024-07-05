import React, { useState,useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import './EventForm.css'

const EventForm = ({ onSubmit, selectedSlot }) => {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(moment(selectedSlot.start).format('YYYY-MM-DDTHH:mm'));
  const [endTime, setEndTime] = useState(moment(selectedSlot.end).format('YYYY-MM-DDTHH:mm'));
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [createdEvent, setCreatedEvent] = useState(null);


  useEffect(() => {
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

    fetchEventTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/dogadjaji', {
        idTipaDogadjaja: selectedEventType,
        naslov: eventName,
        datumVremeOd: startTime,
        datumVremeDo: endTime,
        opis: description,
        lokacija: location,
        privatnost: !isPublic,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCreatedEvent(response.data);
      onSubmit(response.data);
      console.log('Uspesno kreiran događaj:', response.data);
    } catch (error) {
      console.error('Greška prilikom kreiranja događaja:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
        
      <label>
        Ime događaja:
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
      </label>
      <label>
        Lokacija:
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </label>
      <label>
        Opis događaja:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label>Tip događaja:</label>
      <select value={selectedEventType} onChange={(e) => setSelectedEventType(e.target.value)} required>
          <option value="">Izaberite tip događaja</option>
          {eventTypes.map((eventType) => (
            <option key={eventType.id} value={eventType.id}>
              {eventType.naziv}
            </option>
          ))}
        </select>
      <label>
        Početak događaja:
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </label>
      <label>
        Kraj događaja:
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </label>
      <label>
        Javni događaj:
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
      </label>
      <button type="submit" onSubmit={handleSubmit}>Kreiraj događaj</button>
    </form>
  );
};

export default EventForm;
