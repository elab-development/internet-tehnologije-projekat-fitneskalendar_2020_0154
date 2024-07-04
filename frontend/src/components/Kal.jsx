import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Kalendar.css';
import moment from 'moment';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate, Link } from 'react-router-dom';

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root');

const CombinedCalendar = () => {
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); 
  const navigate = useNavigate();


  useEffect(() => {
    const authToken = window.localStorage.getItem('authToken');
    setToken(authToken);
    if (authToken) {
     checkAdminStatus(authToken); 
      fetchEvents(authToken);
    } else {
      fetchPublicEvents();
    }
  }, []);

  const checkAdminStatus = (authToken) => {
    axios.get('http://127.0.0.1:8000/api/user', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then(response => {

      setIsAdmin(response.data.uloga === 'admin');
      //console.log("isAdmin:", isAdmin);
    }).catch(error => {
      console.error('Error checking admin status:', error);
    });
  };

  const fetchEvents = async (authToken) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/dogadjaji', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
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
        korisnik:event.korisnik,
        email:event.korisnik.email
      }));
     // console.log(transformedEvents);
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchPublicEvents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/dogadjaji/javni');
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

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setToken(null);
      localStorage.removeItem('authToken');
      fetchPublicEvents();
      navigate('/kalendar');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const eventPropGetter = (event) => {
    let backgroundColor = event.privatnost ? 'red' : '#3182ce';
    return {
      style: { backgroundColor },
    };
  };

  const renderModalContent = () => (
    <div>
      <button className="close-button" onClick={closeModal}>&times;</button>
      <h2>{selectedEvent.title}</h2>
      <p><strong>Početak:</strong> {moment(selectedEvent.start).format('LLLL')}</p>
      <p><strong>Kraj:</strong> {moment(selectedEvent.end).format('LLLL')}</p>
      <p><strong>Opis:</strong> {selectedEvent.description}</p>
      <p><strong>Lokacija:</strong> {selectedEvent.location}</p>
      {isAdmin && selectedEvent.email && (
      <p><strong>Email korisnika koji je kreirao događaj:</strong> {selectedEvent.email}</p>
    )}
    </div>
  );

  return (
    <div style={{ height: '600px' }}>
      <div className="calendar-header">
        {token ? (
          <Link onClick={handleLogout}>Logout</Link>
        ) : (
          <>
            <Link to="/login" className="auth-link">Prijavi se</Link>
            <Link to="/register" className="auth-link">Registruj se</Link>
          </>
        )}
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        views={['month', 'week', 'day', 'agenda']}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '50px' }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={token ? eventPropGetter : undefined}
      />
      <Modal
        isOpen={!!selectedEvent}
        onRequestClose={closeModal}
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        contentLabel="Detalji događaja"
      >
        {selectedEvent && renderModalContent()}
      </Modal>
    </div>
  );
};

export default CombinedCalendar;
