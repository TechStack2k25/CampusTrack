import React from "react";
import { useForm } from "react-hook-form";
import { useCourses } from "../../data/courses.js";

const AddAssignment = ({ addTask, openForm, setOpenForm }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    addTask(data);
    reset();
  };

  const { data: allCourses } = useCourses();

  return (
    <div className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl border dark:border-gray-700 transition-all">
      {openForm && (
        <div
          onClick={() => setOpenForm(false)}
          className="absolute top-4 right-5 cursor-pointer text-indigo-500 font-black hover:text-indigo-600 w-8 h-8 rounded-xl flex items-center justify-center text-lg transition"
        >
          ✕
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="block font-medium mb-1 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Assignment title"
          />
          {errors?.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1 dark:text-gray-300">
            Deadline
          </label>
          <input
            type="date"
            {...register("deadline", { required: "Deadline is required!" })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          {errors?.deadline && (
            <p className="text-red-500 text-sm mt-1">
              {errors.deadline.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1 dark:text-gray-300">
            Course
          </label>
          <select
            {...register("id", { required: "Course selection is required!" })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Course...</option>
            {allCourses &&
              allCourses.map((course) => (
                <option key={course?._id} value={course?._id}>
                  {`${course?.name} (${course?.coursecode?.toUpperCase()})`}
                </option>
              ))}
          </select>
          {errors.id && (
            <p className="text-red-500 text-sm mt-1">{errors.id.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1 dark:text-gray-300">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Enter a brief description..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          ></textarea>
        </div>

        <button
          type="submit"
          className="mt-2 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 shadow-md transition"
        >
          Add Assignment
        </button>
      </form>
    </div>
  );
};

export default AddAssignment;
