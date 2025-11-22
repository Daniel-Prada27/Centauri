import React, { useEffect, useState } from "react";
import "../estilos/BoardPage.css";
import TeamsSidebar from "../Components/TeamsSidebar";
import MembersManagerModal from "../Components/MembersManagerModal";
import { useParams, useNavigate } from "react-router-dom";

import {
  signOut,
  getProfile,
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

  const [inviteUserId, setInviteUserId] = useState("");
  const [newTask, setNewTask] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showMembersModal, setShowMembersModal] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("business");
  const [taskResponsible, setTaskResponsible] = useState("");

  const [taskDueDate, setTaskDueDate] = useState("");

  // 👇 NUEVO: controlar la ventana del gestor de equipos
  const [showTeamsManager, setShowTeamsManager] = useState(false);

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
      setUser(userData);

      const teams = await getTeams();
      const currentTeam = teams.find((t) => t.id === id);

      if (!currentTeam) {
        alert("No perteneces a este equipo o no existe ⚠️");
        return navigate("/teamspage");
      }

      setTeam(currentTeam);

      const teamMembers = await getTeamMembers(currentTeam.id);
      setMembers(teamMembers);

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
    if (!inviteUserId.trim()) return alert("Ingresa un ID válido");

    try {
      await inviteUser(team.id, inviteUserId.trim());
      alert("Invitación enviada");
      setInviteUserId("");
    } catch (err) {
      alert("Error enviando invitación");
    }
  };

  // ===========================
  //   Crear tarea
  // ===========================
  const handleAddTask = async (e) => {
    if (e) e.preventDefault();

    if (!taskName.trim() || !taskResponsible.trim()) {
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

      // limpiar
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

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
            <p>
              👤 {user?.user?.name} — {user?.user?.email}
            </p>
          </div>

          <div className="invite-section">
            <input
              type="text"
              placeholder="ID de usuario a invitar..."
              value={inviteUserId}
              onChange={(e) => setInviteUserId(e.target.value)}
            />
            <button onClick={handleInviteUser}>✉️ Enviar invitación</button>
          </div>

          <div className="header-actions">
            <button className="add-task" onClick={() => setShowCreateForm(true)}>
              ➕ Crear tarea
            </button>

            <button onClick={() => setShowMembersModal(true)}>
              Gestionar Miembros
            </button>

            {/* 👇 NUEVO: botón para abrir el gestor de equipos */}
            <button
              className="teams-manager-btn"
              type="button"
              onClick={() => setShowTeamsManager(true)}
            >
              👥 Gestor de equipos
            </button>

            <button className="logout" onClick={handleLogout}>
              🚪 Cerrar sesión
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
                    <p className="task-title">{t.name}</p>
                    <small>
                      🗓️ {new Date(t.due_date).toLocaleDateString()}
                      <br />
                      👤 {members.find(m => m.id_user === t.id_responsible)?.id_user}
                    </small>

                    <div className="task-controls">
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
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

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
            {members.map((m) => (
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

      {/* MODAL DEL GESTOR DE EQUIPOS */}
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

            {/* Aquí dentro se muestra el mismo contenido que antes estaba a la izquierda */}
            <TeamsSidebar />
          </div>
        </div>
      )}

      {showMembersModal && (
        <MembersManagerModal
          teamId={team.id}
          initialMembers={members}
          onClose={() => setShowMembersModal(false)}
        />
      )}


    </div>
  );
}

export default BoardPage;
