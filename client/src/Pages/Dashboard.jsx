import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../../server/lib/auth-client.js";

export default function Dashboard() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const [team, setTeam] = useState({
        name: "",
        description: "",
    });

    const [profile, setProfile] = useState({
        occupation: "",
        location: "",
        picture: "",
    });

    const [teams, setTeams] = useState([]);

    // Para manejar el equipo en edición
    const [editingTeam, setEditingTeam] = useState(null);

    // -----------------------------
    // Función genérica para requests
    // -----------------------------
    const makeRequest = async (endpoint, method, body, customHeaders = {}) => {
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...customHeaders,
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Request failed");
            }

            const data = await response.json();
            setMessage(data.message || "Operación exitosa");
            console.log(data);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // Formulario: Crear equipo
    // -----------------------------
    const handleCreateTeam = async (e) => {
        e.preventDefault();
        await makeRequest("/team", "POST", team);
    };

    // -----------------------------
    // Formulario: Actualizar perfil
    // -----------------------------
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        await makeRequest("/profile", "PUT", profile);
    };

    // -----------------------------
    // Cierre de sesión con Better Auth
    // -----------------------------
    const handleSignOut = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        navigate("/login");
                    },
                    onError: (ctx) => {
                        console.log(ctx.error);
                        navigate("/login");
                    },
                },
            });
        } catch (err) {
            console.error("Error during sign out:", err);
            setError("Error al cerrar sesión");
        }
    };

    const handleGetTeams = async (e) => {
        e.preventDefault();
        const data = await makeRequest("/team", "GET");
        setTeams(data || []);
    };

    const handleDeleteTeam = async (teamId) => {
        const confirmDelete = window.confirm("¿Seguro que deseas eliminar este equipo?");
        if (!confirmDelete) return;

        await makeRequest(`/team/${editingTeam.id}`, "DELETE");
        setTeams(teams.filter((t) => t.id !== teamId));
    };

    // -----------------------------
    // Mostrar formulario de actualización
    // -----------------------------
    const handleEditTeam = (team) => {
        setEditingTeam(team); // Muestra el formulario con datos del equipo
    };

    // -----------------------------
    // Enviar actualización de equipo
    // -----------------------------
    const handleUpdateTeam = async (e) => {
        e.preventDefault();
        await makeRequest(`/team/${editingTeam.id}`, "PUT", editingTeam);

        // Actualizar lista local
        setTeams(
            teams.map((t) => (t.id === editingTeam.id ? editingTeam : t))
        );

        setEditingTeam(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-10">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
                    Dashboard
                </h1>

                {/* FORMULARIO: CREAR EQUIPO */}
                <form
                    onSubmit={handleCreateTeam}
                    className="bg-white p-6 rounded-lg shadow border border-slate-200 space-y-4"
                >
                    <h2 className="text-xl font-semibold text-slate-700">
                        Crear Equipo
                    </h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre del equipo"
                        value={team.name}
                        onChange={(e) => setTeam({ ...team, name: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                    />

                    <textarea
                        name="description"
                        placeholder="Descripción"
                        value={team.description}
                        onChange={(e) => setTeam({ ...team, description: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors"
                    >
                        Crear equipo
                    </button>
                </form>

                {/* BOTÓN: OBTENER EQUIPOS */}
                <div className="text-center pt-6">
                    <button
                        onClick={handleGetTeams}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                    >
                        Get teams
                    </button>
                </div>

                {/* FORMULARIO: ACTUALIZAR PERFIL */}
                <form
                    onSubmit={handleUpdateProfile}
                    className="bg-white p-6 rounded-lg shadow border border-slate-200 space-y-4"
                >
                    <h2 className="text-xl font-semibold text-slate-700">
                        Actualizar Perfil
                    </h2>

                    <input
                        type="text"
                        name="occupation"
                        placeholder="Ocupación"
                        value={profile.occupation}
                        onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Ubicación"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                    />

                    <input
                        type="text"
                        name="picture"
                        placeholder="URL de la imagen de perfil"
                        value={profile.picture}
                        onChange={(e) => setProfile({ ...profile, picture: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-colors"
                    >
                        Actualizar perfil
                    </button>
                </form>

                {/* BOTÓN: SIGN OUT */}
                <div className="text-center pt-6">
                    <button
                        onClick={handleSignOut}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                {/* LISTA DE EQUIPOS */}
                <div className="bg-white p-6 rounded-lg shadow border border-slate-200 space-y-4">
                    <h2 className="text-xl font-semibold text-slate-700">Equipos</h2>
                    {teams.length === 0 ? (
                        <p>No hay equipos registrados.</p>
                    ) : (
                        <ul>
                            {teams.map((team) => (
                                <li
                                    key={team.id}
                                    className="flex justify-between items-center border-b py-2"
                                >
                                    <div>
                                        <h3 className="font-semibold text-slate-800">
                                            {team.name}
                                        </h3>
                                        <p className="text-slate-600">
                                            {team.description}
                                        </p>
                                    </div>
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => handleEditTeam(team)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded-lg"
                                        >
                                            Actualizar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTeam(team.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-lg"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* FORMULARIO DE EDICIÓN DE EQUIPO */}
                {editingTeam && (
                    <form
                        onSubmit={handleUpdateTeam}
                        className="bg-white p-6 rounded-lg shadow border border-slate-200 space-y-4"
                    >
                        <h2 className="text-xl font-semibold text-slate-700">
                            Editar Equipo
                        </h2>
                        <input
                            type="text"
                            placeholder="Nombre del equipo"
                            value={editingTeam.name}
                            onChange={(e) =>
                                setEditingTeam({ ...editingTeam, name: e.target.value })
                            }
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                        />

                        <textarea
                            placeholder="Descripción"
                            value={editingTeam.description}
                            onChange={(e) =>
                                setEditingTeam({ ...editingTeam, description: e.target.value })
                            }
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                        />

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => setEditingTeam(null)}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                )}

                {/* ESTADOS */}
                {loading && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-slate-600">Procesando...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg p-4">
                        <p>Error: {error}</p>
                    </div>
                )}

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 rounded-lg p-4">
                        <p>{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
