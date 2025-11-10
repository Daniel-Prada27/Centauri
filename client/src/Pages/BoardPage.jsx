import React, { useEffect, useState } from "react";
import "../estilos/BoardPage.css";

function BoardPage() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const statuses = [
    { key: "pending", label: "Pendiente" },
    { key: "in_progress", label: "En progreso" },
    { key: "completed", label: "Completado" },
  ];

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
            console.log(data);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
  };

  //crear tarea
  const handleAddTask = async (e) => {
    e.preventDefault();
      const body = {
        id_team: team.id,
        id_responsible: user.user_id,
        name: newTask.trim(),
        priority: "low",
        type: "business",
        due_date: "2025-12-01",
        status: "pending"
      };
    const updated =await makeRequest("/task", "POST", body);
    if (updated) {
      const refreshed = await fetchTeamTasks(team.id);
      setTasks(refreshed);
    }
  };

  // Cambiar estado de una tarea
  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const currentTask = tasks.find((t) => t.id === taskId);
      if (!currentTask) throw new Error("Tarea no encontrada");

      // Combinar la tarea actual con los nuevos cambios
      const updatedTask = {
        ...currentTask,
        ...updates,
        id_team: team.id,
        id_responsible: currentTask.id_responsible || user.user_id,
      };

      // El backend espera fechas válidas, no objetos Date
      if (updatedTask.due_date instanceof Date) {
        updatedTask.due_date = updatedTask.due_date.toISOString();
      }

      const updated = await makeRequest(`/task/${taskId}`, "PUT", updatedTask);
      if (updated) {
        const refreshed = await fetchTeamTasks(team.id);
        setTasks(refreshed);
      }
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
      setError("No se pudo actualizar la tarea.");
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("¿Eliminar esta tarea?")) return;
    const deleted = await makeRequest(`/task/${taskId}`, "DELETE");
    if (deleted) {
      setTasks(tasks.filter((t) => t.id !== taskId));
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    window.location.href = "/login";
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="board-container">
      <div className="board-header">
        <div>
          <h2>{team?.name}</h2>
          <p style={{ color: "#5e6c84" }}>
            👤 {user?.user["name"]} — {user?.user["email"]}
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
        {statuses.map((st) => (
          <div key={st.key} className="kanban-column">
            <h3>{st.label}</h3>

            {tasks
              .filter((t) => t.status === st.key)
              .map((t) => (
                <div key={t.id} className="kanban-card">
                  <p className="task-title">
                    {t.name}{" "}
                  </p>

                  <small>
                    🗓️ {new Date(t.due_date).toLocaleDateString()}
                    <br />👤 {user?.user["name"]}
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