import React from "react";

const EventCard = ({ event, isUpcoming }) => {
  const eventDate = new Date(event?.deadline).toLocaleDateString();

  return (
    <div
      className={`p-5 rounded-2xl shadow-md border transition-all hover:shadow-xl hover:scale-[1.02] duration-200 ease-in-out ${
        isUpcoming
          ? "bg-green-50 border-green-300 dark:bg-green-100/10 dark:border-green-500"
          : "bg-blue-50 border-blue-300 dark:bg-blue-100/10 dark:border-blue-400"
      }`}
    >
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white tracking-tight">
        {event?.title}
      </h2>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
        <span className="font-medium">Date:</span> {eventDate}
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        {event?.description}
      </p>
    </div>
  );
};

export default EventCard;
