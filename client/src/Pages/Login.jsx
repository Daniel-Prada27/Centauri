// components/Login.js
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../../server/lib/auth-client.js";
import "../estilos/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

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
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            },
                {
                    onSuccess: (ctx) => {
                        console.log("Inicio de sesión exitoso:", ctx);
                        navigate("/teamspage");
                    },
                    onError: (ctx) => {
                        console.error("Error al iniciar sesión:", ctx.error);
                        alert("Correo o contraseña incorrectos ❌");
                        return;
                    },
                });

            // if (error) {
            //     console.error("Error al iniciar sesión:", error);
            //     alert("Correo o contraseña incorrectos ❌");
            //     return;
            // }

            // console.log("Inicio de sesión exitoso:", data);
            // navigate("/dashboard");
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            alert("Error al iniciar sesión ❌");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Inicia sesión para continuar</h2>
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
