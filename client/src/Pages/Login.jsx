// components/Login.js
import React, { useState } from "react";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../estilos/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (error) {
      alert("Error con Google ❌");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert("Correo o contraseña incorrectos ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Inicia sesión para continuar</h2>
        <form onSubmit={handleEmailLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo </label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
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
            Iniciar sesión
          </button>
        </form>

        <div className="divider">o</div>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <FaGoogle className="google-icon" /> Continuar con Google
        </button>

        <p className="register-link">
            ¿No tienes cuenta?{" "}
            <span 
                onClick={() => navigate("/Register")} 
                className="link"
                style={{ cursor: "pointer" }}
            >
                Crear una cuenta
            </span>
        </p>
      </div>
    </div>
  );
}

export default Login;