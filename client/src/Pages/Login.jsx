// components/Login.js
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../../server/lib/auth-client.js";
import "../estilos/Login.css";
import logo from '../assets/logo.png';

import {
  getProfile,
} from "../utils/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    //autentificar que el usuario existe
    const fetchUserData = async () => {
        try {
            const user = await getProfile();
            console.log("Usuario autenticado:", user);

            if (!user || !user.user_id) {
                console.log("Usuario sin perfil → redirigiendo a ProfilePage");
                navigate("/profile");
                return; // detener ejecución
            }

            // Pasar a teamspage a unirse o crear un equipo
            navigate("/teamspage");

        } catch (err) {
            console.error("Error al obtener usuario:", err);
            alert("Error al obtener usuario ❌");
        }
    };

    // Iniciar sesión con Google (Better Auth)
    const handleGoogleLogin = async () => {
        try {
            const { data, error } = await authClient.signIn.social(
                {
                    provider: "google",
                    callbackURL: "http://localhost:5173/teamspage"
                },
                {
                    onRequest: () => {
                        // Show loading spinner
                    },
                    onSuccess: async (ctx) => {
                        // ctx.data contains redirect URL
                        // ctx.response contains session info
                        // Redirect happens automatically unless you disable it
                        console.log("Inicio de sesión exitoso:", ctx);
                        console.log(ctx.data);
                        let profile = {
                            "occupation": "",
                        }
                        // await makeRequest("/profile", "POST", profile)
                        // await fetchUserData()
                        // navigate("/dashboard");
                        // navigate("https:localhost:5173/teamspage");
                    },
                    onError: (ctx) => {
                        alert(ctx.error.message);
                    },
                }
            );
        } catch (err) {
            console.error("Error al iniciar sesión con Google:", err);
            alert("Error con Google ❌", err);
        }
    };

    // Iniciar sesión con correo y contraseña (Better Auth)

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            await authClient.signIn.email(
                { email, password },
                {
                    onSuccess: async (ctx) => {
                        console.log("Inicio de sesión exitoso:", ctx);
                        await fetchUserData();
                    },
                    onError: (ctx) => {
                        console.error("Error al iniciar sesión:", ctx.error);
                        alert("Correo o contraseña incorrectos ❌");
                    },
                }
            );
        } catch (err) {
            console.error("Error general al iniciar sesión:", err);
            alert("Error al iniciar sesión ❌");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <img src={logo} alt="Logo" className="login-logo" />
                <h2 className="login-title">Iniciar sesión </h2>
                <form onSubmit={handleEmailLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Correo</label>
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
