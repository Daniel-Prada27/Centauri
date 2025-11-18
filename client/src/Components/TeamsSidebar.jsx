import "../estilos/Login.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getTeams,
  getProfile,
  getTeamMembers,
  updateTeam,
  deleteTeam,
  createTeam,
  acceptInvite,
  rejectInvite,
  makeRequest,
  signOut
} from "../utils/api"

export default function TeamsSidebar() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);

  const [invitations, setInvitations] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setjoinCode] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const navigate = useNavigate();

  // Cargar los datos principales
  const loadData = async () => {
    try {
      const teamsList = await getTeams();
      setTeams(teamsList);

      const userData = await getProfile();
      setUser(userData);

      if (!teamsList.length) {
        setInvitations([]);
        return;
      }

      // Obtener miembros de todos los equipos en paralelo
      const membersPerTeam = await Promise.all(
        teamsList.map(t =>
          getTeamMembers(t.id).then(members => ({ team: t, members }))
        )
      );

      // Filtrar invitaciones pendientes
      const pending = membersPerTeam
        .filter(({ members }) =>
          members.some(
            m => m.id_user === userData.user_id && m.role === "pending"
          )
        )
        .map(({ team }) => team);

      setInvitations(pending);
    } catch (err) {
      console.error("Error cargando equipos:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Crear equipo
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const newTeam = await createTeam({
        name: teamName,
        description: teamDescription,
      });

      alert("Equipo creado");
      navigate(`/boardpage/${newTeam.id}`);
    } catch (err) {
      alert("Error al crear equipo");
    }
  };

  // Unirse a equipo, falta por arreglar
  const handleJoinTeam = async (e) => {
    e.preventDefault();
    try {
      const res = await makeRequest("/member/invite/join", "POST", {
        id_team: joinCode,
      });

      alert("Solicitud enviada");
      setShowJoinModal(false);
    } catch (err) {
      alert("Error al unirse al equipo");
    }
  };

  // Aceptar / Rechazar
  const handleAcceptInvite = async (teamId) => {
    await acceptInvite(teamId, user.user_id);
    await loadData();
    navigate(`/boardpage/${teamId}`);
  };

  const handleRejectInvite = async (teamId) => {
    await rejectInvite(teamId, user.user_id);
    await loadData();
  };

  // Abrir el modal de editar
  const handleOpenEdit = (team) => {
    setSelectedTeam(team);
    setEditName(team.name);
    setEditDescription(team.description);
    setShowEditModal(true);
  };

  // Abrir el modal de eliminar
  const handleOpenDelete = (team) => {
    setSelectedTeam(team);
    setShowDeleteModal(true);
  };

  // Update team
  const handleUpdateTeam = async (e) => {
    e.preventDefault();

    const data = {
      name: editName,
      description: editDescription,
    };

    try {
      await updateTeam(selectedTeam.id, data);
      setShowEditModal(false);
      await loadData();
      alert("Equipo actualizado correctamente");
    } catch (err) {
      alert("Error actualizando el equipo");
    }
  };

  // Delete team
  const handleDeleteTeam = async (e) => {
    e.preventDefault();

    try {
      await deleteTeam(selectedTeam.id);
      setShowDeleteModal(false);
      await loadData();
      alert("Equipo eliminado correctamente");
    } catch (err) {
      alert("Error eliminando equipo");
    }
  };

  return (
      <div className="login-card">
        <h2 className="login-title">Gestor de Equipos</h2>

        <button className="btn-login" onClick={() => setShowCreateModal(true)}>
          ➕ Crear equipo
        </button>

        <button className="btn-google" onClick={() => setShowJoinModal(true)}>
          🔗 Unirse a un equipo
        </button>

        {/* LISTA DE EQUIPOS */}
        <h3 style={{ marginTop: "1.5rem" }}>Mis equipos</h3>

        {teams.length > 0 ? (
          teams.map(team => (
            <div
              key={team.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                marginTop: "0.5rem",
              }}
            >
              <button
                className="btn-login"
                style={{ flex: 1, backgroundColor: "#5e72e4" }}
                onClick={() => navigate(`/boardpage/${team.id}`)}
              >
                {team.name}
              </button>

              {/* BOTÓN EDITAR */}
              <button
                className="btn-login"
                style={{ backgroundColor: "#f5a623" }}
                onClick={() => {
                  setSelectedTeam(team);
                  setEditName(team.name);
                  setEditDescription(team.description);
                  setShowEditModal(true);
                }}
              >
                ✏️
              </button>

              {/* BOTÓN ELIMINAR */}
              <button
                className="btn-google"
                style={{ backgroundColor: "#ff4d4d" }}
                onClick={() => {
                  setSelectedTeam(team);
                  setShowDeleteModal(true);
                }}
              >
                🗑️
              </button>
            </div>
          ))
        ) : (
          <p>No perteneces a ningún equipo</p>
        )}

        {/* INVITACIONES */}
        <h3 style={{ marginTop: "2rem" }}>Invitaciones pendientes</h3>
        {invitations.length === 0 ? (
          <p>No tienes invitaciones pendientes.</p>
        ) : (
          invitations.map(inv => (
            <div key={inv.id} style={{ margin: "1rem 0" }}>
              <strong>{inv.name}</strong>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button className="btn-login" onClick={() => handleAcceptInvite(inv.id)}>
                  Aceptar
                </button>
                <button className="btn-google" onClick={() => handleRejectInvite(inv.id)}>
                  Rechazar
                </button>
              </div>
            </div>
          ))
        )}
        

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

        {/* MODAL UNIRSE */}
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

                <button className="btn-login" type="submit">Unirse</button>
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

        {/* MODAL EDITAR EQUIPO */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Editar equipo</h3>
              <form onSubmit={handleUpdateTeam}>
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    required
                  />
                </div>

                <button className="btn-login" type="submit">Guardar cambios</button>
                <button
                  type="button"
                  className="btn-google"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL BORRAR EQUIPO */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>¿Eliminar equipo?</h3>
              <p style={{ marginBottom: "1rem" }}>
                Esta acción no se puede deshacer.
              </p>

              <button
                className="btn-google"
                style={{ backgroundColor: "#ff4d4d" }}
                onClick={handleDeleteTeam}
              >
                Confirmar eliminación
              </button>

              <button
                className="btn-login"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        </div>


  );
}
