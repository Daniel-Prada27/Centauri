import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";
import { FaGoogle } from "react-icons/fa";
import "../estilos/Login.css"; // Reutilizamos el mismo estilo

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Crear cuenta con correo y contraseña
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      alert("Cuenta creada exitosamente ✅");
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al crear la cuenta ❌");
    }
  };

  // Registrar con Google
  const handleGoogleRegister = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Registro con Google exitoso ✅");
    } catch (error) {
      console.error("Error al registrarse con Google:", error);
      alert("Error al registrarse con Google ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
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
          <a href="/login" className="link">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
