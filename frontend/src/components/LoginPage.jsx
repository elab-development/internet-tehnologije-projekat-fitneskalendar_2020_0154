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
  let timeoutId = null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password }, { withCredentials: true });
      console.log('Login successful', response.data);
      window.localStorage.setItem("authToken",response.data.token);
      console.log(response.data.istice); // Broj minuta nakon kojih ističe token, stavila sam 60 min

      // vreme isteka tokena u milisekundama
      const expirationTime = response.data.istice * 60 * 1000; 
      
      //  vreme za obaveštenje da je token istekao (30 sekundi pre isteka tokena)
      const alertTime = expirationTime - 30000; 
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        alert('Vaša sesija je istekla. Volim Vas prijavite se ponovo.');
        handleLogout();
    }, alertTime);
      
      console.log('Token expiration time:', new Date(Date.now() + expirationTime).toLocaleString());
      navigate('/kalendar');

    } catch (error) {
      setError('Netačna email adresa ili lozinka');
      console.error('There was an error logging in!', error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login'); 
};


  return (
    <div className='login-page'>
    <div className='login-form'>
      <h1>Prijava</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label>Lozinka</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='form-control'
          />
        </div>
        {error && <p className='error-message'>{error}</p>}
        <button type="submit" className='submit-button'>Prijavi se</button>
      </form>
      <p className='register-link'>Nemate nalog? <Link to="/register">Registrujte se</Link></p>
    </div>
  </div>
  );
};


export default LoginPage;
