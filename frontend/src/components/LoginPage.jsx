import React, { useState } from 'react';
 import axios from 'axios';


 import { useNavigate } from 'react-router-dom';

 import { Link } from 'react-router-dom'; 
 import './LoginPage.css';



const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password }, { withCredentials: true });
      console.log('Login successful', response.data);
      window.localStorage.setItem("authToken",response.data.token);
      const expirationTime = new Date().getTime() + (response.data.expiration * 1000); // Pretvara expiresIn iz sekundi u milisekunde
      window.localStorage.setItem("authTokenExpiration", expirationTime);
      navigate('/kalendar');
    } catch (error) {
      setError('Netačna email adresa ili lozinka');
      console.error('There was an error logging in!', error);
    }
  };

  return (
    <div className='login-page' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ width: '300px', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', backgroundColor: '#f8d7da' }}>
        <h1 style={{ marginBottom: '20px', color: '#dc3545' }}>Prijava</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Lozinka</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          {error && <p style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Prijavi se</button>
        </form>
        <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>Nemate nalog? <Link to="/register" style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}>Registrujte se</Link></p>
      </div>
    </div>
  );
};


export default LoginPage;
