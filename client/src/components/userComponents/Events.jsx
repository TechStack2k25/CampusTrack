import React, { useState } from "react";
import { EventCard, AddEvents } from "../Utils/index.js";
import { useEvents } from "../../data/events.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "../../api/eventService.js";
import { setSuccess, setError } from "../../store/slices/userSlice.js";
import { useDispatch } from "react-redux";

const Events = () => {
  const [filter, setFilter] = useState("upcoming");
  const [openForm, setOpenForm] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const currentDate = new Date();
  const { data: events } = useEvents();

  // Filter events based on deadline
  const filteredEvents = events
    ? events.filter((event) => {
        const eventDate = new Date(event?.deadline);
        return filter === "upcoming"
          ? eventDate >= currentDate
          : eventDate < currentDate;
      })
    : [];

  // Mutation to create event
  const mutationTocreateEvent = useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: (data) => {
      // console.log("Event created successfully:", data);
      dispatch(setSuccess("Event added successfully!"));
      queryClient.invalidateQueries(["allevents"]);
    },
    onError: (error) => {
      dispatch(setError(error?.response?.data?.message));
      // console.error("Error adding event:", error);
    },
  });

  const addEvent = (newEvent) => {
    // console.log(newEvent);
    mutationTocreateEvent.mutate(newEvent);
  };

  return (
    <div className="flex-1 min-h-screen sm:py-4">
      {openForm && (
        <AddEvents
          addEvent={addEvent}
          openForm={openForm}
          setOpenForm={setOpenForm}
        />
      )}

      <div className="container mx-auto p-6">
        <h1 className="text-2xl text-center font-bold text-gray-800 dark:text-white tracking-tight mb-6">
          My Events
        </h1>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-6 space-x-4 flex-wrap">
          <button
            className={`px-4 py-2 rounded ${
              filter === "upcoming"
                ? "bg-green-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-black"
            }`}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-10 py-2 rounded ${
              filter === "past"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-black"
            }`}
            onClick={() => setFilter("past")}
          >
            Past
          </button>
        </div>

        {/* Events List */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isUpcoming={filter === "upcoming"}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center dark:text-gray-400 text-lg font-semibold">
            No events to display.
          </p>
        )}
      </div>

      {/* Add Button */}
      {!openForm && (
        <div
        onClick={() => setOpenForm(true)}
        className="animate-bounce cursor-pointer fixed bottom-8 right-8 text-4xl bg-blue-500 hover:bg-blue-700 flex justify-center items-center h-12 aspect-square rounded-full shadow-2xl shadow-blue-500/50 hover:shadow-blue-500"
      >
        <span className=" text-white font-bold text-center">+</span>
      </div>
      )}
    </div>
  );
};

export default Events;
