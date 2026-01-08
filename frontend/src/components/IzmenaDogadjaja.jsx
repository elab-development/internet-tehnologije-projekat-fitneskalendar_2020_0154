import React, { useState, useEffect } from "react";
import moment from "moment";
import Select from "react-select";
import "./EventForm.css";
import { prikaziToast } from "./toast";
import "react-toastify/dist/ReactToastify.css";
import api from "../ApiService";

const EditEventForm = ({ initialValues, onUpdate, onCancel, idDogadjaja }) => {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [location, setLocation] = useState(initialValues.location);
  const [start, setStart] = useState(
    moment(initialValues.start).format("YYYY-MM-DDTHH:mm")
  );
  const [end, setEnd] = useState(
    moment(initialValues.end).format("YYYY-MM-DDTHH:mm")
  );
  //const [privatnost, setPrivatnost] = useState(!initialValues.privatnost);
  const [isPublic, setIsPublic] = useState(!initialValues.privatnost);
  const [reminders, setReminders] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedReminderOptions, setSelectedReminderOptions] = useState([]);
  const [selektovani, setSelektovani] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState(
    initialValues.tipDogadjaja.id
  );
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          console.log("Korisnik nije autentifikovan.");
          return;
        }

        const response = await api.vratiTipoveDogadjaja();
        setEventTypes(response.data.data);
        // console.log(response.data.data);
      } catch (error) {
        console.error("Greška pri dobavljanju tipova događaja:", error);
      }
    };

    fetchEventTypes();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.vratiDogadjaj(idDogadjaja);
        //console.log("vracen dogadjaj: "+JSON.stringify(response))
        const reminders = getReminderOptionsForNotifications(
          start,
          JSON.stringify(response.data.data.notifikacije)
        );
        //console.log("podsetnici: "+JSON.stringify(reminders));
        setSelektovani(reminders);
      } catch (error) {
        console.error("Greška pri dohvatanju događaja:", error);
      }
    };

    fetchEvent();
  }, [idDogadjaja]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedEvent = {
      // id: initialValues.id,
      naslov: title,
      opis: description || null,
      lokacija: location || null,
      datumVremeOd: start,
      datumVremeDo: end,
      privatnost: !isPublic,
      idTipaDogadjaja: selectedEventType,
      prethodnoSelektovani: selektovani,
      notifikacije: selectedReminderOptions.some(
        (option) => option.value === "no_reminder"
      )
        ? []
        : reminders.map((reminder) => ({
            poruka: generateReminderMessage(reminder.value),
            vremeSlanja: calculateReminderTime(reminder.value, start).format(
              "YYYY-MM-DDTHH:mm:ss"
            ),
          })),
    };
    try {
      const response = await api.izmeniDogadjaj(
        initialValues.id,
        updatedEvent
      );
      // onUpdate(response.data);
      onUpdate(response.data);
      prikaziToast("Sistem je izmenio događaj.",true);
    } catch (error) {
      console.error("Error updating event:", error);
      if(error.response="Podaci nisu validni: The notifikacije.0.vremeSlanja must be a date after or equal to now."){
        prikaziToast("Ne možete uneti podsetnike za događaj koji je već prošao",false);
      }else
      if (error.response && error.response.status === 422) {
        prikaziToast("Greška: Loše uneti podaci! Molimo proverite unos.",false);
      } else {
        prikaziToast("Sistem ne može da izmeni događaj.",false);
      }
    }
  };

  const generateReminderMessage = (value) => {
    switch (value) {
      case "day_before":
        return `Dogadjaj pocinje za 24h.`;
      case "hour_before":
        return `Dogadjaj pocinje za sat vremena.`;
      case "2_hours_before":
        return `Dogadjaj pocinje za 2 sata.`;
      case "15_minutes_before":
        return `Dogadjaj pocinje za 15 minuta.`;
      case "30_minutes_before":
        return `Dogadjaj pocinje za pola sata.`;
      case "45_minutes_before":
        return `Dogadjaj pocinje za 45 minuta.`;
      case "exact_time":
        return `Dogadjaj pocinje sada.`;
      default:
        return "";
    }
  };

  const calculateReminderTime = (reminderValue, startTime) => {
    let reminderTime = moment(startTime);
    switch (reminderValue) {
      case "day_before":
        reminderTime = reminderTime.subtract(1, "days");
        break;
      case "hour_before":
        reminderTime = reminderTime.subtract(1, "hours");
        break;
      case "2_hours_before":
        reminderTime = reminderTime.subtract(2, "hours");
        break;
      case "15_minutes_before":
        reminderTime = reminderTime.subtract(15, "minutes");
        break;
      case "30_minutes_before":
        reminderTime = reminderTime.subtract(30, "minutes");
        break;
      case "45_minutes_before":
        reminderTime = reminderTime.subtract(45, "minutes");
        break;
      case "exact_time":
        break;
      default:
        break;
    }
    return reminderTime;
  };
  const reminderOptions = [
    { value: "day_before", label: "Dan pred" },
    { value: "hour_before", label: "1h pred" },
    { value: "2_hours_before", label: "2h pred" },
    { value: "15_minutes_before", label: "15min pred" },
    { value: "30_minutes_before", label: "30min pred" },
    { value: "45_minutes_before", label: "45min pred" },
    { value: "exact_time", label: "U vreme događaja" },
    { value: "no_reminder", label: "Bez" },
  ];

  const handleAddReminder = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === "no_reminder")) {
      setReminders([]);
      setSelectedReminderOptions([{ value: "no_reminder", label: "Bez" }]);
    } else {
      setReminders(selectedOptions || []);
      setSelectedReminderOptions(selectedOptions || []);
    }
  };
  const getReminderOption = (eventStartTime, notificationTime) => {
    const eventTime = moment(eventStartTime);
    const notifyTime = moment(notificationTime);
    const timeDifference = eventTime.diff(notifyTime);
    const minutes = timeDifference / 60000;
    console.log(`eventTime: ${eventTime}`);
    console.log(`notifyTime: ${notifyTime}`);
    console.log(`timeDifference (ms): ${timeDifference}`);

    if (minutes === 24 * 60) {
      return "day_before";
    } else if (minutes === 60) {
      return "hour_before";
    } else if (minutes === 2 * 60) {
      return "2_hours_before";
    } else if (minutes === 15) {
      return "15_minutes_before";
    } else if (minutes === 30) {
      return "30_minutes_before";
    } else if (minutes === 45) {
      return "45_minutes_before";
    } else if (minutes === 0) {
      return "exact_time";
    } else {
      return "no_reminder";
    }
  };
  const getReminderOptionsForNotifications = (
    eventStartTime,
    notificationTimesJson
  ) => {
    const notificationTimes = JSON.parse(notificationTimesJson);
    return notificationTimes.map((notification) => ({
      reminderOption: getReminderOption(
        eventStartTime,
        notification.vremeSlanja
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Ime događaja:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Lokacija:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
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
            {/* <option value="">Izaberite tip događaja</option> */}
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
          Trenutni podsetnici:
          <div className="reminder-container">
            <Select
              options={reminderOptions}
              isMulti
              isDisabled={true}
              className="reminder-select"
              value={selektovani.map((option) => ({
                value: option.reminderOption,
                label: reminderOptions.find(
                  (opt) => opt.value === option.reminderOption
                )?.label,
              }))}
            />
          </div>
        </label>
        <label>
          Novi željeni podsetnici:
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
        <label>Početak:</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Kraj:</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>

      {/* <div>
        <label>Tip događaja:</label>
        <input type="text" value={idTipa} onChange={(e) => setIdTipa(e.target.value)} />
      </div> */}

      <button type="submit" className="btn btn-primary-izmeni">
        Izmeni
      </button>
    </form>
  );
};

export default EditEventForm;
