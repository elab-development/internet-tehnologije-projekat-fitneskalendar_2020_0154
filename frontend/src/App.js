import React from 'react';
import './App.css';
import { BrowserRouter as Router,Route, Routes, BrowserRouter } from 'react-router-dom'; 
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CombinedCalendar from './components/Kal';
import Navbar from './components/Navbar';


function App() {
  return (
    <BrowserRouter>
     {/* <AutoLogout /> */}
    <div className="App">
      <Routes>
        <Route path="/" element={<CombinedCalendar />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/kalendar" element={<CombinedCalendar />} />

      </Routes>
    </div>
  </BrowserRouter>

  );
}

export default App;
