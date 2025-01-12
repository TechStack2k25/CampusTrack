import React, { useState } from "react";
import { EventCard, AddEvents } from "../Utils/index.js";
import { events } from "../../data/events.js";

const Events = () => {
  const [filter, setFilter] = useState("upcoming");
  const [openForm,setOpenForm]=useState(false);

  const currentDate = new Date();

  const filteredEvents = events.filter((event) =>
    filter === "upcoming"
      ? new Date(event.date) >= currentDate
      : new Date(event.date) < currentDate
  );

  const addEvent = (newEvent) => {
    console.log(newEvent);
  };

  return (
    <div className="flex-1 bg-gray-100 min-h-screen sm:py-4">
        {openForm && <AddEvents addEvent={addEvent} openForm={openForm} setOpenForm={setOpenForm} />}
    <div className="container mx-auto p-6">
      <h1 className="text-2xl text-center font-bold text-gray-800 mb-6">My Events</h1>

      <div className="flex justify-center mb-6 space-x-4 flex-wrap">
        <button
          className={`px-4 py-2 rounded ${
            filter === "upcoming"
              ? "bg-green-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming Events
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "past"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setFilter("past")}
        >
          Past Events
        </button>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isUpcoming={filter === "upcoming"}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No events to display.</p>
      )}
    </div>
    {!openForm && <div onClick={()=>setOpenForm(true)} className="cursor-pointer fixed bottom-8 right-8 text-white  font-bold text-4xl bg-blue-500 hover:bg-blue-700 h-12 text-center aspect-square rounded-xl">
        +
    </div>}
    </div>
  );
};

export default Events;
