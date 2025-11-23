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
  const [activeTab, setActiveTab] = useState("unread");
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

      if (Array.isArray(data)) {
        const parsed = data.map(item => ({
          id: item.id_notification,
          read: item.read,
          title: item.notification.title,
          message: item.notification.message,
          creation_date: item.notification.creation_date
        }));

      setNotifications(parsed);
      }

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
      <div className="notifications-tabs">
        <button 
          className={activeTab === "unread" ? "active" : ""} 
          onClick={() => setActiveTab("unread")}
        >
          No leídas
        </button>
        <button 
          className={activeTab === "read" ? "active" : ""} 
          onClick={() => setActiveTab("read")}
        >
          Leídas
        </button>
      </div>


      {notifications.length === 0 ? (
        <p>No tienes notificaciones</p>
      ) : (

      <ul className="notifications-list">
        {[...notifications]
          .filter(n => activeTab === "unread" ? !n.read : n.read)
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
