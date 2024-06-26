import React from 'react';
import './App.css';
import { BrowserRouter as Router,Route, Routes, BrowserRouter } from 'react-router-dom'; 
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CalendarComponent from './components/Kalendar';
import AdminCal from './components/KalendarAdmin';
function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<CalendarComponent />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dogadjaji" element={<AdminCal />} />

        <Route path="/register" element={<RegisterPage />} />


        <Route path="/register" element={<RegisterPage />} />

      </Routes>
    </div>
  </BrowserRouter>

  );
}

export default App;
