import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Departments = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: "Computer Science", description: "CS Department" },
    { id: 2, name: "Electrical Engineering", description: "EE Department" },
    { id: 3, name: "Mechanical Engineering", description: "ME Department" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const addDepartment = (data) => {
    console.log(data);
    //adding or saving data
    reset(); // Reset form fields
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="flex-1 relative p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Departments</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 font-black text-xl"
        >
          + 
        </button>
      </div>

      {/* Departments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-gray-700">
              {dept.name}
            </h2>
            <p className="text-sm text-gray-500">{dept.description}</p>
          </div>
        ))}
      </div>

      {/* Modal for Adding Department */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Add Department
            </h2>
            <form onSubmit={handleSubmit(addDepartment)}>
              {/* Department Name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-600"
                >
                  Department Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  className={`w-full px-4 py-2 border rounded ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Department Description */}
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-600"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className={`w-full px-4 py-2 border rounded ${
                    errors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                ></textarea>
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
