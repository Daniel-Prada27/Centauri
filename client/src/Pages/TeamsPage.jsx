import "../estilos/Login.css";
import React, { useEffect, useState } from "react";

function TeamsPage() {
  const [user, setUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [teams, setTeams] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

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
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Recibe la lista de equipos a los que pertenece el usuario
    const loadData = async () => {
      try {
          const teamsData = await makeRequest("/team", "GET");
          const teamsList = teamsData || [];
          setTeams(teamsList);
    
          const userData = await makeRequest("/profile", "GET");
          setUser(userData || []);

          if (!userData || teamsList.length === 0) {
            setInvitations([]);
            return;
          }

          // llamar makeRequest en paralelo, machete
          const memberPromises = teamsList.map((t) =>
            makeRequest(`/member/${t.id}`, "GET").then((members) => ({ team: t, members }))
          );

          const membersPerTeam = await Promise.all(memberPromises);

          const pendingTeams = membersPerTeam
            .filter(Boolean)
            .filter(({ team, members }) =>
              Array.isArray(members) &&
              members.some(
                (m) => m.id_user === userData.user_id && m.role === "pending"
              )
            )
            .map(({ team }) => team);

          setInvitations(pendingTeams);

        } catch (err) {
          console.error("Error cargando datos:", err);
        }
    };

  useEffect(() => {
    loadData();
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

// Aceptar invitación
const handleAcceptInvite = async (teamId, userId) => {
  try {
    const res = await makeRequest("/member/invite/accept", "PUT", {
      id_user: userId,
      id_team: teamId,
    });

    if (res) {
      alert("✅ Invitación aceptada correctamente");
      await loadData(); // refrescar lista correctamente
      window.location.href = `/boardpage/${teamId}`;
    }
  } catch (err) {
    console.error(err);
    alert("❌ No se pudo aceptar la invitación");
  }
};

// Rechazar invitación
const handleRejectInvite = async (teamId, userId) => {
  try {
    const res = await makeRequest("/member/invite/reject", "PUT", {
      id_user: userId,
      id_team: teamId,
    });

    if (res) {
      alert("🚫 Invitación rechazada");
      await loadData(); // refrescar lista correctamente
    }
  } catch (err) {
    console.error(err);
    alert("Error al rechazar invitación");
  }
};

  const handleLogout = () => {
    // limpiar sesión o token
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

        {/* 📩 INVITACIONES PENDIENTES */}
        <div className="invitation-list" style={{ marginTop: "2rem" }}>
          <h3>Invitaciones pendientes</h3>

          {invitations.length === 0 ? (
            <p>No tienes invitaciones pendientes.</p>
          ) : (
            <ul>
              {invitations.map((inv) => (
                <li key={inv.id} style={{ marginBottom: "1rem" }}>
                  <strong>{inv.name}</strong>
                  <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn-login"
                      onClick={() => handleAcceptInvite(inv.id, user.user_id)}
                    >
                      ✅ Aceptar
                    </button>
                    <button
                      className="btn-google"
                      onClick={() => handleRejectInvite(inv.id, user.user_id)}
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>


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