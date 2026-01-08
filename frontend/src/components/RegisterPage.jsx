import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";
import api from "../ApiService";

const RegisterPage = ({ handleRoleChange }) => {
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setshowConfirmPass] = useState(false);
  const navigate = useNavigate();
  let timeoutId = null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // promena vidljivosti lozinke
  };
  const toggleConfPasswordVisibility = () => {
    setshowConfirmPass(!showConfirmPass); // promena vidljivosti lozinke
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setErrorMessage("Lozinka mora imati najmanje 8 znakova.");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setErrorMessage("Lozinke se ne podudaraju.");
      return;
    }

    try {
      // const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
      const response = await api.registracija(formData);
      console.log("Registration successful", response.data);
      setSuccessMessage("Uspešno ste se registrovali!");
      window.localStorage.setItem("authToken", response.data.token);
      const expirationTime = response.data.istice * 60 * 1000; //broj minuta koliko traje token
      const tokenIsticeU = new Date(
        Date.now() + expirationTime
      ).toLocaleString(); //u kom tacno trenutku istice token
      window.localStorage.setItem("expiration", tokenIsticeU);
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        alert("Vaša sesija je istekla. Volim Vas prijavite se ponovo.");
        handleLogout();
      }, expirationTime);
      
      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // promena vidljivosti lozinke
      };
    
      navigate("/kalendar");
      handleRoleChange(response.data.uloga);
      setErrorMessage("");
      setFormData({
        ime: "",
        prezime: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("Email već postoji. Molimo unesite drugi email.");
      } else if (
        error.response &&
        error.response.data &&
        typeof error.response.data === "object"
      ) {
        const { errors } = error.response.data;
        if (errors && typeof errors === "object") {
          const errorMessage = Object.values(errors).flat().join(" ");
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage("Došlo je do greške prilikom registracije.");
        }
      } else {
        setErrorMessage("Došlo je do greške prilikom registracije.");
      }
      setSuccessMessage("");
      console.error("There was an error registering!", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("expiration");
    handleRoleChange("guest");
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <h1>Registracija</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="ime"
            placeholder="Ime"
            value={formData.ime}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="prezime"
            placeholder="Prezime"
            value={formData.prezime}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
           <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'} 
              name="password"
              placeholder="Lozinka"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <div className="password-container">
            <input
              type={showConfirmPass ? 'text' : 'password'}
              name="password_confirmation"
              placeholder="Potvrdi lozinku"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
            <span className="password-toggle-icon" onClick={toggleConfPasswordVisibility}>
              <FontAwesomeIcon icon={showConfirmPass ? faEyeSlash : faEye} />
            </span>
            </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          <button type="submit">Registruj se</button>
        </form>
        <p>
          Već imate nalog?{" "}
          <a
            href="/login"
            style={{ color: "#007bff", textDecoration: "underline" }}
          >
            Ulogujte se
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
