import React from "react";

const EventCard = ({ event, isUpcoming }) => {
  return (
    <div
      className={`p-4 border rounded-lg shadow-md ${
        isUpcoming ? "bg-green-50 border-green-300" : "bg-gray-100 border-gray-300"
      }`}
    >
      <h2 className="text-xl font-bold text-gray-800">{event?.title}</h2>
      <p className="text-gray-600">
        <strong>Date:</strong> {new Date(event.deadline).toLocaleDateString()}
      </p>
      <p className="text-gray-600">{event?.description}</p>
    </div>
  );
};

export default EventCard;
