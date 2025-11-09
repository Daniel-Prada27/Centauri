import React, { useEffect, useState } from "react";
import "../estilos/BoardPage.css";

function BoardPage() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");

  const statuses = ["Pendiente", "En progreso", "Completado"];

  // Obtener usuario actual (sesión activa)
  const fetchUser = async () => {
    const res = await fetch("http://localhost:3000/profile", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error obteniendo usuario autenticado");
    return await res.json();
  };

  // Obtener equipo asociado al usuario
  const fetchUserTeam = async (userId) => {
    const res = await fetch(`http://localhost:3000/team`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error buscando equipo del usuario");
    const data = await res.json();
    return data.length > 0 ? data[0] : null; // el primer equipo si pertenece a alguno
  };

  // Obtener tareas del equipo
  const fetchTeamTasks = async (teamId) => {
    const res = await fetch(`http://localhost:3000/task/${teamId}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error cargando tareas del equipo");
    return await res.json();
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        // Paso 1: obtener usuario autenticado
        const userData = await fetchUser();
        setUser(userData);
        console.log("Usuario actual:", userData);

        // Paso 2: buscar equipo del usuario
        const teamData = await fetchUserTeam(userData.id);
        if (!teamData) {
          alert("No estás en ningún equipo. Redirigiendo...");
          window.location.href = "/teamspage";
          return;
        }
        setTeam(teamData);
        console.log("Team actual:", teamData);

        // Paso 3: cargar tareas del equipo
        const taskData = await fetchTeamTasks(teamData.id);
        setTasks(taskData);

        setLoading(false);
      } catch (err) {
        console.error("Error inicializando BoardPage:", err);
        alert("No se pudo cargar el tablero ❌");
        window.location.href = "/login";
      }
    };

    loadAll();
  }, []);

  //crear tarea
  const handleAddTask = async () => {
    if (!newTask.trim()) return alert("Ingresa el nombre de la tarea");

    try {
      const body = {
        id_team: team.id,
        id_responsible: user.id,
        name: newTask.trim(),
        priority: "low",
        type: "business",
        due_date: "2025-12-01",
      };

      const res = await fetch(`http://localhost:3000/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Error creando tarea:", errText);
        alert("No tienes permisos o la tarea ya existe ❌");
        return;
      }

      const created = await res.json();
      setTasks((prev) => [...prev, created]);
      setNewTask("");
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor ❌");
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {

    //await fetch("http://localhost:3000/profile", {
    //  method: "POST",
    //  credentials: "include",
    //});
    window.location.href = "/login";
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="board-container">
      <div className="board-header">
        <div>
          <h2>{team?.name}</h2>
          <p style={{ color: "#5e6c84" }}>
            👤 {user?.name} — {user?.email}
          </p>
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
        {statuses.map((status) => (
          <div key={status} className="kanban-column">
            <h3>{status}</h3>
            {tasks
              .filter((t) => t.status === status)
              .map((t) => (
                <div key={t.id} className="kanban-card">
                  <p className="task-title">{t.title}</p>
                  <small>
                    🗓️ {new Date(t.createdAt).toLocaleString()}
                    <br />👤 {t.createdBy}
                  </small>
                  <select
                    value={t.status}
                    onChange={(e) =>
                      handleStatusChange(t.id, e.target.value)
                    }
                  >
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <div className="task-buttons">
                    <button onClick={() => handleEditTask(t.id)}>✏️</button>
                    <button onClick={() => handleDeleteTask(t.id)}>🗑️</button>
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