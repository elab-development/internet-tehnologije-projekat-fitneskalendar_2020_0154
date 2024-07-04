import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import './Kalendar.css'; 
import moment from 'moment';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate, Link } from 'react-router-dom'; 
import Navbar from './Navbar'; 

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root'); 

const AdminCal = () => {
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [weatherData, setWeatherData] = useState(null); 
  const [role, setRole] = useState('admin'); // Pretpostavljena uloga je admin

  const navigate = useNavigate();

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
    fetchEvents();
  }, []);

  const getUserRole = () => {
    const token = window.sessionStorage.getItem('authToken');
    if (token) {
      return 'admin'; // ili 'user'
    }
    return 'guest';
  };

  const fetchEvents = async () => {
    try {
        const token = window.sessionStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/api/sviDogadjaji', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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
        privatnost: event.privatnost,
        email: event.korisnik.email
      }));
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout', null, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
        },
      });
      navigate('/login');
      setToken(null);
      sessionStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const ColoredDateCellWrapper = ({ children }) =>
    React.cloneElement(React.Children.only(children), {
      style: {
        backgroundColor: 'lightblue',
      },
    });

  const closeModal = () => {
    setSelectedEvent(null);
    setWeatherData(null);
  };

  const eventPropGetter = (event) => {
    let backgroundColor = event.privatnost ? 'red' : '#3182ce';  
    return {
      style: { backgroundColor }
    };
  };

  return (
    <div style={{ height: '600px' }}>
      <Navbar role={role} handleLogout={handleLogout} /> {/* Uključi Navbar */}
      <Calendar
        localizer={localizer}
        events={events}
        views={['month', 'week', 'day', 'agenda']}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '50px' }}
        components={{
            timeSlotWrapper: ColoredDateCellWrapper
        }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
      />
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
            <p><strong>Email korisnika koji je kreirao događaj:</strong> {selectedEvent.email}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminCal;
