import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Kalendar.css';
import moment from 'moment';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate , Link} from 'react-router-dom';
import EventForm from './EventForm';

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root');

const CombinedCalendar = ({ handleRoleChange }) => {
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();
  const [role, setRole] = useState('guest');

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

  useEffect(() => {
    const authToken = window.localStorage.getItem('authToken');
    if (authToken) {
      checkTokenExpiration(authToken);
    } 
  });
  
  const checkTokenExpiration = (token) => {
    const tokenExpiration = localStorage.getItem('expiration');
  
    if (token && tokenExpiration) {
        const expirationTime = new Date(tokenExpiration).getTime();
        const currentTime = new Date().getTime();
        if (currentTime > expirationTime) {
            alert('Vaša sesija je istekla. Molimo prijavite se ponovo!');
            handleLogoutSesija();
        }
    }
  };
  const handleLogoutSesija = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('expiration');
    handleRoleChange('guest');
    navigate('/login'); 
};
  const checkAdminStatus = (authToken) => {
    axios.get('http://127.0.0.1:8000/api/user', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then(response => {

      setIsAdmin(response.data.uloga === 'admin');
      //console.log("isAdmin:", isAdmin);
      setRole(response.data.uloga); 
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

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo); 
    setShowForm(true); 
};
const handleSubmitForm = (eventData) => {
  const authToken = window.localStorage.getItem('authToken');
  fetchEvents(authToken);
  console.log('Event Data:', eventData);
  setShowForm(false); 
};
const handleCloseForm = () => {
  setShowForm(false); 
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
    <div className="react-modal-content">
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
      <Calendar
        localizer={localizer}
        events={events}
        views={['month', 'week', 'day', 'agenda']}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '50px' }}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        eventPropGetter={token ? eventPropGetter : undefined}
        showAllEvents={true}
        selectable={true}

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
      {showForm && (
            <div className="event-form">
                <EventForm onSubmit={handleSubmitForm} selectedSlot={selectedSlot}/>
                <button onClick={handleCloseForm}>Cancel</button>
            </div>
        )}
      </div>
  );
};

export default CombinedCalendar;
