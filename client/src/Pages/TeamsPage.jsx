import "../estilos/TeamsPage.css";
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

function TeamsPage() {
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

  const [openInvites, setOpenInvites] = useState(null);
  const [openTeams, setOpenTeams] = useState(null);

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

  // Logout
  const handleLogout = () => {
    signOut(navigate);
  };

  return (
    <div className="teams-container">
      <div className="teams-panel">

        <h2 className="teams-title">Gestor de Equipos</h2>

        {/* ACCIONES PRINCIPALES */}
        <div className="teams-actions">
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            ➕ Crear equipo
          </button>

          <button className="btn-secondary" onClick={() => setShowJoinModal(true)}>
            🔗 Unirse a un equipo
          </button>
        </div>

        {/* INVITACIONES ------------------------ */}
        <div className="accordion">
          <button className="accordion-header" onClick={() => setOpenInvites(!openInvites)}>
            Invitaciones pendientes
          </button>

          {openInvites && (
            <div className="accordion-content">
              {invitations.length === 0 ? (
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

        {/* LISTA DE EQUIPOS --------------------- */}
        <div className="accordion">
          <button className="accordion-header" onClick={() => setOpenTeams(!openTeams)}>
            Mis equipos
          </button>

          {openTeams && (
            <div className="accordion-content">
              {teams.length > 0 ? (
                teams.map(team => (
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

        <button className="btn-danger logout-btn" onClick={handleLogout}>
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
                <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <input type="text" value={teamDescription} onChange={(e) => setTeamDescription(e.target.value)} required />
              </div>

              <button className="btn-primary" type="submit">Crear</button>
              <button className="btn-secondary" type="button" onClick={() => setShowCreateModal(false)}>
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
                <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} required />
              </div>

              <button className="btn-primary" type="submit">Unirse</button>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => setShowJoinModal(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Editar equipo</h3>

            <form onSubmit={handleUpdateTeam}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required />
              </div>

              <button className="btn-primary" type="submit">Guardar cambios</button>
              <button className="btn-secondary" type="button" onClick={() => setShowEditModal(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BORRAR */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>¿Eliminar equipo?</h3>
            <p className="delete-warning">Esta acción no se puede deshacer.</p>

            <button className="btn-danger" onClick={handleDeleteTeam}>
              Confirmar eliminación
            </button>

            <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

    </div>
  );

}

export default TeamsPage;
