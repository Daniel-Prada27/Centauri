import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createEvent, getEvents } from "../utils/api";
import "../estilos/Calendar.css";

export default function Calendar({ teamId }) {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectInfo, setSelectInfo] = useState(null);

    const [form, setForm] = useState({
        title: "",
        startTime: "",
        endTime: "",
    });

    const calendarRef = useRef(null);

    // ===============================
    // Cargar eventos
    // ===============================
    const fetchEvents = async () => {
        try {
            const events = await getEvents()
            setEvents(events || []);

        } catch (err) {
            console.error("Error loading events:", err);
        }
    };

    // ===============================
    // Abrir popup al seleccionar
    // ===============================
    const handleDateSelect = (info) => {
        setSelectInfo(info);

        const date = info.startStr.slice(0, 10);

        setForm({
            title: "",
            startTime: `${date}T08:00`,
            endTime: `${date}T09:00`,
        });

        setShowModal(true);
    };

    // ===============================
    // Crear evento
    // ===============================
    const submitEvent = async () => {
        if (!form.title.trim()) return;
            const calendarApi = selectInfo.view.calendar;
            calendarApi.unselect();

        try {
            const eventBody = {
                name: form.title,
                startDate: form.startTime,
                endDate: form.endTime,
                teamId
                ,
            };

            console.log(form)
            console.log(eventBody)

            await createEvent(eventBody);
            await fetchEvents();
            setShowModal(false);
        } catch (err) {
            console.error("Error creating event:", err);
        }
    };

    // ===============================
    // Actualizar evento drag/resize
    // ===============================
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

    // ===============================
    // Eliminar evento
    // ===============================
    const handleEventClick = (info) => {
        if (info.event.url) {
            if (info.event.url) {
                info.jsEvent.preventDefault();        // Prevent same-page navigation
                window.open(info.event.url, "_blank", "noopener,noreferrer");
                return;
            }
        }

        // If the event has no link, fallback to delete logic:
        info.jsEvent.preventDefault();
        const ok = window.confirm(`¿Eliminar el evento "${info.event.title}"?`);
        if (!ok) return;

        fetch("/api/calendar/events/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: info.event.id, teamId }),
        }).then(() => info.event.remove());
    };

    useEffect(() => {
        fetchEvents();
    }, [teamId]);

    return (
        <>
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
                select={handleDateSelect}
                eventChange={handleEventChange}
                eventClick={handleEventClick}
                events={events}
                height="100%"
            />

            {/* ===============================
          POPUP
      =============================== */}
            {showModal && (
                <div className="calendar-overlay">
                    <div className="calendar-dialog">
                        <button className="calendar-close" onClick={() => setShowModal(false)}>
                            ✕
                        </button>

                        <h2>Crear nuevo evento</h2>

                        <label>Título</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />

                        <label>Hora de inicio</label>
                        <input
                            type="datetime-local"
                            value={form.startTime}
                            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                        />

                        <label>Hora final</label>
                        <input
                            type="datetime-local"
                            value={form.endTime}
                            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                        />

                        <div className="calendar-btn-row">
                            <button className="calendar-btn create" onClick={submitEvent}>Crear</button>
                            <button className="calendar-btn cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
