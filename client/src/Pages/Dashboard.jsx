import React, { useState } from "react";

export default function Dashboard() {
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

  // -----------------------------
  // Función genérica para requests
  // -----------------------------
  const makeRequest = async (endpoint, method, body) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method,
        credentials: "include", // Incluye cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Request failed");
      }

      const data = await response.json();
      setMessage(data.message || "Operación exitosa");
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
    await makeRequest("/teams", "POST", team);
  };

  // -----------------------------
  // Formulario: Actualizar perfil
  // -----------------------------
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await makeRequest("/profile", "PUT", profile);
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
