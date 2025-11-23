import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateMemberRole, getUserProfile, getProfile, getTeamMembers, deleteMember, leaveTeam } from "../utils/api";
import "../estilos/MembersManagerModal.css";

export default function MembersManagerModal({ teamId, onClose}) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // id_user que se está guardando
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile(); // <-- obtiene el usuario logueado
        setCurrentUserId(profile.user_id);      // <-- guardamos su id
      } catch (err) {
        console.error("Error obteniendo usuario actual:", err);
      }
    };

    loadProfile();
  }, []);

  const reloadMembers = async () => {
    try {
      const freshMembers = await getTeamMembers(teamId);

      const withNames = await Promise.all(
        freshMembers.map(async (m) => {
          const profile = await getUserProfile(m.id_user);
          return {
            ...m,
            name: profile.user.name,
            email: profile.user.email,
            picture: profile.picture,
          };
        })
      );

      setMembers(withNames.filter(m => m.role !== "pending"));
    } catch (err) {
      console.error("Error recargando miembros:", err);
    }
  };

  useEffect(() => {
    reloadMembers().finally(() => setLoading(false));
  }, [teamId]);

  const handleRoleChange = async (member, newRole) => {
    setSaving(member.id_user);
    try {
      await updateMemberRole(member.id_user, teamId, newRole);
      await reloadMembers();
    } catch (err) {
      console.error("Error actualizando rol:", err);
      alert("Error al actualizar el rol");
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteMember = async (member) => {
    if (!window.confirm(`¿Eliminar a ${member.name} del equipo?`)) return;

    setSaving(member.id_user);
    try {
      await deleteMember(member.id_user, teamId);
      await reloadMembers();
    } catch (err) {
      console.error("Error eliminando miembro:", err);
      alert("Error al eliminar miembro ❌");
    } finally {
      setSaving(null);
    }
  };

  const handleLeave = async (member) => {
    if (!window.confirm("Deseas salir del equipo?")) return;

    setSaving(member.id_user);
    try {
      await leaveTeam(member.id_user, teamId);
      navigate("/teamspage");
    } catch (err) {
      console.error("Error eliminando miembro:", err);
      alert("Error al eliminar miembro ❌");
    } finally {
      setSaving(null);
    }
  };

  if (loading)
    return (
      <div className="teams-manager-overlay">
        <div className="teams-manager-dialog p-4 text-center">Cargando...</div>
      </div>
    );

  return (
    <div className="teams-manager-overlay">
      <div className="teams-manager-dialog p-4 relative">

        {/* Botón cerrar */}
        <button className="teams-manager-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Miembros del equipo</h2>

        {members.map((member) => (
          <div
            key={member.id_user}
            className="flex justify-between items-center py-2 border-b"
          >
            <div>
              <img 
                src={member.picture}
                alt={member.name}
                className="mini-avatar"
                style={{ marginRight: "8px" }}
              />
              {member.name}
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>

            <select
              className="border px-2 py-1 rounded"
              value={member.role}
              disabled={saving === member.id_user}
              onChange={(e) =>
                handleRoleChange(member, e.target.value)
              }
            >
              <option value="admin">Admin</option>
              <option value="leader">Leader</option>
              <option value="operator">Operador</option>
              <option value="viewer">Viewer</option>
            </select>
            <button
              className="p-1 rounded hover:bg-red-100 text-red-600 text-sm transition"
              disabled={saving === member.id_user}
              onClick={() =>
                member.id_user === currentUserId
                  ? handleLeave(member)
                  : handleDeleteMember(member)
              }
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
