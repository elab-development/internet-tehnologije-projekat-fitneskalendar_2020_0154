
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import axios from 'axios';
import './EventForm.css';
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventForm = ({ onSubmit, selectedSlot,initialValues }) => {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(moment(selectedSlot.start).format('YYYY-MM-DDTHH:mm'));
  const [endTime, setEndTime] = useState(moment(selectedSlot.end).format('YYYY-MM-DDTHH:mm'));
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState('');
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

    const eventData = {
      idTipaDogadjaja: selectedEventType,
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
      const response = await axios.post('http://127.0.0.1:8000/api/dogadjaji', eventData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      //setCreatedEvent(response.data);
      onSubmit(response.data);
      console.log('Uspesno kreiran događaj:', response.data);
      toast.success('Događaj je uspešno kreiran!', {
        position: 'top-right',
        autoClose: 2000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Greška prilikom kreiranja događaja:', error);
      if (error.response && error.response.status === 422) {
        toast.error('Greška: Loše uneti podaci! Molimo proverite unos.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        // Opšta greška za sve ostale situacije
        toast.error('Greška prilikom kreiranja događaja!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
  return (
    // <div style={{ height: '500px' }}>
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
            onChange={(e) => setSelectedEventType(e.target.value)}
            required
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
      <button type="submit" className="btn btn-primary"  >Kreiraj događaj</button>
    </form>
  
  );

};

export default EventForm;
