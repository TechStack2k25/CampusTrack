import React, { useState } from "react";
import { useForm } from "react-hook-form";

const AssignmentsSubmission = () => {
  const { register, handleSubmit, reset } = useForm();
  const [assignments, setAssignments] = useState([
    { id: 1, title: "Assignment 1", deadline: "2025-01-20", course: "IT", semester: "Sem1", submissions: {} },
    { id: 2, title: "Assignment 2", deadline: "2025-02-15", course: "CSE", semester: "Sem2", submissions: {} },
    { id: 3, title: "Project Assignment", deadline: "2025-03-01", course: "IT", semester: "Sem1", submissions: {} },
  ]);
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ]);
  const [filteredAssignments, setFilteredAssignments] = useState(assignments);

  // Function to filter assignments based on selected fields
  const filterAssignments = (data) => {
    const { course, semester, student, title } = data;

    const filtered = assignments.filter((assignment) => {
      const courseMatch = course ? assignment.course === course : true;
      const semesterMatch = semester ? assignment.semester === semester : true;
      const studentMatch = student ? assignment.submissions[student] !== undefined : true;
      const titleMatch = title ? assignment.title.toLowerCase().includes(title.toLowerCase()) : true;
      return courseMatch && semesterMatch && studentMatch && titleMatch;
    });
    setFilteredAssignments(filtered);
  };

  // Function to mark assignment submission
  const markSubmission = (assignmentId, studentId, status) => {
    //  
    console.log(assignments);
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl text-center font-bold mb-4">Assignment Submissions</h1>

      {/* Filter Form */}
      <form onSubmit={handleSubmit(filterAssignments)} className="bg-white p-4 shadow rounded mb-4">
        <div className="mb-2">
          <label className="block font-medium mb-1">Course</label>
          <select {...register("course")} className="w-full px-3 py-2 border rounded">
            <option value="">Select Course</option>
            <option value="IT">IT</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-1">Semester</label>
          <select {...register("semester")} className="w-full px-3 py-2 border rounded">
            <option value="">Select Semester</option>
            <option value="Sem1">Semester 1</option>
            <option value="Sem2">Semester 2</option>
            <option value="Sem3">Semester 3</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-1">Student</label>
          <select {...register("student")} className="w-full px-3 py-2 border rounded">
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-1">Assignment Title</label>
          <input
            type="text"
            {...register("title")}
            placeholder="Search by assignment title"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Filter Assignments
        </button>
      </form>

      {/* Filtered Assignment List */}
      <div>
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white p-4 shadow rounded mb-2 flex flex-col"
          >
            <h2 className="text-lg font-medium">{assignment.title}</h2>
            <div className="flex justify-between sm:grid sm:grid-cols-2 sm:space-x-4">
                <p>Due by {assignment.deadline}</p>
                <p>Course: {assignment.course}, Semester: {assignment.semester}</p>
            </div>

            <div className="mt-4">
              {students.map((student) => (
                <div key={student.id} className="flex justify-between items-center mb-2">
                  <p>{student.name}</p>
                  <div className="space-x-2">
                    <button
                      onClick={() => markSubmission(assignment.id, student.id, "submitted")}
                      className={`px-4 py-2 rounded ${
                        assignment.submissions[student.id] === "submitted"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {assignment.submissions[student.id] === "submitted"
                          ? "Submitted"
                          : "Submit"
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsSubmission;
