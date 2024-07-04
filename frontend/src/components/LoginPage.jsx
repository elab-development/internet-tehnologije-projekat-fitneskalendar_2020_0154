import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from './Navbar'; 
import './loginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const role = 'guest'; // Postavi ulogu na 'guest' za stranicu za prijavu


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {

      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password }, { withCredentials: true });
      console.log('Login successful', response.data);
      window.localStorage.setItem("authToken",response.data.token);
      const expirationTime = new Date().getTime() + (response.data.expiration * 1000); // Pretvara expiresIn iz sekundi u milisekunde
      window.localStorage.setItem("authTokenExpiration", expirationTime);
      navigate('/kalendar');

      // const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
      // window.sessionStorage.setItem("authToken", response.data.token);
      // navigate('/dogadjaji');

    } catch (error) {
      setError('Netačna email adresa ili lozinka');
      console.error('There was an error logging in!', error);
    }
  };

  return (
    <div className="login-page">
      <Navbar role={role} /> {/* Uključi Navbar */}
      <div className="login-container">
        <h1>Prijava</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Lozinka</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Prijavi se</button>
        </form>
        <p>Nemate nalog? <Link to="/register" className="register-link">Registrujte se</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
