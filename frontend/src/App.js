
import './App.css';
import React from 'react';
import { BrowserRouter as Router,Route, Routes, BrowserRouter } from 'react-router-dom'; 
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CombinedCalendar from './components/Kal';


function App() {
  

  return (
    <BrowserRouter>
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
