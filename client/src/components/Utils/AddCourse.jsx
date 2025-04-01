import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const AddCourse = ({ addCourse, data, setData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    // Add the new event 
    addCourse(data);
    reset();
  };

  useEffect(()=>{
    if(data){
      reset(data);
      setData(data);
    }
  },[reset, data]);

  return (
    <div className="relative mb-8 max-w-md mx-auto border dark:border-gray-700 p-6 rounded-md shadow-md ">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">
        New Course
      </h2>
      {data && <div onClick={()=>{
        setData(null);
        reset();
      }} className="absolute cursor-pointer top-6 right-8 text-white bg-blue-500 hover:bg-blue-700 font-medium text-2xl h-8 text-center aspect-square rounded-lg">
        X
      </div>}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 tracking-tight">Name:</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Enter course name"
            {...register("name", { required: "Course Name is required" })}
          />
          {errors?.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 tracking-tight">Code:</label>
          <input
            type="text"
            placeholder="Enter course code"
            className="w-full mt-1 p-2 border rounded-md"
            {...register("coursecode", { required: "Course code is required" })}
          />
          {errors?.coursecode && (
            <p className="text-red-500 text-sm">{errors.coursecode.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 tracking-tight">Credit: </label>
          <input
            type="number"
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Enter Credits"
            {...register("credit",{
                required: "credit is required!",
                min: { value: 2, message: "Minimum 2 credit allowed!" },
                max: { value: 5, message: "Maximum credit 5 allowed!" }
            })}
          />
          {errors.credit && (
            <p className="text-red-500 text-sm">{errors.credit.message}</p>
          )}
        </div>
        {/* may take a teacher/faculty username */}


        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          {data?._id?"Update":"Add"} Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
