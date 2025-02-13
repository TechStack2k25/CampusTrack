import React, { useState } from "react";
import { FaFilePdf, FaDownload, FaUpload } from "react-icons/fa"; // Icons for file UI
import { useCourses } from '../../data/courses.js'
import { useCoursesAssignments } from "../../data/courseAssignments.js";

const AssignmentsSubmission = () => {

  const [course, setCourse] = useState('');

  const { data: courses } = useCourses();

  const {data: assignments} =useCoursesAssignments(course);
  console.log(assignments);
  

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl text-center font-bold mb-6 text-blue-600">📚 Assignment Submissions</h1>

      {/* Filter Form */}
      <div className="bg-white p-6 shadow-lg rounded mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block font-medium mb-1">Course:</label>
            <select onChange={(e) => setCourse(e.target.value)} className="w-full px-3 py-2 border rounded">
              <option value="">Select a Course...</option>
              {courses && courses?.length > 0 && courses.map((item) =>
                <option key={item?._id} value={item?._id}>{item?.name}</option>)}
            </select>
          </div>
          {/* <div>
            <label className="block font-medium mb-1">Student</label>
            <select {...register("student")} className="w-full px-3 py-2 border rounded">
              <option value="">All Students</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div> */}
        </div>
        {/* <button type="submit" className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          🔍 Filter Assignments
        </button> */}
      </div>

      {/* Filtered Assignment List */}
      <div>
        {/* {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="bg-white p-6 shadow-lg rounded-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800">{assignment.title}</h2>
            <p className="text-gray-600">Due by: <span className="font-semibold">{assignment.deadline}</span></p>

            <div className="mt-6"> */}
              {assignments && assignments?.length > 0 && assignments.map((assignment) => (
                <div key={assignment?._idid} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-medium">{assignment?.name}</p>


                  {/* Show File if Uploaded */}
                  {assignment?.file && assignment.file.length > 0 && <a
                    href={assignment.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 mx-2 rounded-lg font-semibold transition duration-300 
                    bg-blue-500 text-white shadow-md hover:bg-blue-600 
                    dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {/* 📄 View Submission */}
                    <FaFilePdf className="text-red-500" />
                      <span>View Submission </span>
                      <FaDownload />
                  </a>}
                </div>
              ))}
            {/* </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default AssignmentsSubmission;
