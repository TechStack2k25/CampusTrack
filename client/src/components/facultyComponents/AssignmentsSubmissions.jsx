import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaFilePdf, FaDownload, FaUpload } from "react-icons/fa"; // Icons for file UI

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

  // Filter Assignments
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

  // Handle File Upload
  const handleFileUpload = (assignmentId, studentId, file) => {
    if (!file) return;
    
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment.id === assignmentId
          ? {
              ...assignment,
              submissions: {
                ...assignment.submissions,
                [studentId]: file,
              },
            }
          : assignment
      )
    );
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl text-center font-bold mb-6 text-blue-600">📚 Assignment Submissions</h1>

      {/* Filter Form */}
      <form onSubmit={handleSubmit(filterAssignments)} className="bg-white p-6 shadow-lg rounded mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block font-medium mb-1">Course</label>
            <select {...register("course")} className="w-full px-3 py-2 border rounded">
              <option value="">All Courses</option>
              <option value="IT">IT</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Semester</label>
            <select {...register("semester")} className="w-full px-3 py-2 border rounded">
              <option value="">All Semesters</option>
              <option value="Sem1">Semester 1</option>
              <option value="Sem2">Semester 2</option>
              <option value="Sem3">Semester 3</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Student</label>
            <select {...register("student")} className="w-full px-3 py-2 border rounded">
              <option value="">All Students</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Assignment Title</label>
            <input
              type="text"
              {...register("title")}
              placeholder="Search by assignment title"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          🔍 Filter Assignments
        </button>
      </form>

      {/* Filtered Assignment List */}
      <div>
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="bg-white p-6 shadow-lg rounded-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800">{assignment.title}</h2>
            <p className="text-gray-600">Due by: <span className="font-semibold">{assignment.deadline}</span></p>
            <p className="text-gray-600">Course: <span className="font-semibold">{assignment.course}</span>, Semester: <span className="font-semibold">{assignment.semester}</span></p>

            <div className="mt-6">
              {students.map((student) => (
                <div key={student.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-medium">{student.name}</p>

                  <div className="flex items-center space-x-4">
                    {/* File Upload */}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(assignment.id, student.id, e.target.files[0])}
                      className="hidden"
                      id={`upload-${assignment.id}-${student.id}`}
                    />

                    {/* Show File if Uploaded */}
                    {assignment.submissions[student.id] && (
                      <a
                        href={URL.createObjectURL(assignment.submissions[student.id])}
                        download={assignment.submissions[student.id].name}
                        className="text-green-600 flex items-center space-x-2"
                      >
                        <FaFilePdf className="text-red-500" />
                        <span>{assignment.submissions[student.id].name}</span>
                        <FaDownload />
                      </a>
                    )}
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
