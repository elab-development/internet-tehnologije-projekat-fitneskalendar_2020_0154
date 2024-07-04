import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Kalendar.css'; 
import moment from 'moment';
import axios from 'axios';
import Modal from 'react-modal';
//import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom'; 
import Navbar from './Navbar'; // Importuj Navbar komponentu

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root'); 

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [weatherData, setWeatherData] = useState(null); 
  const [role, setRole] = useState('guest'); // Pretpostavljena uloga je gost
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
    fetchPublicEvents();
  }, []);

  const getUserRole = () => {
    const token = window.sessionStorage.getItem('authToken');
    if (token) {
      return 'admin'; // ili 'user'
    }
    return 'guest';
  };

  const fetchPublicEvents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/dogadjaji/javni');
      console.log(response.data);
      let eventData = response.data.data;
      if (!Array.isArray(eventData)) {
        throw new Error('Response data is not an array');
      }

      const transformedEvents = eventData.map(event => ({
        title: event.naslov,
        start: moment(event.datumVremeOd).toDate(),
        end: moment(event.datumVremeDo).toDate(),
        description: event.opis,
        location: event.lokacija,
      }));
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching public events:', error);
    }
  };

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
     // try {
    //   const start = moment(event.start);
    //   const end = moment(event.end);
    //   const days = end.diff(start, 'days') + 1;
  
    //   let weatherData = [];
    //   for (let i = 0; i < days; i++) {
    //     const currentDate = start.clone().add(i, 'days');
    //     const date = currentDate.format('YYYY-MM-DD');
    //     const response = await axios.get(`http://127.0.0.1:8000/api/prognoza/${event.location}/${date}`);
    //     weatherData.push(response.data);
    //   }
  
    //   setWeatherData(weatherData);
    // } catch (error) {
    //   console.error('Error fetching weather data:', error);
    // }
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setWeatherData(null);
     
  };

  const Event = ({ event }) => (
    <span className="custom-event">{event.title}</span>
  );

  const DayWrapper = ({ children }) => (
    <div className="custom-day">
      {children}
    </div>
  );
  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout', null, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
        },
      });
      navigate('/login');
      sessionStorage.removeItem('authToken');
      setRole('guest');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="calendar-page">
      <Navbar role={role} handleLogout={handleLogout} /> {/* Uključi Navbar */}
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          views={['month', 'week', 'day', 'agenda']}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
        />
      </div>
      <Modal
        isOpen={!!selectedEvent}
        onRequestClose={closeModal}
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        contentLabel="Detalji događaja"
      >
        {selectedEvent && (
          <div>
            <button className="close-button" onClick={closeModal}>&times;</button>
            <h2>{selectedEvent.title}</h2>
            <p><strong>Početak:</strong> {moment(selectedEvent.start).format('LLLL')}</p>
            <p><strong>Kraj:</strong> {moment(selectedEvent.end).format('LLLL')}</p>
            <p><strong>Opis:</strong> {selectedEvent.description}</p>
            <p><strong>Lokacija:</strong> {selectedEvent.location}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarComponent;
