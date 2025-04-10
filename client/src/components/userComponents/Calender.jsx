import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { CalendarModal } from "../Utils/index.js";
import { useNavigate } from "react-router-dom";
import { eventService } from "../../api/eventService.js";

const EventItem = ({ event }) => {
  const isEvent = event?.extendedProps?.tasktype === "Event";
  const isPastEvent = new Date(event?.start) < new Date();

  const colorClass = isEvent
    ? "bg-blue-500"
    : isPastEvent
    ? "bg-yellow-500"
    : "bg-red-500";

  return (
    <div
      className={`text-xs font-semibold rounded-md px-2 py-1 truncate text-white text-center shadow-sm ${colorClass}`}
      title={event.title}
    >
      📌 {event.title}
    </div>
  );
};

const Calender = () => {
  const navigate = useNavigate();
  const [currData, setCurrData] = useState();
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [events, setEvents] = useState([]);

  const handleDatesSet = (dateInfo) => {
    const currentVisibleDate = dateInfo.view.calendar.getDate();
    const visibleMonth = currentVisibleDate.getMonth() + 1;
    const visibleYear = currentVisibleDate.getFullYear();

    if (dateInfo.view.type === "dayGridMonth") {
      setCurrData({ month: visibleMonth, year: visibleYear });
    } else if (dateInfo.view.type === "dayGridDay") {
      setCurrData({
        date: currentVisibleDate.getDate(),
        month: visibleMonth,
        year: visibleYear,
      });
    }
  };

  const fetchData = async () => {
    const response = await eventService.getSchedule(currData);
    setEvents(
      response.map((event) => ({
        id: event?._id,
        title: event.title || "Untitled Event",
        start: event?.deadline || new Date().toISOString(),
        tasktype: event?.tasktype,
      }))
    );
  };

  useEffect(() => {
    fetchData();
  }, [currData]);

  const handleDateClick = (info) => {
    setSelectedInfo({
      type: "date",
      date: info.dateStr,
    });
    setIsCalendarModalOpen(true);
  };

  const handleEventClick = (info) => {
    setSelectedInfo({
      type: "event",
      title: info.event.title,
      start: info.event.start,
    });
    setIsCalendarModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="sm:max-w-6xl sm:mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 transition-all">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventContent={(info) => <EventItem event={info.event} />}
          eventClick={handleEventClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridDay",
          }}
          editable
          selectable
          displayEventTime={false}
          dateClick={handleDateClick}
          datesSet={handleDatesSet}
          height="auto"
          dayHeaderClassNames={() =>
            "font-black dark:bg-gray-800 dark:text-white bg-gray-200 text-black"
          }
          dayCellClassNames={() =>
            "font-semibold text-lg dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:hover:text-black bg-white text-black border-gray-300"
          }
        />

        {isCalendarModalOpen && (
          <CalendarModal onClose={() => setIsCalendarModalOpen(false)}>
            {selectedInfo?.type === "date" ? (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                  📅 Date Selected:{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    {new Date(selectedInfo.date).toLocaleDateString()}
                  </span>
                </h2>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => navigate("/events")}
                >
                  Create Event
                </button>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2 dark:text-white">
                  Event:{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    {selectedInfo.title}
                  </span>
                </h2>
                <p className="text-gray-600 mb-4 dark:text-gray-400">
                  On: {new Date(selectedInfo.start).toLocaleDateString()}
                </p>
              </div>
            )}
          </CalendarModal>
        )}
      </div>
    </div>
  );
};

export default Calender;
