import React, { useState } from 'react';
import axios from 'axios';
import './RegisterPage.css';
import Navbar from './Navbar';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      setErrorMessage('Lozinke se ne podudaraju.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
      console.log('Registration successful', response.data);
      setSuccessMessage('Uspešno ste se registrovali!');
      setErrorMessage('');
      setFormData({
        ime: '',
        prezime: '',
        email: '',
        password: '',
        password_confirmation: ''
      });
    } catch (error) {
      if (error.response && error.response.data && typeof error.response.data === 'object') {
        const { errors } = error.response.data;
        if (errors && typeof errors === 'object') {
          const errorMessage = Object.values(errors).flat().join(' ');
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage('Došlo je do greške prilikom registracije.');
        }
      } else {
        setErrorMessage('Došlo je do greške prilikom registracije.');
      }
      setSuccessMessage('');
      console.error('There was an error registering!', error);
    }
  };

  return (
    <div className="register-page">
      <Navbar role="guest" />
      <div className="register-form">
        <h1>Registracija</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="ime" placeholder="Ime" value={formData.ime} onChange={handleChange} required />
          <input type="text" name="prezime" placeholder="Prezime" value={formData.prezime} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Lozinka" value={formData.password} onChange={handleChange} required />
          <input type="password" name="password_confirmation" placeholder="Potvrdi lozinku" value={formData.password_confirmation} onChange={handleChange} required />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          <button type="submit">Registruj se</button>
        </form>
        <p>Već imate nalog? <a href="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>Ulogujte se</a></p>
      </div>
    </div>
  );
};

export default RegisterPage;
