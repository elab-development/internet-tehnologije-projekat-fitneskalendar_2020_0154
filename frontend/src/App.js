import React from 'react';
import './App.css';
import { BrowserRouter as Router,Route, Routes, BrowserRouter } from 'react-router-dom'; 
import LoginPage from './components/LoginPage';
import CalendarComponent from './components/Kalendar';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<CalendarComponent />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  </BrowserRouter>

  );
}

export default App;
