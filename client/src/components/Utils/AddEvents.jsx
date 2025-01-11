import React from "react";
import { useForm } from "react-hook-form";

const AddEvent = ({ addEvent, openForm, setOpenForm }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Add the new event 
    addEvent(data);
  };

  return (
    <div className="relative max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        New Event
      </h2>
      {openForm && <div onClick={()=>setOpenForm(false)} className="absolute top-6 right-8 hover:text-gray-900 text-white bg-blue-500 font-medium text-2xl hover:bg-gray-100 h-8 text-center aspect-square rounded-lg">
        X
      </div>}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700">Event Title</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Enter event title"
            {...register("title", { required: "Event title is required" })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Event Date</label>
          <input
            type="date"
            className="w-full mt-1 p-2 border rounded-md"
            {...register("date", { required: "Event date is required" })}
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Event Location</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Enter event location"
            {...register("location", { required: "Event location is required" })}
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Event Description</label>
          <textarea
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Enter event description"
            {...register("description", {
              required: "Event description is required",
              maxLength:{
                value:100,
                message:"Maximum 100 characters allowed!",
              }
            })}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>


        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Add Event
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
