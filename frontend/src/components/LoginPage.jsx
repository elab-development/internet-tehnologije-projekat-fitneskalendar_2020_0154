import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ handleRoleChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  let timeoutId = null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {

      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password }, { withCredentials: true });
      console.log('Login successful', response.data);
      window.localStorage.setItem("authToken",response.data.token);
    
     const expirationTime = response.data.istice * 60 * 1000; //broj minuta koliko traje token
      const tokenIsticeU=new Date(Date.now() + expirationTime).toLocaleString() //u kom tacno trenutku istice token
      window.localStorage.setItem("expiration",tokenIsticeU);
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        alert('Vaša sesija je istekla. Molimo prijavite se ponovo.');
        handleLogout();
    }, expirationTime);//za koliko minuta treba da javi 
    navigate('/kalendar');
    //treba nam uloga zbog prikaza Navbara
    handleRoleChange(response.data.uloga);
    return () => clearTimeout(timeoutId);
     

    } catch (error) {
      setError('Netačna email adresa ili lozinka');
      console.error('There was an error logging in!', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('expiration');
    handleRoleChange('guest');
    navigate('/login'); 
};


  return (
    <div className="login-page">
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
