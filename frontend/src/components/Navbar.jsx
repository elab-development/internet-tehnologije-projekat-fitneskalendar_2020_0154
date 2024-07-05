import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import axios from 'axios';
const Navbar = ({ role,handleRoleChange }) => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };
  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      localStorage.removeItem('authToken');
      localStorage.removeItem('expiration');
      handleRoleChange('guest');
      navigate('/kalendar');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleLogoutAndChangeRole = () => {
    handleLogout(); 
    handleRoleChange(); 
    navigate('/kalendar');
  };
  return (
    <div className="navbar">
      <div className="left-links">
        <Link to="/" onClick={handleNavigateHome}>Kalendar</Link>
        <Link to="/weather">Vremenska Prognoza</Link>
      </div>
      <div className="right-links">
        {role === 'guest' && (
          <>
            <Link to="/register" className="auth-link">Registruj se</Link>
            <Link to="/login" className="auth-link">Prijavi se</Link>
          </>
        )}
        {role === 'admin' && (
          <>
            <Link to="/korisnici">Korisnici</Link>
            <Link to="/" onClick={handleLogoutAndChangeRole}>Odjavi se</Link>
          </>
        )}
        {role === 'ulogovan' && (
          
          <Link to="/" onClick={handleLogoutAndChangeRole}>Odjavi se</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
