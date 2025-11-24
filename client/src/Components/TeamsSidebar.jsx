import "../estilos/TeamsSidebar.css";
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
} from "../utils/api";

export default function TeamsSidebar() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);

  const [invitations, setInvitations] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [openInvites, setOpenInvites] = useState(null);
  const [openTeams, setOpenTeams] = useState(null);

  const navigate = useNavigate();

  // Cargar datos
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

      const membersPerTeam = await Promise.all(
        teamsList.map(t =>
          getTeamMembers(t.id).then(members => ({ team: t, members }))
        )
      );

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
    } catch {
      alert("Error al crear equipo");
    }
  };

  // Aceptar invitación
  const handleAcceptInvite = async (teamId) => {
    await acceptInvite(teamId, user.user_id);
    await loadData();
    navigate(`/boardpage/${teamId}`);
  };

  // Rechazar invitación
  const handleRejectInvite = async (teamId) => {
    await rejectInvite(teamId, user.user_id);
    await loadData();
  };

  // Editar equipo
  const handleUpdateTeam = async (e) => {
    e.preventDefault();

    try {
      await updateTeam(selectedTeam.id, {
        name: editName,
        description: editDescription,
      });

      setShowEditModal(false);
      loadData();
      alert("Equipo actualizado");
    } catch {
      alert("Error actualizando equipo");
    }
  };

  // Borrar equipo
  const handleDeleteTeam = async (e) => {
    e.preventDefault();

    try {
      await deleteTeam(selectedTeam.id);
      setShowDeleteModal(false);
      loadData();
      alert("Equipo eliminado");
    } catch {
      alert("Error eliminando equipo");
    }
  };

  return (
    <div className="teams-panel">

      <h2 className="teams-title">Gestor de Equipos</h2>

      {/* ACCIONES PRINCIPALES */}
      <div className="teams-actions">
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          ➕ Crear equipo
        </button>
      </div>

      {/* INVITACIONES PENDIENTES */}
      <div className="accordion">
        <button className="accordion-header" onClick={() => setOpenInvites(!openInvites)}>
          Invitaciones pendientes
        </button>

        {openInvites && (
          <div className="accordion-content">
            {invitations === null ? (
              <p className="empty-text">No tienes invitaciones pendientes.</p>
            ) : (
              invitations.map(inv => (
                <div key={inv.id} className="invite-item">
                  <strong>{inv.name}</strong>

                  <div className="invite-actions">
                    <button className="btn-primary" onClick={() => handleAcceptInvite(inv.id)}>
                      Aceptar
                    </button>
                    <button className="btn-danger" onClick={() => handleRejectInvite(inv.id)}>
                      Rechazar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* LISTA DE EQUIPOS */}
      <div className="accordion">
        <button className="accordion-header" onClick={() => setOpenTeams(!openTeams)}>
          Mis equipos
        </button>

        {openTeams && (
          <div className="accordion-content teams-scroll-area">
          {invitations === null ? (
            <p className="empty-text">Cargando equipos...</p>   // ← EVITA EL PARPADEO
            ) : teams.length > 0 ? (
              teams.filter(team => !invitations.some(inv => inv.id === team.id)).map(team => (
                <div key={team.id} className="team-row">

                  <button
                    className="btn-primary team-button"
                    onClick={() => navigate(`/boardpage/${team.id}`)}
                  >
                    {team.name}
                  </button>

                  <button
                    className="btn-warning icon-btn"
                    onClick={() => {
                      setSelectedTeam(team);
                      setEditName(team.name);
                      setEditDescription(team.description);
                      setShowEditModal(true);
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    className="btn-danger icon-btn"
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
              <p className="empty-text">No perteneces a ningún equipo</p>
            )}
          </div>
        )}
      </div>

      {/* MODALES */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Crear nuevo equipo</h3>

            <form onSubmit={handleCreateTeam}>
              <label>Nombre del equipo</label>
              <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />

              <label>Descripción</label>
              <input type="text" value={teamDescription} onChange={(e) => setTeamDescription(e.target.value)} required />

              <button className="btn-primary" type="submit">Crear</button>
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Editar equipo</h3>

            <form onSubmit={handleUpdateTeam}>
              <label>Nombre</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />

              <label>Descripción</label>
              <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required />

              <button className="btn-primary" type="submit">Guardar cambios</button>
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>¿Eliminar equipo?</h3>
            <p>Esta acción no se puede deshacer.</p>

            <button className="btn-danger" onClick={handleDeleteTeam}>Confirmar</button>
            <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

    </div>
  );
}
