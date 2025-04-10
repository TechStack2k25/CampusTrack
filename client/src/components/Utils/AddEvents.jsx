import React from "react";
import { useForm } from "react-hook-form";

const AddEvent = ({ addEvent, openForm, setOpenForm }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    addEvent(data);
    reset();
    setOpenForm(false); // optional: close after submission
  };

  return (
    <div className="relative max-w-lg w-full mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 sm:p-8 rounded-2xl shadow-2xl transition-all">
      {/* Close Button */}
      {openForm && (
        <button
          onClick={() => setOpenForm(false)}
          className="absolute top-4 right-4 text-gray-600  hover:text-red-500 font-black dark:text-gray-300 dark:hover:text-red-400 transition"
        >
          X
        </button>
      )}

      {/* Heading */}
      <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
        New Event
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Event Title
          </label>
          <input
            type="text"
            placeholder="Hackathon, Workshop..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("title", { required: "Event title is required" })}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Event Date
          </label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("date", { required: "Event date is required" })}
          />
          {errors.date && (
            <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Event Description
          </label>
          <textarea
            placeholder="Briefly describe the event (max 100 characters)"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("description", {
              required: "Event description is required",
              maxLength: {
                value: 100,
                message: "Maximum 100 characters allowed!",
              },
            })}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300"
        >
          Add Event
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
