
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import './EventForm.css';
import Select from 'react-select';
import { FaGoogle } from 'react-icons/fa'; 
import { prikaziToast } from './toast';
import 'react-toastify/dist/ReactToastify.css';
import api from '../ApiService';

const EventForm = ({ onSubmit, selectedSlot,initialValues }) => {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(moment(selectedSlot.start).format('YYYY-MM-DDTHH:mm'));
  const [endTime, setEndTime] = useState(moment(selectedSlot.end).format('YYYY-MM-DDTHH:mm'));
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [izabraniTipGoogle, setizabraniTipGoogle] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [selectedReminderOptions, setSelectedReminderOptions] = useState([]);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.log('Korisnik nije autentifikovan.');
          return;
        }

        const response = await api.vratiTipoveDogadjaja();
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

    const eventData = {
      idTipaDogadjaja: selectedEventType? selectedEventType : 7,
      naslov: eventName,
      datumVremeOd: startTime,
      datumVremeDo: endTime,
      opis: description || null,
      lokacija: location || null,
      privatnost: !isPublic,
      notifikacije: selectedReminderOptions.some(option => option.value === 'no_reminder')
        ? []
        : reminders.map(reminder => ({
            poruka: generateReminderMessage(reminder.value),
            vremeSlanja: calculateReminderTime(reminder.value, startTime).format('YYYY-MM-DDTHH:mm:ss'),
          })),
    };
  
    console.log('Podaci za slanje:', eventData);
    try {
      const response = await api.napraviDogadjaj(eventData);
      //setCreatedEvent(response.data);
      onSubmit(response.data);
      console.log('Uspesno kreiran događaj:', response.data);
      prikaziToast('Sistem je zapamtio događaj.', true);
    } catch (error) {
      console.error('Greška prilikom kreiranja događaja:', error);
      if (error.response && error.response.status === 422) {
        prikaziToast('Greška: Loše uneti podaci! Molimo proverite unos.', false);
      } else {
        // Opšta greška za sve ostale situacije
        prikaziToast('Sistem ne može da zapamti događaj.', false);
      }}
  };

  const generateReminderMessage = (value) => {
    switch (value) {
      case 'day_before':
        return `Dogadjaj pocinje za 24h.`;
      case 'hour_before':
        return `Dogadjaj pocinje za sat vremena.`;
      case '2_hours_before':
        return `Dogadjaj pocinje za 2 sata.`;
      case '15_minutes_before':
        return `Dogadjaj pocinje za 15 minuta.`;
      case '30_minutes_before':
        return `Dogadjaj pocinje za pola sata.`;
      case '45_minutes_before':
        return `Dogadjaj pocinje za 45 minuta.`;
      case 'exact_time':
        return `Dogadjaj pocinje sada.`;
     default:
      return '';
    }
  };
  
  const calculateReminderTime = (reminderValue, startTime) => {
    let reminderTime = moment(startTime); 
  switch (reminderValue) {
    case 'day_before':
      reminderTime = reminderTime.subtract(1, 'days');
      break;
    case 'hour_before':
      reminderTime = reminderTime.subtract(1, 'hours');
      break;
    case '2_hours_before':
      reminderTime = reminderTime.subtract(2, 'hours');
      break;
    case '15_minutes_before':
      reminderTime = reminderTime.subtract(15, 'minutes');
      break;
    case '30_minutes_before':
      reminderTime = reminderTime.subtract(30, 'minutes');
      break;
    case '45_minutes_before':
      reminderTime = reminderTime.subtract(45, 'minutes');
      break;
    case 'exact_time':
      break;
    default:
      break;
  }
  return reminderTime;
  };
  const reminderOptions = [
    { value: 'day_before', label: 'Dan pred' },
    { value: 'hour_before', label: '1h pred' },
    { value: '2_hours_before', label: '2h pred' },
    { value: '15_minutes_before', label: '15min pred' },
    { value: '30_minutes_before', label: '30min pred' },
    { value: '45_minutes_before', label: '45min pred' },
    { value: 'exact_time', label: 'U vreme događaja' },
    { value: 'no_reminder', label: 'Bez' },
  ];
  const handleAddReminder = (selectedOptions) => {
    if (selectedOptions.some(option => option.value === 'no_reminder')) {
      setReminders([]);
      setSelectedReminderOptions([{ value: 'no_reminder', label: 'Bez' }]);
    } else {
      setReminders(selectedOptions || []);
      setSelectedReminderOptions(selectedOptions || []);
    }
  };
  const handleGoogleCalendar  = async () => {
    console.log('Dodavanje u Google Kalendar...');
    // if (!selectedEventType) {
    //   alert('Tip događaja je obavezan!');
    //   return; 
    // }
    if (!eventName) {
      prikaziToast('Naziv događaja je obavezan!',false);
      return; 
    }
    console.log(selectedEventType);
    console.log(izabraniTipGoogle);
    const eventData = {
      idTipaDogadjaja: izabraniTipGoogle?izabraniTipGoogle.id:7,
      nazivTipaDogadjaja: izabraniTipGoogle?izabraniTipGoogle.naziv:"Razno",
      naslov: eventName,
      datumVremeOd: startTime,
      datumVremeDo: endTime,
      opis: description || null,
      lokacija: location || null,
     privatnost: !isPublic,
     // notifikacije: selectedReminderOptions.some(option => option.value === 'no_reminder')
      //  ? []
      //  : reminders.map(reminder => ({
      //      poruka: generateReminderMessage(reminder.value),
      //      vremeSlanja: calculateReminderTime(reminder.value, startTime).format('YYYY-MM-DDTHH:mm:ss'),
      //    })),
      reminders: {
        useDefault: false, // iskljucivanje podrazumevanih podsetnika
        overrides: reminders.map(reminder => {
          
          switch (reminder.value) {
            case 'day_before':
              return { method: 'email', minutes: 24 * 60 }; 
            case 'hour_before':
              return { method: 'email', minutes: 60 }; 
            case '2_hours_before':
              return { method: 'email', minutes: 120 }; 
            case '15_minutes_before':
              return { method: 'email', minutes: 15 }; 
            case '30_minutes_before':
              return { method: 'email', minutes: 30 }; 
            case '45_minutes_before':
              return { method: 'email', minutes: 45 }; 
            case 'exact_time':
              return { method: 'email', minutes: 0 };
            default:
              return null;
          }
        }).filter(reminder => reminder !== null),
      },
    };
    console.log("podsetnici");
    console.log(eventData.reminders);
    try
    {
      console.log(eventData);
      const response = await api.googleRedirect(eventData);
      //prikaziToast('Sistem je zapamtio događaj u Google kalendaru.', true);
      //onSubmit(response.data);
      window.open(response.data.authUrl, '_blank');  
    }  
    catch (error) {
      console.error('Greška prilikom kreiranja događaja:', error);
      prikaziToast("Sistem ne može da zapamti događaj u Google kalendaru.",false)
    }
  };

  const handleEventTypeChange = (e) => {
    const selectedId = parseInt(e.target.value); 
    const selectedEventTypeObject = eventTypes.find(type => type.id === selectedId); 
    
    setSelectedEventType(selectedId);
    setizabraniTipGoogle(selectedEventTypeObject);
  };
 
  const handleChange = (e) => {
    handleEventTypeChange(e); 
  };
  return (
    <form onSubmit={handleSubmit} >
      <div className="form-group">
        
        <label>
          Ime događaja:
          <input
            type="text"
            name="naslov"
            className="form-control"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Lokacija:
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Opis događaja:
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Tip događaja:
          <select
            className="form-control"
            value={selectedEventType}
            //onChange={(e) => setSelectedEventType(e.target.value)}
            onChange={handleChange}
            // required
          >
            <option value="">Izaberite tip događaja</option>
            {eventTypes.map((eventType) => (
              <option key={eventType.id} value={eventType.id}>
                {eventType.naziv}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-group">
        <label>
          Podsetnici:
          <div className="reminder-container">
            <Select       
             options={reminderOptions}
             isMulti
             onChange={handleAddReminder}
             className="reminder-select"
             value={selectedReminderOptions}
            />
          </div>
        </label>
      </div>
      <label>
        Javni događaj:
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="form-check-input"
        />
      </label>
      <div className="form-group">
        <label>
          Početak događaja:
          <input
            type="datetime-local"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Kraj događaja:
          <input
            type="datetime-local"
            className="form-control"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>
      </div>
      {/* <button type="submit" className="btn btn-primary"  >Kreiraj događaj</button> */}
      <div className="form-group button-group">
        <button type="submit" className="btn btn-primary">Kreiraj događaj</button>
        <button type="button" className="btn-secondary" onClick={handleGoogleCalendar}>
          Dodaj u Google kalendar 
          <FaGoogle className="google-icon" />
        </button>
      </div>
    </form>
  
  );

};

export default EventForm;
