
import React, { useState } from 'react';
 import axios from 'axios';
 import './LoginPage.css';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password }, { withCredentials: true });
      console.log('Login successful', response.data);
      window.sessionStorage.setItem("authToken",response.data.token);
    } catch (error) {
      setError('Invalid email or password');
      console.error('There was an error logging in!', error);
    }
  };

  return (
    <div className='login-page' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ width: '300px', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', backgroundColor: '#f8d7da' }}>
        <h1 style={{ marginBottom: '20px', color: '#dc3545' }}>Login</h1>
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
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          {error && <p style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
        </form>
        <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>Nemate nalog? <span style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }} >Registrujte se</span></p>
      </div>
    </div>
  );
};


export default LoginPage;
