import React, { useEffect, useState } from "react";
import "../estilos/BoardPage.css";
import TeamsSidebar from "../Components/TeamsSidebar";
import MembersManagerModal from "../Components/MembersManagerModal";
import NotificationsPanel from "../Components/NotificationsPanel"; // 👈 nuevo import
import { useParams, useNavigate } from "react-router-dom";

import {
  signOut,
  getProfile,
  getUserProfile,
  getUserProfilebyEmail,
  getTeamMembers,
  getTeams,
  getTeamTasks,
  createTask,
  updateTask,
  deleteTask,
  inviteUser,
} from "../utils/api";

function BoardPage() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [profilesCache, setProfilesCache] = useState({});

  const [inviteUserId, setInviteUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de modales
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showTeamsManager, setShowTeamsManager] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // 👈 nuevo estado

  // Estados del formulario de tarea
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("business");
  const [taskResponsible, setTaskResponsible] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [openTask, setOpenTask] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const statuses = [
    { key: "pending", label: "Pendiente" },
    { key: "in_progress", label: "En progreso" },
    { key: "completed", label: "Completado" },
  ];

  // ===========================
  //   Cargar datos del tablero
  // ===========================
  const loadBoardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await getProfile();
      setUser({
        id: userData.user_id,
        name: userData.user?.name,
        email: userData.user?.email,
        picture: userData.picture,
        occupation: userData.occupation,
        location: userData.location,
      });

      const teams = await getTeams();
      const currentTeam = teams.find((t) => t.id === id);

      if (!currentTeam) {
        alert("No perteneces a este equipo o no existe ⚠️");
        return navigate("/teamspage");
      }

      setTeam(currentTeam);

      const rawMembers = await getTeamMembers(currentTeam.id);

      const cache = { ...profilesCache };
      const membersWithProfiles = await Promise.all(
        rawMembers.map(async (m) => {
          const uid = m.id_user;
          if (!cache[uid]) {
            try {
              const profile = await getUserProfile(uid);
              cache[uid] = profile;
            } catch (err) {
              console.warn("No se pudo cargar perfil para", uid, err);
              cache[uid] = {
                user_id: uid,
                user: { name: "Usuario desconocido", email: "" },
                picture: null,
              };
            }
          }

          const profile = cache[uid];
          return {
            ...m,
            name: profile?.user?.name || "Usuario desconocido",
            email: profile?.user?.email || "",
            picture: profile?.picture || null,
          };
        })
      );

      setProfilesCache(cache);
      setMembers(membersWithProfiles);

      const taskList = await getTeamTasks(currentTeam.id);
      setTasks(taskList);
    } catch (err) {
      console.error("Error en BoardPage:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoardData();
  }, [id]);

  // ===========================
  //   Invitar usuario
  // ===========================
  const handleInviteUser = async (e) => {
    e.preventDefault();

    const input = inviteUserId.trim();
    if (!input) return alert("Ingresa un correo o un ID");

    let finalUserId = input;

    try {
      if (input.includes("@")) {
        const profile = await getUserProfilebyEmail(input);

        if (!profile || !profile.id)
          return alert("No existe un usuario con ese correo");

        finalUserId = profile.id;
      }
      await inviteUser(team.id, finalUserId);
      alert("Invitación enviada correctamente");
      setInviteUserId("");
    } catch (err) {
      console.error(err);
      alert("Error al enviar invitación");
    }
  };

  // ===========================
  //   Crear tarea
  // ===========================
  const handleAddTask = async (e) => {
    if (e) e.preventDefault();

    if (!taskName.trim() || !taskResponsible.trim() || !taskDueDate) {
      alert("Debes completar todos los campos.");
      return;
    }

    try {
      await createTask({
        id_team: team.id,
        id_responsible: taskResponsible,
        name: taskName.trim(),
        priority: "low",
        type: taskType,
        due_date: taskDueDate,
        status: "pending",
      });

      const refreshed = await getTeamTasks(team.id);
      setTasks(refreshed);

      setTaskName("");
      setTaskType("business");
      setTaskResponsible("");
      setShowCreateForm(false);
    } catch (err) {
      console.log(err);
      alert("Error creando tarea");
    }
  };

  // ===========================
  //   Actualizar tarea
  // ===========================
  const toggleTask = (id) => {
  setOpenTask((prev) => (prev === id ? null : id));
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const currentTask = tasks.find((t) => t.id === taskId);
      if (!currentTask) throw new Error("Tarea no encontrada");

      const updatedTask = {
        ...currentTask,
        ...updates,
        id_team: team.id,
        id_responsible: currentTask.id_responsible || user.user_id,
      };

      await updateTask(taskId, updatedTask);

      const refreshed = await getTeamTasks(team.id);
      setTasks(refreshed);
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar la tarea");
    }
  };

  // ===========================
  //   Eliminar tarea
  // ===========================
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("¿Eliminar esta tarea?")) return;

    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      alert("No se pudo eliminar la tarea");
    }
  };

  // ===========================
  //   Cerrar sesión
  // ===========================
  const handleLogout = () => {
    signOut(navigate);
  };

  if (loading) return   <div className="loader-container"><div className="spinner"></div></div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Para los nombres
  const getResponsibleName = (userId) => {
    if (!userId) return "Sin responsable";
    if (profilesCache[userId]?.user?.name) return profilesCache[userId].user.name;
    const m = members.find((x) => x.id_user === userId);
    return m?.name || "Sin responsable";
  };
  
  // Para las imagenes
  const getResponsiblePicture = (userId) => {
  const member = members.find(m => m.id_user === userId);
  return member?.picture || "/default_profile.png";
  };


  // ===========================
  //   RENDER
  // ===========================
  return (
    <div className="board-page-root">
      <div className="board-container">
        {/* HEADER SUPERIOR */}
        <div className="board-header">
          <div className="board-header-info">
            <h2>{team?.name}</h2>
            <p className="user-line">
              <img
                src={user?.picture}
                alt="pfp"
                className="mini-avatar"
              />
              {user?.name}
            </p>
          </div>

          <div className="invite-section">
            <input
              type="text"
              placeholder="ID o correo de usuario..."
              value={inviteUserId}
              onChange={(e) => setInviteUserId(e.target.value)}
            />
            <button onClick={handleInviteUser}>✉️ Enviar invitación</button>
          </div>

          <div className="header-actions">
            {/* 🔔 Notificaciones */}
            <button onClick={() => setShowNotifications(!showNotifications)}>
              🔔 
            </button>
            {showNotifications && (<NotificationsPanel onClose={() => setShowNotifications(false)} />)}

            <button className="add-task" onClick={() => setShowCreateForm(true)}>
               Crear tarea
            </button>

            <button onClick={() => setShowMembersModal(true)}>
              Gestionar miembros
            </button>

            <button
              className="teams-manager-btn"
              type="button"
              onClick={() => setShowTeamsManager(true)}
            >
               Gestor de equipos
            </button>

            <button className="profile-btn" onClick={() => navigate("/profile")}>
              Mi perfil
            </button>

            <button className="logout" onClick={handleLogout}>
               Cerrar sesión
            </button>
          </div>
        </div>

        {/* TABLERO KANBAN */}
        <div className="kanban-board">
          {statuses.map((st) => (
            <div key={st.key} className="kanban-column">
              <h3>{st.label}</h3>
              {tasks
                .filter((t) => t.status === st.key)
                .map((t) => (

                  <div key={t.id} className="kanban-card">

                    {/* CABECERA / PARTE SIEMPRE VISIBLE */}
                    <div className="task-header" onClick={() => toggleTask(t.id)}>
                      <div>
                        <p className="task-title">{t.name}</p>
                        <small>
                          🗓️ {new Date(t.due_date).toLocaleDateString()}

                          <div className="responsible-info">
                            <img
                              src={getResponsiblePicture(t.id_responsible)}
                              alt="profile"
                              className="mini-avatar"
                              style={{ marginRight: "8px" }}
                            />
                            {getResponsibleName(t.id_responsible)}
                          </div>
                        </small>
                      </div>

                      <button className="expand-btn">
                        {openTask === t.id ? "▲" : "▼"}
                      </button>
                    </div>

                    {/* SECCIÓN DESPLEGABLE */}
                    {openTask === t.id && (
                      <div className="task-details">

                        <div className="dropdown-group">
                          <label>Estado:</label>
                          <select
                            value={t.status}
                            onChange={(e) =>
                              handleTaskUpdate(t.id, { status: e.target.value })
                            }
                          >
                            <option value="pending">Pendiente</option>
                            <option value="in_progress">En progreso</option>
                            <option value="completed">Completado</option>
                          </select>
                        </div>

                        <div className="dropdown-group">
                          <label>Prioridad:</label>
                          <select
                            value={t.priority}
                            onChange={(e) =>
                              handleTaskUpdate(t.id, { priority: e.target.value })
                            }
                          >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                          </select>
                        </div>

                        <button
                          className="mini-btn delete"
                          onClick={() => handleDeleteTask(t.id)}
                        >
                          🗑️
                        </button>

                      </div>
                    )}

                  </div>

                ))}
            </div>
          ))}
        </div>
        
      </div>

      {/* MODAL CREAR TAREA */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Crear nueva tarea</h3>
            <label>Nombre de la tarea</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Escribe el nombre..."
            />

            <label>Tipo de tarea</label>
            <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
              <option value="business">Business</option>
              <option value="technical">Technical</option>
              <option value="design">Design</option>
              <option value="research">Research</option>
            </select>

            <label>Responsable</label>
            <select
              value={taskResponsible}
              onChange={(e) => setTaskResponsible(e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {members.filter(m => m.role !== "pending").map((m) => (
                <option key={m.id_user} value={m.id_user}>
                  {m.name}
                </option>
              ))}
            </select>

            <label>Fecha de vencimiento</label>
            <input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={handleAddTask}>Crear</button>
              <button onClick={() => setShowCreateForm(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GESTOR DE EQUIPOS */}
      {showTeamsManager && (
        <div
          className="teams-manager-overlay"
          onClick={() => setShowTeamsManager(false)}
        >
          <div
            className="teams-manager-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="teams-manager-close"
              onClick={() => setShowTeamsManager(false)}
            >
              ✕
            </button>
            <TeamsSidebar />
          </div>
        </div>
      )}

      {/* MODAL GESTOR DE MIEMBROS */} 
      {showMembersModal && (
        <MembersManagerModal
          teamId={team.id}
          initialMembers={members}
          onClose={async () => {
            setShowMembersModal(false);
          }}
        />
      )}
    </div>
  );
}

export default BoardPage;
