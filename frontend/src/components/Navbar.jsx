import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ role, handleLogout }) => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="left-links">
        <Link to="/" onClick={handleNavigateHome}>Kalendar</Link>
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
            <Link to="/" onClick={handleLogout}>Odjavi se</Link>
          </>
        )}
        {role === 'user' && (
          <Link to="/" onClick={handleLogout}>Odjavi se</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
