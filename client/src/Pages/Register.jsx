import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import "../estilos/Login.css";
import { useNavigate } from "react-router-dom";
// import the authClient for Better Auth
import { authClient } from "../../../server/lib/auth-client.js";
import logo from '../assets/logo.png';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Crear cuenta con correo y contraseña
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        // optionally image, callbackURL etc.
      });
      if (error) {
        console.error("Error al registrar:", error);
        alert("Error al crear la cuenta ❌: " + error.message);
      } else {
        alert("Cuenta creada exitosamente ✅");
        navigate("/profile");
      }
    } catch (err) {
      console.error("Error al registrar:", err);
      alert("Error al crear la cuenta ❌");
    }
  };

  // Registrar con Google (social)
  const handleGoogleRegister = async () => {
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        // callbackURL: "/dashboard"  // optional
      });
      if (error) {
        console.error("Error al registrarse con Google:", error);
        alert("Error al registrarse con Google ❌: " + error.message);
      } else {
        alert("Registro con Google exitoso ✅");
        navigate("/profile");
      }
    } catch (err) {
      console.error("Error al registrarse con Google:", err);
      alert("Error al registrarse con Google ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2 className="login-title">Crear una cuenta en Centauri</h2>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Nombre completo</label>
            <input
              type="text"
              id="name"
              placeholder="Tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Crear cuenta
          </button>
        </form>

        <div className="divider">o</div>

        <button className="btn-google" onClick={handleGoogleRegister}>
          <FaGoogle className="google-icon" /> Registrarse con Google
        </button>

        <p className="register-link">
          ¿Ya tienes cuenta?{" "}
          <a href="/Login" className="link">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
