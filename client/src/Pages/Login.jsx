// components/Login.js
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../../server/lib/auth-client.js";
import "../estilos/Login.css";
import logo from '../assets/logo.png';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    //autentificar que el usuario existe
    const fetchUserData = async () => {
        try {
            const res = await fetch("http://localhost:3000/profile", {
                method: "GET",
                credentials: "include", // envía cookie de sesión
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("No se pudo obtener el usuario");
            const user = await res.json();

            console.log("Usuario autenticado:", user);

            // Verificar si pertenece a algún equipo
            await checkUserTeam(user.user_id);

            } catch (err) {
            console.error("Error al obtener usuario:", err);
            alert("Error al validar sesión ❌");
        }
    };

    const checkUserTeam = async () => {
    try {
        const res = await fetch("http://localhost:3000/team", {
        method: "GET",
        credentials: "include", // importante: para enviar cookies o sesión
        });

        if (!res.ok) throw new Error("Error al obtener equipos del usuario");
        console.log("Redirigiendo a teamspage");
        navigate("/teamspage");
    } catch (err) {
        console.error("Error al comprobar equipo:", err);
        alert("No se pudo validar si el usuario tiene equipo ❌");
    }
    };


    // Iniciar sesión con Google (Better Auth)
    const handleGoogleLogin = async () => {
        try {
            const { data, error } = await authClient.signIn.social({
                provider: "google",
            });

            if (error) {
                console.error("Error con Google:", error);
                alert("Error al iniciar sesión con Google ❌");
                return;
            }

            console.log("Inicio de sesión con Google exitoso:", data);
            navigate("/teamspage");
        } catch (err) {
            console.error("Error al iniciar sesión con Google:", err);
            alert("Error con Google ❌");
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
