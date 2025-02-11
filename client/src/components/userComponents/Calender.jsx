import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { CalendarModal } from '../Utils/index.js';
import {useNavigate} from 'react-router-dom'

const Calender = () => {
  const navigate=useNavigate();
  

  const [currData,setCurrData]=useState();
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const events = [
    { title: "Math Assignment Due", start: "2025-01-10", color: "#f87171", location:'hyderabad' },
    { title: "Project Presentation", start: "2025-01-12", color: "#34d399", location:'hyderabad' },
    { title: "Team Meeting", start: "2025-01-15T14:00:00", color: "#60a5fa", location:'hyderabad' },
    { title: "Science Fair", start: "2025-01-15T10:00:00", color: "#fbbf24", location:'hyderabad' },
  ];

  const handleDatesSet = (dateInfo) => {
    const viewType = dateInfo.view.type;  // Detect current view mode (month, week, day)
    console.log(viewType);
    

    const currentVisibleDate = dateInfo.view.calendar.getDate(); 

    // Extract month and year
    const visibleMonth = currentVisibleDate.getMonth() + 1; // JS months are 0-based
    const visibleYear = currentVisibleDate.getFullYear();

    if (viewType === "dayGridMonth") {
      setCurrData({
        month: visibleMonth,
        year: visibleYear,
      }) // Show all events for the month
    } 
    else if (viewType === "dayGridDay") {
      setCurrData({
        date: currentVisibleDate?.getDate(),
        month: visibleMonth,
        year: visibleYear,
      }) // Day view
    }
  };

  console.log(currData);
  
  

  const handleDateClick = (info) => {
    // console.log(info)
    setSelectedInfo({
      type: "date",
      date: info.dateStr,//Date String -> dateStr (yyyymmdd)
    });
    setIsCalendarModalOpen(true);
  };

  const handleEventClick = (info) => {
    console.log(info)
    setSelectedInfo({
      type: "event",
      title: info.event.title,
      start: info.event.start,
      ...info.event.extendedProps
    });
    
    setIsCalendarModalOpen(true);
    console.log(selectedInfo);
  };

  const deleteEvent=()=>{
    console.log("delete: ",selectedInfo);
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="sm:max-w-6xl sm:mx-auto bg-white shadow-lg rounded-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          datesSet={handleDatesSet}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridDay",
          }}
          editable={true}
          selectable={true}
          events={events}
          eventColor="#6366f1" // Default color for events
          height="auto"
          eventClick={(info) => handleEventClick(info)}
          dateClick={(info) => handleDateClick(info)}
        />
        {isCalendarModalOpen && (
        <CalendarModal onClose={() => setIsCalendarModalOpen(false)}>
          {selectedInfo && selectedInfo?.type === "date" ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Date Selected: {selectedInfo.date}
              </h2>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={()=>navigate('/events')}
              >
                Create Event
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Event: {selectedInfo.title}
              </h2>
              <p className="text-gray-600 mb-4">
                On: {new Date(selectedInfo.start).toLocaleString()} 
              </p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={deleteEvent}
              >
                Delete Event
              </button>
            </div>
          )}
        </CalendarModal>
      )}
      </div>
    </div>
  );
};

export default Calender;
