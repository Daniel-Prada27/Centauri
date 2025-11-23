import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/ProfilePage.css";

import {
  getProfile,
  updateProfile,
  createProfile,
} from "../utils/api";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [picture, setPicture] = useState(
    "https://img.freepik.com/vector-premium/icono-perfil-avatar-predeterminado-imagen-usuario-redes-sociales-icono-avatar-gris-silueta-perfil-blanco-ilustracion-vectorial_561158-3485.jpg?w=360"
  );
  const navigate = useNavigate();

  // ======================
  //  Cargar perfil (GET)
  // ======================
  const loadProfile = async () => {
    try {
      const data = await getProfile();

      // Si el perfil no existe aún
      if (!data || !data.user_id) {
        setProfile(null);
      } else {
        setProfile(data);
        setOccupation(data.occupation || "");
        setLocation(data.location || "");
        setPicture(data.picture || "");
      }
    } catch (err) {
      console.error("Error cargando perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ======================
  //  Crear perfil (POST)
  // ======================
  const handleCreateProfile = async (e) => {
    e.preventDefault();

    try {
      await createProfile({
        occupation,
        location,
        picture
      });
      const userData = await getProfile();
      alert("✅ Perfil creado correctamente");
      setProfile(userData);
      setIsEditing(false);
    } catch (err) {
      console.error("Error creando perfil:", err);
      alert("Error al crear el perfil");
    }
  };

  // ======================
  //  Actualizar perfil (PUT)
  // ======================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const data = await updateProfile({
        occupation,
        location,
        picture
      });

      alert("✅ Perfil actualizado");

      //para que se mantenga la información previa
      setProfile((prev) => ({
      ...prev,
      occupation: data.occupation,
      location: data.location,
      picture: data.picture
      }));

      setIsEditing(false);
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      alert("Error al actualizar el perfil");
    }
  };

  if (loading) return <p>Cargando perfil...</p>;

  // ======================
  //  Render
  // ======================
  return (
    <div className="profile-page">
      <h2>👤 Mi Perfil</h2>

      {/* Si no tiene perfil aún */}
      {!profile && (
        <form className="profile-form" onSubmit={handleCreateProfile}>
          <p>No tienes perfil. Crea uno para continuar 👇</p>

          <label>Ocupación</label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="Ej: Desarrollador, Estudiante..."
            required
          />

          <label>Ubicación</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej: Colombia, España..."
            required
          />

          <label>Foto de perfil</label>
          <input
            type="text"
            placeholder="https://ejemplo.com/mi-foto.jpg"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />

          <button type="submit">Crear perfil</button>
        </form>
      )}

      {/* Si ya tiene perfil */}
      {profile && !isEditing && (
  <div className="profile-info">
    <img
      src={
        profile.picture && profile.picture !== "pfp/juan"
          ? profile.picture
          : "https://img.freepik.com/vector-premium/icono-perfil-avatar-predeterminado-imagen-usuario-redes-sociales-icono-avatar-gris-silueta-perfil-blanco-ilustracion-vectorial_561158-3485.jpg?w=360"
      }
      alt="Foto de perfil"
    />

    <h3>{profile.user?.name || "Nombre no disponible"}</h3>
    <p>📧 {profile.user?.email || "Sin correo"}</p>
    <p>💼 {profile.occupation || "Sin ocupación"}</p>
    <p>📍 {profile.location || "Sin ubicación"}</p>

    <button onClick={() => setIsEditing(true)}>Editar perfil</button>
    <button className="back-btn" onClick={() => navigate(-1)}>
      ⬅️ Volver
    </button>

  </div>
)}


      {/* Formulario de edición */}
      {profile && isEditing && (
        <form className="profile-form" onSubmit={handleUpdateProfile}>
          <label>Ocupación</label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />

          <label>Ubicación</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label>Foto de perfil (URL o ruta)</label>
          <input
            type="text"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />

          <div className="form-actions">
            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfilePage;
