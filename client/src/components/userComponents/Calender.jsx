// src/components/Calender.jsx
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
// import "@fullcalendar/common/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";
// import "@fullcalendar/list/main.css";

const Calender = () => {
  const events = [
    { title: "Math Assignment Due", start: "2025-01-10", color: "#f87171" },
    { title: "Project Presentation", start: "2025-01-12", color: "#34d399" },
    { title: "Team Meeting", start: "2025-01-15T14:00:00", color: "#60a5fa" },
    { title: "Science Fair", start: "2025-01-15T10:00:00", color: "#fbbf24" },
  ];

  return (
    <div className="p-6 bg-gray-50">
      <div className="sm:max-w-6xl sm:mx-auto bg-white shadow-lg rounded-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          editable={true}
          selectable={true}
          events={events}
          eventColor="#6366f1" // Default color for events
          height="auto"
          eventClick={(info) => {
            alert(`Event: ${info.event.title}`);
          }}
          dateClick={(info) => {
            alert(`Clicked on date: ${info.dateStr}`);
          }}
        />
      </div>
    </div>
  );
};

export default Calender;
