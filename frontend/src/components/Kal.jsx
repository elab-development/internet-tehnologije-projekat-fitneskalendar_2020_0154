import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer,Views  } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Kalendar.css";
import moment from "moment";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate, Link } from "react-router-dom";
import EventForm from "./EventForm";
import EditEventForm from "./IzmenaDogadjaja";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";
import api from "../Api";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import MapDisplay from "./Map";

const localizer = momentLocalizer(moment);

Modal.setAppElement("#root");

const CombinedCalendar = () => {
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();
  const [role, setRole] = useState("guest");
  const [isEditMode, setIsEditMode] = useState(false);
  const [idKorisnika, setIdKorisnika] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [filteredEventType, setFilteredEventType] = useState(null);
  const [showMap, setShowMap] = useState(false); 

  const DragAndDropCalendar = withDragAndDrop(Calendar);
  
  useEffect(() => {
    const authToken = window.localStorage.getItem("authToken");
    setToken(authToken);
    if (authToken) {
      checkAdminStatus(authToken);
      fetchEvents(authToken);
    } else {
      fetchPublicEvents();
    }
  }, []);

  // useEffect(() => {
  //   const authToken = window.localStorage.getItem("authToken");
  //   if (authToken) {
  //    // checkTokenExpiration(authToken);
  //   }
  // });
  useEffect(() => {
    // fja za sortiranje
    const fetchEvents = async (eventTypeId) => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await api.vratiKonkretniTipDogadjaja(eventTypeId,authToken);
        let eventData = response.data.data;

        if (!Array.isArray(eventData)) {
          throw new Error("Response data is not an array");
        }

        const transformedEvents = eventData.map((event) => ({
          title: event.naslov,
          start: moment(event.datumVremeOd).toDate(),
          end: moment(event.datumVremeDo).toDate(),
          description: event.opis,
          location: event.lokacija,
          privatnost: event.privatnost,
          korisnik: event.korisnik,
          email: event.korisnik.email,
          idKorisnika: event.korisnik.id,
          id: event.id,
          tipDogadjaja: event.tipDogadjaj,
        }));

        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (filteredEventType) {
      fetchEvents(filteredEventType);
    }
  }, [filteredEventType]);
  const prikaziToast = (poruka, uspesno) => {
    if (uspesno) {
      toast.success(poruka, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error(poruka, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  // const checkTokenExpiration = (token) => {
  //   const tokenExpiration = localStorage.getItem("expiration");

  //   if (token && tokenExpiration) {
  //     const expirationTime = new Date(tokenExpiration).getTime();
  //     const currentTime = new Date().getTime();
  //     if (currentTime > expirationTime) {
  //       alert("Vaša sesija je istekla. Molimo prijavite se ponovo!");
  //       handleLogoutSesija();
  //     }
  //   }
  // };
  // const handleLogoutSesija = () => {
  //   localStorage.removeItem("authToken");
  //   localStorage.removeItem("expiration");
  //   handleRoleChange("guest");
  //   navigate("/login");
  // };
  const checkAdminStatus = (authToken) => {
    api.vratiKorisnika(authToken)
      .then((response) => {
        const idKor = response.data.id;
        setIdKorisnika(idKor); //potrebno za update dogadjaja
        setIsAdmin(response.data.uloga === "admin");
        //console.log("isAdmin:", isAdmin);
        setRole(response.data.uloga);
      })
      .catch((error) => {
        console.error("Error checking admin status:", error);
      });
  };

  const fetchEvents = async (authToken) => {
    try {
      const response = await api.vratiDogadjaje(authToken);
      let eventData = response.data.data;
      //console.log(eventData);
      if (!Array.isArray(eventData)) {
        throw new Error("Response data is not an array");
      }

      const transformedEvents = eventData.map((event) => ({
        title: event.naslov,
        start: moment(event.datumVremeOd).toDate(),
        end: moment(event.datumVremeDo).toDate(),
        description: event.opis,
        location: event.lokacija,
        privatnost: event.privatnost,
        korisnik: event.korisnik,
        idKorisnika: event.korisnik.id,
        email: event.korisnik.email,
        id: event.id,
        tipDogadjaja: event.tipDogadjaj,
      }));
      //console.log(transformedEvents);
      setEvents(transformedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchPublicEvents = async () => {
    try {
      const response = await api.vratiJavneDogadjaje();
      let eventData = response.data.data;
      if (!Array.isArray(eventData)) {
        throw new Error("Response data is not an array");
      }
      const transformedEvents = eventData.map((event) => ({
        title: event.naslov,
        start: moment(event.datumVremeOd).toDate(),
        end: moment(event.datumVremeDo).toDate(),
        description: event.opis,
        id:event.id,
        location: event.lokacija,
      }));
      setEvents(transformedEvents);
    } catch (error) {
      console.error("Error fetching public events:", error);
    }
  };

  const handleSelectEvent = (event) => {
    setIsOpenModal(true);
    setIsEditMode(false);
    setSelectedEvent(event);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setShowForm(true);
  };
  const handleSubmitForm = (eventData) => {
    const authToken = window.localStorage.getItem("authToken");
    fetchEvents(authToken); //kako bi prikazao i novonapravljeni dogadjaj
    console.log("Event Data:", eventData);
    setShowForm(false);
  };
  const handleUpdateForm = (eventData) => {
    const authToken = window.localStorage.getItem("authToken");
    fetchEvents(authToken);
    setShowFormEdit(false);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleCloseFormEdit = () => {
    setShowFormEdit(false);
  };

  const closeModal = () => {
    // setSelectedEvent(null);
    //setSelectedSlot(null);
    setIsOpenModal(false);
    setShowMap(false);
  };

  const eventPropGetter = (event) => {
    let backgroundColor = event.privatnost ? "red" : "#3182ce";
    return {
      style: { backgroundColor },
    };
  };

  const handleEditEvent = () => {
    setShowFormEdit(true);
    setIsOpenModal(false);
  };

  const handleDeleteEvent = async () => {
    const confirmDelete = window.confirm(
      "Da li ste sigurni da želite da obrišete ovaj događaj?"
    );
    console.log(selectedEvent.id);
    if (confirmDelete) {
      try {
        const authToken = window.localStorage.getItem("authToken");
        const response = await api.izbrisiDogadjaj(selectedEvent.id,authToken);
        console.log("Dogadjaj je uspešno obrisan", response.data);
        prikaziToast("Događaj je uspešno izbrisan!",true);
        fetchEvents(authToken);
        closeModal();
      } catch (error) {
        console.error("Greška prilikom brisanja događaja", error);
        prikaziToast("Greška prilikom brisanja događaja!",false);
      }
    }
  };
  const showMapHandler = () => {
    setShowMap(true);
  };

  const renderModalContent = () => (
    <div className="react-modal-content">
      <button className="close-button" onClick={closeModal}>
        &times;
      </button>
      <h2>{selectedEvent.title}</h2>
      <p>
        <strong>Početak:</strong> {moment(selectedEvent.start).format("LLLL")}
      </p>
      <p>
        <strong>Kraj:</strong> {moment(selectedEvent.end).format("LLLL")}
      </p>
      <p>
        <strong>Opis:</strong> {selectedEvent.description}
      </p>
      <p>
        <strong>Lokacija:</strong> {selectedEvent.location}
      </p>
      {selectedEvent.location && (
        <button onClick={showMapHandler}>Prikaži na mapi</button>
      )}
      {showMap && (
        <MapDisplay address={selectedEvent.location} showMap={showMap} />
      )}

      {/* <p><strong>id:</strong> {selectedEvent.id}</p>
      <p><strong>tip:</strong> {selectedEvent.idTipa}</p> */}
      {isAdmin && selectedEvent.email && (
        <p>
          <strong>Email korisnika koji je kreirao događaj:</strong>{" "}
          {selectedEvent.email}
        </p>
      )}
      {role !== "guest" && idKorisnika === selectedEvent.idKorisnika && (
        <div>
          <button onClick={handleEditEvent}>Izmeni</button>
          <button onClick={handleDeleteEvent}>Obriši</button>
        </div>
      )}
      {role === "admin" && idKorisnika !== selectedEvent.idKorisnika && (
        <button onClick={handleDeleteEvent}>Obriši kao admin</button>
      )}
      <button
        onClick={() =>
          (window.location.href = `http://127.0.0.1:8000/ics/${selectedEvent.id}`)
        }
      >
        Preuzmi .ics
      </button>
    </div>
  );
  const showAllEvents = async () => {
    const authToken = window.localStorage.getItem("authToken");
    fetchEvents(authToken);
  };
  const showMyEvents = async () => {
    const authToken = window.localStorage.getItem("authToken");
   // const response=api.vratiDogadjajeKorisnika()
   try {
    const response = await api.korisnikoviDogadjaji(authToken);
    let eventData = response.data.data;

    const transformedEvents = eventData.map((event) => ({
      title: event.naslov,
      start: moment(event.datumVremeOd).toDate(),
      end: moment(event.datumVremeDo).toDate(),
      description: event.opis,
      location: event.lokacija,
      privatnost: event.privatnost,
      korisnik: event.korisnik,
      idKorisnika: event.korisnik.id,
      email: event.korisnik.email,
      id: event.id,
      tipDogadjaja: event.tipDogadjaj,
    }));
    setEvents(transformedEvents);
    console.log("dogadjaji korisnika:");
    console.log(eventData);
   }catch(error){
    console.error("Došlo je do greške prilikom preuzimanja događaja:", error);
    }
    // setEvents(events.filter((event) => event.privatnost === 1));
  };
  const handleEventTypeSelect = (eventTypeId) => {
    setFilteredEventType(eventTypeId);
  };
  const onEventDrop = async ({ event, start, end }) => {
    if (idKorisnika !== event.korisnik.id) {
      prikaziToast("Nemate pravo da menjate ovaj događaj!",false);
      return;
    }
    const updatedEvent = { ...event, start, end };

    const updatedEvents = events.map(existingEvent =>
      existingEvent.id === event.id
        ? updatedEvent
        : existingEvent
    );
    const transformisaniUpdate = {
      naslov: updatedEvent.title,
      opis: updatedEvent.description || null,
      lokacija: updatedEvent.location || null,
      datumVremeOd: moment(updatedEvent.start).format('YYYY-MM-DD HH:mm:ss'),
      datumVremeDo:  moment(updatedEvent.end).format('YYYY-MM-DD HH:mm:ss'),
      privatnost: updatedEvent.privatnost,
      idTipaDogadjaja: updatedEvent.tipDogadjaja.id,
    };
    setEvents(updatedEvents);
    console.log("apdejtovani:");
    console.log(updatedEvent);
    try {
    const authToken = window.localStorage.getItem("authToken");
      const response = await api.izmeniDogadjaj(event.id, transformisaniUpdate, authToken);
      prikaziToast("Uspešno izmenjen datum događaja!",true);
    } catch (error) {
      prikaziToast("Greška pri izmeni datuma događaja!",false);
      setEvents(prevEvents => prevEvents.map(existingEvent =>
        existingEvent.id === event.id
          ? { ...existingEvent, start: event.start, end: event.end }
          : existingEvent
      ));
    }
  }
  
  return (
    <div style={{ backgroundColor, height: "500px" }}>
      <DndProvider backend={HTML5Backend}>
      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        views={["month", "week", "day", "agenda"]}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: "50px" }}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        eventPropGetter={token ? eventPropGetter : undefined}
        showAllEvents={true}
        selectable={role !== "guest"}
        onEventDrop={role !== 'guest' ? onEventDrop : undefined}
        />
        </DndProvider>
      <Modal
        //isOpen={!!selectedEvent}
        isOpen={isOpenModal}
        onRequestClose={closeModal}
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        contentLabel="Detalji događaja"
      >
        {selectedEvent && renderModalContent()}
      </Modal>
      {showFormEdit && (
        <div className="event-form">
          <EditEventForm
            onUpdate={handleUpdateForm}
            initialValues={selectedEvent}
            idDogadjaja={selectedEvent.id}
          />
          <button onClick={handleCloseFormEdit}>Otkaži</button>
        </div>
      )}
      {showForm && (
        <div className="event-form">
          <EventForm
            onSubmit={handleSubmitForm}
            selectedSlot={selectedSlot}
            role={role}
          />
          <button onClick={handleCloseForm}>Otkaži</button>
        </div>
      )}
      {role !== "guest" && (
        <Footer
          onEventTypeSelect={handleEventTypeSelect}
          showAllEvents={showAllEvents}
          showMyEvents={showMyEvents}
        />
      )}
    </div>
  );
};

export default CombinedCalendar;
