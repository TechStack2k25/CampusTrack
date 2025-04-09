import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { CalendarModal } from '../Utils/index.js';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../api/eventService.js';

const EventItem = ({ event }) => {
  const isEvent = event?.extendedProps?.tasktype === 'Event';
  const isPastEvent = new Date(event?.start) < new Date();
  // console.log( event, isEvent, isPastEvent);

  return (
    <div
      className={`text-xs rounded px-2 truncate text-white text-center ${
        isEvent ? 'bg-blue-500' : isPastEvent ? 'bg-yellow-500' : 'bg-red-500'
      }`}
    >
      {event.title}
    </div>
  );
};

const Calender = () => {
  const navigate = useNavigate();

  const [currData, setCurrData] = useState();
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // const events = [
  //   { title: "Math Assignment Due", start: "2025-01-10", color: "#f87171", location:'hyderabad' },
  //   { title: "Project Presentation", start: "2025-01-12", color: "#34d399", location:'hyderabad' },
  //   { title: "Team Meeting", start: "2025-01-15T14:00:00", color: "#60a5fa", location:'hyderabad' },
  //   { title: "Science Fair", start: "2025-01-15T10:00:00", color: "#fbbf24", location:'hyderabad' },
  // ];
  const [events, setEvents] = useState([]);

  const handleDatesSet = async (dateInfo) => {
    const viewType = dateInfo.view.type; // Detect current view mode (month, week, day)
    // console.log(dateInfo);

    const currentVisibleDate = dateInfo.view.calendar.getDate();

    // Extract month and year
    const visibleMonth = currentVisibleDate.getMonth() + 1; // JS months are 0-based
    const visibleYear = currentVisibleDate.getFullYear();

    if (viewType === 'dayGridMonth') {
      setCurrData({
        month: visibleMonth,
        year: visibleYear,
      }); // Show all events for the month
    } else if (viewType === 'dayGridDay') {
      setCurrData({
        date: currentVisibleDate?.getDate(),
        month: visibleMonth,
        year: visibleYear,
      }); // Day view
    }
  };

  const fetchData = async () => {
    // console.log(currData);
    const response = await eventService.getSchedule(currData);
    // console.log(response);

    setEvents(
      response.map((event) => ({
        id: event?._id,
        title: event.title || 'Untitled Event',
        start: event?.deadline || new Date().toISOString(),
        tasktype: event?.tasktype,
      }))
    );
  };

  useEffect(() => {
    fetchData();
  }, [currData]);
  // console.log(events);

  const handleDateClick = (info) => {
    // console.log(info)
    setSelectedInfo({
      type: 'date',
      date: info.dateStr, //Date String -> dateStr (yyyymmdd)
    });
    setIsCalendarModalOpen(true);
  };

  const handleEventClick = (info) => {
    // console.log(info)
    setSelectedInfo({
      type: 'event',
      title: info.event.title,
      start: info.event.start,
    });

    setIsCalendarModalOpen(true);
    // console.log(selectedInfo);
  };

  // const deleteEvent=()=>{
  // // console.log("delete: ",selectedInfo);
  // }

  return (
    <div className='p-6'>
      <div className='sm:max-w-6xl sm:mx-auto dark:text-white dark:bg-gray-900 shadow-lg rounded-lg p-4'>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          initialView='dayGridMonth'
          events={events}
          eventContent={(info) => <EventItem event={info.event} />}
          eventClick={(info) => handleEventClick(info)}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridDay',
          }}
          displayEventTime={false}
          editable={true}
          selectable={true}
          datesSet={handleDatesSet}
          height='auto'
          dateClick={(info) => handleDateClick(info)}
          dayHeaderClassNames={() =>
            'font-black dark:bg-gray-800 dark:text-white bg-gray-200 text-black'
          }
          dayCellClassNames={() =>
            'font-semibold text-lg dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:hover:text-black bg-white text-black border-gray-300'
          }
        />
        {isCalendarModalOpen && (
          <CalendarModal onClose={() => setIsCalendarModalOpen(false)}>
            {selectedInfo && selectedInfo?.type === 'date' ? (
              <div className='text-center'>
                <h2 className='text-2xl font-semibold mb-4 dark:text-white'>
                  Date Selected:{' '}
                  {new Date(selectedInfo.date).toLocaleDateString()}
                </h2>
                <button
                  className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
                  onClick={() => navigate('/events')}
                >
                  Create Event
                </button>
              </div>
            ) : (
              <div className='text-center'>
                <h2 className='text-2xl font-semibold mb-2 dark:text-white'>
                  Event: {selectedInfo.title}
                </h2>
                <p className='text-gray-600 mb-4 dark:text-gray-400'>
                  On: {new Date(selectedInfo.start).toLocaleDateString()}
                </p>
                {/* <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={deleteEvent}
              >
                Delete Event
              </button> */}
              </div>
            )}
          </CalendarModal>
        )}
      </div>
    </div>
  );
};

export default Calender;
