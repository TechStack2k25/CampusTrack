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
    // Add the new event 
    addTask(data);
    reset();
  };

  
  const { data: allCourses } = useCourses();

  return (
    <div className="relative max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
      {openForm && <div onClick={()=>setOpenForm(false)} className="absolute cursor-pointer top-6 right-8 hover:text-gray-900 text-white bg-blue-500 font-medium text-2xl hover:bg-gray-100 h-8 text-center aspect-square rounded-lg">
        X
      </div>}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-4 shadow rounded mb-4"
      >
        <div className="mb-2">
          <label className="block font-medium mb-1">Title:</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors?.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="block font-medium mb-1">Deadline</label>
          <input
            type="date"
            {...register("deadline", { required: "Deadline is required!" })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors?.deadline && (
            <p className="text-red-500 text-sm">{errors.deadline.message}</p>
          )}
        </div>

        <div className="flex flex-col">
              <label htmlFor="course" className="text-sm font-medium text-gray-600">
                Course:
              </label>
              <select
                id="course"
                {...register("id", { required: "Course selection is required!"})}
                className={`cursor-pointer mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.course_id ? "border-red-500" : "border-gray-300"} focus:ring-blue-500`}
              >
                <option value="">Select a Course...</option>
                {allCourses && allCourses?.map((course)=><option key={course?._id} value={course?._id}>{`${course?.name} (${course?.coursecode?.toUpperCase()})`}</option>)}
                
              </select>
              {errors.id && (
                <p className="text-xs text-red-500 mt-1">{errors.id.message}</p>
              )}
            </div>
        
        <div className="mb-2">
          <label className="block font-medium mb-1">Sem:</label>
          <input
            type="number"
            {...register("sem")}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description:</label>
          <textarea
            {...register("description")}
            className="w-full px-3 py-2 border rounded"
            placeholder="Write your notification..."
          ></textarea>
        </div>

        <div className="mb-2">
          <label className="block font-medium mb-1">Reward Points:</label>
          <input
            type="number"
            {...register("reward_point",{required:"Rewards required!"})}
            className="w-full px-3 py-2 border rounded"
          />
          {errors?.reward_point && (
            <p className="text-red-500 text-sm">{errors.reward_point.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="mx-auto block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Assignment
        </button>
      </form>
    </div>
  );
};

export default AddAssignment;
