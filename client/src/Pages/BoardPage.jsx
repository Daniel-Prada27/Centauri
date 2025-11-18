import React, { useEffect, useState } from "react";
import "../estilos/BoardPage.css";
import { useParams, useNavigate } from "react-router-dom";

import {
  makeRequest,
  signOut,
  getProfile,
  getTeams,
  getTeamMembers,
  getTeamTasks,
  createTask,
  updateTask,
  deleteTask,
  inviteUser
} from "../utils/api";

function BoardPage() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [inviteUserId, setInviteUserId] = useState("");
  const [newTask, setNewTask] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const statuses = [
    { key: "pending", label: "Pendiente" },
    { key: "in_progress", label: "En progreso" },
    { key: "completed", label: "Completado" },
  ];

  // Cargar datos principales
  const loadBoardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Usuario
      const userData = await getProfile();
      setUser(userData);

      // 2. Equipos del usuario
      const teams = await getTeams();
      const currentTeam = teams.find((t) => t.id === id);

      if (!currentTeam) {
        alert("No perteneces a este equipo o no existe ⚠️");
        return navigate("/teamspage");
      }

      setTeam(currentTeam);

      // 3. Tareas
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

  // Invitar usuario al equipo
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

  // Crear tarea
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await createTask({
        id_team: team.id,
        id_responsible: user.user_id,
        name: newTask.trim(),
        priority: "low",
        type: "business",
        due_date: "2025-12-01",
        status: "pending",
      });

      const refreshed = await getTeamTasks(team.id);
      setTasks(refreshed);
      setNewTask("");

    } catch (err) {
      alert("Error creando tarea");
    }
  };

  // Actualizar tarea (status, prioridad...)
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

  // Borrar tarea
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("¿Eliminar esta tarea?")) return;

    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      alert("No se pudo eliminar la tarea");
    }
  };

  // Logout
  const handleLogout = () => {
    signOut(navigate);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="board-container">
      <div className="board-header">
        <div>
          <h2>{team?.name}</h2>
          <p style={{ color: "#5e6c84" }}>
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
          <input
            type="text"
            placeholder="Nueva tarea..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={handleAddTask}>➕ Crear tarea</button>
          <button
            style={{ backgroundColor: "#ff4d4d" }}
            onClick={handleLogout}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </div>

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
                    👤 {user?.user?.name}
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
  );
}

export default BoardPage;
