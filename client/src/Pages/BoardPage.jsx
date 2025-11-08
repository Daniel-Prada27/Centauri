import React, { useEffect, useState } from "react";
import "../estilos/BoardPage.css";

function BoardPage() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTask, setNewTask] = useState("");
  const statuses = ["Pendiente", "En progreso", "Completado"];

  // Simulación temporal: obtén desde localStorage o del backend
  const getUserData = () => JSON.parse(localStorage.getItem("userData"));
  const getTeamData = () => JSON.parse(localStorage.getItem("teamData"));
  const getTeamTasks = () => JSON.parse(localStorage.getItem("teamTasks")) || [];

  useEffect(() => {
    const u = getUserData();
    const t = getTeamData();
    const tk = getTeamTasks();

    if (!u) {
      alert("⚠️ No hay sesión iniciada. Redirigiendo al login...");
      window.location.href = "/login";
      return;
    }

    if (!t) {
      alert("⚠️ No hay equipo seleccionado. Redirigiendo a equipos...");
      window.location.href = "/teams";
      return;
    }

    setUser(u);
    setTeam(t);
    setTasks(tk);
    setLoading(false);
  }, []);

  // Guardar cambios localmente (simulando API)
  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem("teamTasks", JSON.stringify(updatedTasks));
  };

  // ➕ Crear tarea
  const handleAddTask = () => {
    if (!newTask.trim()) return alert("Ingresa el nombre de la tarea");

    const task = {
      id: Date.now(),
      title: newTask.trim(),
      status: "Pendiente",
      createdAt: new Date().toLocaleString(),
      createdBy: user.name,
      teamId: team.id,
    };

    const updated = [...tasks, task];
    saveTasks(updated);
    setNewTask("");
  };

  // ✏️ Editar tarea
  const handleEditTask = (id) => {
    const newTitle = prompt("Nuevo título:");
    if (!newTitle) return;
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, title: newTitle } : t
    );
    saveTasks(updated);
  };

  // 🗑️ Eliminar tarea
  const handleDeleteTask = (id) => {
    if (!window.confirm("¿Eliminar tarea?")) return;
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  // 🔄 Cambiar estado
  const handleStatusChange = (id, status) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, status } : t
    );
    saveTasks(updated);
  };

  // 🚪 Cerrar sesión
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="board-container">
      <div className="board-header">
        <div>
          <h2>{team.name}</h2>
          <p style={{ color: "#5e6c84" }}>👤 {user.name} — {user.email}</p>
        </div>

        <div className="header-actions">
          <input
            type="text"
            placeholder="Nueva tarea..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button className="btn-login" onClick={handleAddTask}>
            ➕ Crear tarea
          </button>

          <button
            className="btn-login"
            style={{ backgroundColor: "#ff4d4d" }}
            onClick={handleLogout}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </div>

      <div className="kanban-board">
        {statuses.map((status) => (
          <div key={status} className="kanban-column">
            <h3>{status}</h3>
            {tasks
              .filter((t) => t.status === status && t.teamId === team.id)
              .map((t) => (
                <div key={t.id} className="kanban-card">
                  <p className="task-title">{t.title}</p>
                  <small>
                    🗓️ {t.createdAt}
                    <br />👤 {t.createdBy}
                  </small>
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <div className="task-buttons">
                    <button className="btn-login" onClick={() => handleEditTask(t.id)}>
                      ✏️
                    </button>
                    <button className="btn-google" onClick={() => handleDeleteTask(t.id)}>
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
