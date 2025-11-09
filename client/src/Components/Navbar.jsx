import React from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/Navbar.css";
import logo from "../assets/react.svg";

function Navbar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // redirige a la ruta /login
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="/react.svg"
          alt="Logo"
          className="navbar-logo"
        />
        <span className="navbar-title"> CENTAURI</span>
      </div>

      <div className="navbar-right">
        <button className="login-button" onClick={handleLoginClick}>
          Iniciar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
