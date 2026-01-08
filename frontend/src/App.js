
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router,Route, Routes, BrowserRouter } from 'react-router-dom'; 
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CombinedCalendar from './components/Kal';
import Navbar from './components/Navbar';
import WeatherForecast from './components/Prognoza';
import Korisnici from './components/KorisniciPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || 'guest');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    localStorage.setItem('role', newRole);
  };
  
  return (
    <BrowserRouter>
    <div className="App">
    <Navbar role={role} handleRoleChange={() => handleRoleChange('guest')} />
      <Routes>
        <Route path="/" element={<CombinedCalendar />} />
        <Route path="/login" element={<LoginPage handleRoleChange={handleRoleChange} />} />
        <Route path="/register" element={<RegisterPage  handleRoleChange={handleRoleChange} />} />
        <Route path="/kalendar" element={<CombinedCalendar />} />
        <Route path="/weather" element={<WeatherForecast />} />
        <Route path="/korisnici" element={<Korisnici />} />
        Navbar
      </Routes>
      <ToastContainer />
    </div>
  </BrowserRouter>

  );
}

export default App;
