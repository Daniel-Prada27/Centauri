import React, { useEffect, useRef, useState } from "react";
import "../estilos/NotificationsPanel.css";
import 
{ 
  getNotifications,
  updateNotifications,
  deleteNotifications,
} from "../utils/api";

const NotificationsPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      if (Array.isArray(data)) setNotifications(data);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener notificaciones:", err);
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await updateNotifications(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Error al marcar como leída:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await deleteNotifications(id);

      setNotifications((prev) =>
        prev.filter((n) => n.id !== id)
      );
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };


  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading) return null;

  return (
    <div className="notifications-panel" ref={panelRef}>
      <div className="notifications-header">
        <h3>🔔 Notificaciones</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {notifications.length === 0 ? (
        <p>No tienes notificaciones</p>
      ) : (
        <ul className="notifications-list">
          {[...notifications]
          .sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date))
          .map((n) => (
            <li
              key={n.id}
              className={`notification-item ${n.read ? "read" : "unread"}`}
            >
              <div className="notification-text">
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <small>{new Date(n.creation_date).toLocaleDateString("es-CO", {
                  timeZone: "UTC",
                })}</small>
              </div>
              <div className="notification-actions">
                {!n.read && (
                  <button onClick={() => markAsRead(n.id)}>Marcar como leída</button>
                )}
                <button onClick={() => deleteNotification(n.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPanel;
