
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router,Route, Routes, BrowserRouter } from 'react-router-dom'; 
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CombinedCalendar from './components/Kal';
import Navbar from './components/Navbar';
// import WeatherForecast from './components/Prognoza';


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
        <Route path="/kalendar" element={<CombinedCalendar handleRoleChange={handleRoleChange}  />} />
        {/* <Route path="/weather" element={<WeatherForecast />} /> */}
        Navbar
      </Routes>
    </div>
  </BrowserRouter>

  );
}

export default App;
