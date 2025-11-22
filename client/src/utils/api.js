import { authClient } from "../../../server/lib/auth-client.js";

// Cliente genérico para llamadas HTTP
export const makeRequest = async (endpoint, method, body, customHeaders = {}) => {
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error en la petición");
    }

    return data;
  } catch (err) {
    console.error("API ERROR:", err);
    throw err;
  }
};

// Sign out reutilizable
export const signOut = async (navigate) => {
  try {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => navigate("/login"),
        onError: () => navigate("/login"),
      },
    });
    console.log("Sesión cerrada correctamente");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    // redirigimos igual para asegurar salida
    navigate("/login");
  }
};


// ======================================================
//  PERFIL
// ======================================================
export const getProfile = () =>
  makeRequest("/profile", "GET");

export const getUserProfile = (userId) =>
  makeRequest(`/profile/${userId}`, "GET");

// ======================================================
//  TEAMS
// ======================================================
export const getTeams = () =>
  makeRequest("/team", "GET");

export const getTeamById = (teamId) =>
  makeRequest(`/team/${teamId}`, "GET");

export const createTeam = (team) =>
  makeRequest("/team", "POST", team);

export const updateTeam = (teamId, data) =>
  makeRequest(`/team/${teamId}`, "PUT", data);

export const deleteTeam = (teamId) =>
  makeRequest(`/team/${teamId}`, "DELETE");

// ======================================================
//  MEMBERS / INVITATIONS
// ======================================================
export const getTeamMembers = (teamId) =>
  makeRequest(`/member/${teamId}`, "GET");

// Invitar usuario a un equipo
export const inviteUser = (teamId, userId) =>
  makeRequest("/member/invite", "POST", {
    id_team: teamId,
    id_user: userId,
  });

export const acceptInvite = (teamId, userId) =>
  makeRequest("/member/invite/accept", "PUT", {
    id_team: teamId,
    id_user: userId
  });

export const rejectInvite = (teamId, userId) =>
  makeRequest("/member/invite/reject", "DELETE", {
    id_team: teamId,
    id_user: userId
  });

export const updateMemberRole = (userId, teamId, role) =>
  makeRequest("/member", "PUT", {
    id_user: userId,
    id_team: teamId,
    role,
  });

// Solicitar unirse mediante código
export const joinTeam = (teamId) =>
  makeRequest("/member/invite/join", "POST", {
    id_team: teamId,
  });

// ======================================================
//  TASKS
// ======================================================

// Obtener tareas del equipo
export const getTeamTasks = (teamId) =>
  makeRequest(`/task/${teamId}`, "GET");

// Crear tarea
export const createTask = (taskData) =>
  makeRequest("/task", "POST", taskData);

// Editar tarea
export const updateTask = (taskId, updatedTask) =>
  makeRequest(`/task/${taskId}`, "PUT", updatedTask);

// Eliminar tarea
export const deleteTask = (taskId) =>
  makeRequest(`/task/${taskId}`, "DELETE");

