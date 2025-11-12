import "../estilos/Login.css";
import React, { useEffect, useState } from "react";

function TeamsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [teams, setTeams] = useState([]);

  // Recibe la lista de equipos a los que pertenece el usuario
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("http://localhost:3000/team", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener equipos");
        const data = await res.json();
        setTeams(data);
      } catch (error) {
        console.error("❌", error);
      }
    };
    fetchTeams();
  }, []);

  // Crear equipo (envía al backend)
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/team", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName, description: teamDescription }),
      });

      const createdTeam = await res.json();
      if (!res.ok) throw new Error("Error al crear el equipo");
      alert("✅ Equipo creado correctamente");
      window.location.href = `/boardpage/${createdTeam.id}`; 
      setShowCreateModal(false);
      setTeamName("");
      setTeamDescription("");
    } catch (error) {
      alert("❌ " + error.message);
    }
  };

  // Unirse a equipo (envía ID al backend)
  const handleJoinTeam = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: joinCode }),
      });

      if (!res.ok) throw new Error("No se pudo unir al equipo");
      alert("✅ Te uniste al equipo correctamente");

      window.location.href = `/boardpage/${teamId.id}`; 
      setShowJoinModal(false);
      setJoinCode("");
    } catch (error) {
      alert("❌ " + error.message);
    }
  };

  const handleLogout = () => {
    // Aquí podrías limpiar sesión o token
    alert("👋 Sesión cerrada");
    window.location.href = "/login";
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Gestor de Equipos</h2>

        <button className="btn-login" onClick={() => setShowCreateModal(true)}>
          ➕ Crear equipo
        </button>

        <button className="btn-google" onClick={() => setShowJoinModal(true)}>
          🔗 Unirse a un equipo
        </button>

        <div className="divider">
          <span></span>
        </div>

        {/* 🧾 Lista de equipos del usuario */}
        <h3 style={{ marginTop: "15px", color: "#333" }}>Mis equipos</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {teams.length > 0 ? (
            teams.map((team) => (
              <li key={team.id} style={{ margin: "8px 0" }}>
                <button
                  className="btn-login"
                  style={{ width: "100%", backgroundColor: "#5e72e4" }}
                  onClick={() => (window.location.href = `/boardpage/${team.id}`)}
                >
                  {team.name}
                </button>
              </li>
            ))
          ) : (
            <p style={{ color: "#777" }}>No perteneces a ningún equipo todavía</p>
          )}
        </ul>

        <button
          className="btn-login"
          style={{ backgroundColor: "#ff4d4d" }}
          onClick={handleLogout}
        >
          🚪 Cerrar sesión
        </button>
      </div>

      {/* MODAL CREAR EQUIPO */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Crear nuevo equipo</h3>
            <form onSubmit={handleCreateTeam}>
              <div className="form-group">
                <label>Nombre del equipo</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input
                  type="text"
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  required
                />
              </div>
              <button className="btn-login" type="submit">
                Crear
              </button>
              <button
                type="button"
                className="btn-google"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL UNIRSE A EQUIPO */}
      {showJoinModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Unirse a un equipo</h3>
            <form onSubmit={handleJoinTeam}>
              <div className="form-group">
                <label>ID del equipo</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                />
              </div>
              <button className="btn-login" type="submit">
                Unirse
              </button>
              <button
                type="button"
                className="btn-google"
                onClick={() => setShowJoinModal(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamsPage;