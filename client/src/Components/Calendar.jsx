// Calendar.jsx
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar({ teamId }) {
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);

  // ------------------------------
  // Cargar eventos del backend (por equipo)
  // ------------------------------
  const fetchEvents = async () => {
    try {
      const query = teamId ? `?teamId=${teamId}` : "";
      const res = await fetch(`/api/calendar/events${query}`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Error loading events:", err);
    }
  };

  // ------------------------------
  // Crear evento (selección de slot)
  // ------------------------------
  const handleDateSelect = async (selectInfo) => {
    const title = prompt("Título del evento:");
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (!title) return;

    try {
      const res = await fetch("/api/calendar/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          teamId, // 👈 importante
        }),
      });

      const newEvent = await res.json();

      calendarApi.addEvent({
        id: newEvent.id,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      });
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  // ------------------------------
  // Actualizar evento (drag/resize)
  // ------------------------------
  const handleEventChange = async (changeInfo) => {
    try {
      await fetch("/api/calendar/events/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: changeInfo.event.id,
          title: changeInfo.event.title,
          start: changeInfo.event.startStr,
          end: changeInfo.event.endStr,
          teamId,
        }),
      });
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  // ------------------------------
  // Eliminar evento (click)
  // ------------------------------
  const handleEventClick = async (clickInfo) => {
    const ok = window.confirm(
      `¿Eliminar el evento "${clickInfo.event.title}"?`
    );
    if (!ok) return;

    try {
      await fetch("/api/calendar/events/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: clickInfo.event.id,
          teamId,
        }),
      });

      clickInfo.event.remove();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  // Cargar eventos cuando cambie el equipo
  useEffect(() => {
    fetchEvents();
  }, [teamId]);

  // Forzar render cuando se abre el modal
  useEffect(() => {
    setTimeout(() => {
      const api = calendarRef.current?.getApi();
      if (api) api.render();
    }, 50);
  }, []);

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      editable={true}
      selectable={true}
      selectMirror={true}
      events={events}
      select={handleDateSelect}
      eventChange={handleEventChange}
      eventClick={handleEventClick}
      height="100%"
    />
  );
}
