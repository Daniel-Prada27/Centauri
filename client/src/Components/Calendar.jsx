// // Calendar.jsx
// import React, { useState, useEffect, useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { createEvent } from "../utils/api";

// export default function Calendar({ teamId }) {
//   const [events, setEvents] = useState([]);
//   const calendarRef = useRef(null);

//   // ------------------------------
//   // Cargar eventos del backend (por equipo)
//   // ------------------------------
//   const fetchEvents = async () => {
//     try {
//       const query = teamId ? `?teamId=${teamId}` : "";
//       const res = await fetch(`/api/calendar/events${query}`);
//       const data = await res.json();
//       setEvents(data.events || []);
//     } catch (err) {
//       console.error("Error loading events:", err);
//     }
//   };

//   // ------------------------------
//   // Crear evento (selección de slot)
//   // ------------------------------

// function parseTimeToDate(dateStr, timeStr) {
//   const [time, modifier] = timeStr.trim().split(" "); // "10:30", "AM"
//   let [hours, minutes] = time.split(":").map(Number);

//   // Convert 12h → 24h
//   if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
//   if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;

//   return new Date(`${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
// }

// const handleDateSelect = async (selectInfo) => {
//   const title = prompt("Título del evento:");
//   if (!title) return;

//   const startTime = prompt("Hora de inicio (HH:MM AM/PM):");
//   if (!startTime) return;

//   const endTime = prompt("Hora de finalización (HH:MM AM/PM):");
//   if (!endTime) return;

//   const calendarApi = selectInfo.view.calendar;
//   calendarApi.unselect();

//   try {
//     const dateStr = selectInfo.startStr.split("T")[0]; // "2025-11-24"

//     const startDate = parseTimeToDate(dateStr, startTime);
//     const endDate = parseTimeToDate(dateStr, endTime);

//     // RFC3339 string for Google Calendar
//     const eventBody = {
//       name: title,
//       startDate: startDate.toISOString(),
//       endDate: endDate.toISOString(),
//     };

//     console.log(eventBody);
//     createEvent(eventBody);

//   } catch (err) {
//     console.error("Error creating event:", err);
//   }
// };


//   // ------------------------------
//   // Actualizar evento (drag/resize)
//   // ------------------------------
//   const handleEventChange = async (changeInfo) => {
//     try {
//       await fetch("/api/calendar/events/update", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: changeInfo.event.id,
//           title: changeInfo.event.title,
//           start: changeInfo.event.startStr,
//           end: changeInfo.event.endStr,
//           teamId,
//         }),
//       });
//     } catch (err) {
//       console.error("Error updating event:", err);
//     }
//   };

//   // ------------------------------
//   // Eliminar evento (click)
//   // ------------------------------
//   const handleEventClick = async (clickInfo) => {
//     const ok = window.confirm(
//       `¿Eliminar el evento "${clickInfo.event.title}"?`
//     );
//     if (!ok) return;

//     try {
//       await fetch("/api/calendar/events/delete", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: clickInfo.event.id,
//           teamId,
//         }),
//       });

//       clickInfo.event.remove();
//     } catch (err) {
//       console.error("Error deleting event:", err);
//     }
//   };

//   // Cargar eventos cuando cambie el equipo
//   useEffect(() => {
//     fetchEvents();
//   }, [teamId]);

//   // Forzar render cuando se abre el modal
//   useEffect(() => {
//     setTimeout(() => {
//       const api = calendarRef.current?.getApi();
//       if (api) api.render();
//     }, 50);
//   }, []);

//   return (
//     <FullCalendar
//       ref={calendarRef}
//       plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//       initialView="dayGridMonth"
//       headerToolbar={{
//         left: "prev,next today",
//         center: "title",
//         right: "dayGridMonth,timeGridWeek,timeGridDay",
//       }}
//       editable={true}
//       selectable={true}
//       selectMirror={true}
//       events={events}
//       select={handleDateSelect}
//       eventChange={handleEventChange}
//       eventClick={handleEventClick}
//       height="100%"
//     />
//   );
// }
// Calendar.jsx
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createEvent, getEvents } from "../utils/api";

export default function Calendar({ teamId }) {
    const [events, setEvents] = useState([]);
    const calendarRef = useRef(null);

    // ---------------------------------------------------------
    // Load events directly from backend (already FC formatted)
    // ---------------------------------------------------------
    const fetchEvents = async () => {
        try {
            const events = await getEvents()
            setEvents(events || []);

        } catch (err) {
            console.error("Error loading events:", err);
        }
    };

    // ---------------------------------------------------------
    // Parse "HH:MM AM/PM" → JS Date
    // ---------------------------------------------------------
    function parseTimeToDate(dateStr, timeStr) {
        const [time, modifier] = timeStr.trim().split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
        if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;

        return new Date(
            `${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`
        );
    }

    // ---------------------------------------------------------
    // Handle selecting a slot → create event
    // ---------------------------------------------------------
    const handleDateSelect = async (selectInfo) => {
        const title = prompt("Título del evento:");
        if (!title) return;

        const startTime = prompt("Hora de inicio (HH:MM AM/PM):");
        if (!startTime) return;

        const endTime = prompt("Hora de finalización (HH:MM AM/PM):");
        if (!endTime) return;

        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        try {
            const dateStr = selectInfo.startStr.split("T")[0];

            const startDate = parseTimeToDate(dateStr, startTime);
            const endDate = parseTimeToDate(dateStr, endTime);

            const eventBody = {
                name: title,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                teamId,
            };

            await createEvent(eventBody);
            fetchEvents(); // reload everything

        } catch (err) {
            console.error("Error creating event:", err);
        }
    };

    // ---------------------------------------------------------
    // Drag or resize event → update server
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // Click event → open Google Calendar event
    // ---------------------------------------------------------
    const handleEventClick = (info) => {
        if (info.event.url) {
            // Let the default action open the link.
            return;
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

    // Load events initially and when team changes
    useEffect(() => {
        fetchEvents();
    }, [teamId]);

    // ---------------------------------------------------------
    // Render FullCalendar
    // ---------------------------------------------------------
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
            events={events}          // <-- shows titles on calendar
            select={handleDateSelect}
            eventChange={handleEventChange}
            eventClick={handleEventClick}
            height="100%"
        />
    );
}
