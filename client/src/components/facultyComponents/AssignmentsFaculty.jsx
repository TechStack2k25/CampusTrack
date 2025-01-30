import React, { useState } from "react";
import { useForm } from "react-hook-form";

const AssignmentsFaculty = () => {
  const { register, handleSubmit, reset } = useForm();
  const [assignments, setAssignments] = useState([]);

  // Function to add a new assignment
  const addAssignment = (data) => {
    const newAssignment = {
      id: assignments.length + 1,
      title: data.title,
      deadline: data.deadline,
      course: data.course,
      semester: data.semester,
    };
    setAssignments([...assignments, newAssignment]);
    reset(); // Reset the form fields
  };

  // Function to remove an assignment
  const removeAssignment = (id) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl text-center font-bold mb-4">Assignments</h1>

      {/* Assignment Form */}
      <form
        onSubmit={handleSubmit(addAssignment)}
        className="bg-white p-4 shadow rounded mb-4"
      >
        <div className="mb-2">
          <label className="block font-medium mb-1">Assignment Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-1">Deadline</label>
          <input
            type="date"
            {...register("deadline", { required: "Deadline is required" })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-1">Course</label>
          <select
            {...register("course", { required: "Course is required" })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Course</option>
            <option value="IT">IT</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-1">Semester</label>
          <select
            {...register("semester", { required: "Semester is required" })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Semester</option>
            <option value="Sem1">Semester 1</option>
            <option value="Sem2">Semester 2</option>
            <option value="Sem3">Semester 3</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Assignment
        </button>
      </form>

      {/* Assignment List */}
      <div>
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white p-4 shadow rounded mb-2 flex justify-between items-center"
          >
            <p>
              <strong>{assignment.title}</strong> - Due by {assignment.deadline} 
              <br />
              <span className="text-sm">Course: {assignment.course}, Semester: {assignment.semester}</span>
            </p>
            <button
              onClick={() => removeAssignment(assignment.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsFaculty;
