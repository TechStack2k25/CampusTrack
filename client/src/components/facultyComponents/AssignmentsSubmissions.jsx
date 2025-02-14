import React, { useState } from "react";
import { FaFilePdf, FaDownload, FaUpload } from "react-icons/fa"; // Icons for file UI
import { useCourses } from '../../data/courses.js'
import { useCoursesAssignments } from "../../data/courseAssignments.js";

const AssignmentsSubmission = () => {

  const [course, setCourse] = useState('');

  const { data: courses } = useCourses();

  const { data: coursesAssignments } = useCoursesAssignments(course);
  const assignments = coursesAssignments?.alltasks;
  console.log(assignments);


  return (
    <div className="flex-1 p-6 min-h-screen">
      <h1 className="text-3xl text-center font-bold mb-6 text-blue-600">📚 Assignment Submissions</h1>

      {/* Filter Form */}
      <div className="p-6 shadow-lg rounded mb-6 max-w-md mx-auto border dark:border-gray-700 dark:bg-black dark:bg-opacity-15">
          <div className="mb-2">
            <label className="block font-medium mb-1 tracking-tight dark:text-gray-400">Course:</label>
            <select onChange={(e) => setCourse(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-200 dark:text-gray-700">
              <option value="">Select a Course...</option>
              {courses && courses?.length > 0 && courses.map((item) =>
                <option key={item?._id} value={item?._id}>{item?.name}</option>)}
            </select>
          </div>
      </div>

      {/* Filtered Assignment List */}
      <div>
        {assignments && assignments?.length > 0 && assignments.map((data) => {
          const assignment=data?.task;
          const students = (data?.task_users || []).filter(Boolean);
          return <div key={assignment?._id} className="bg-white dark:bg-black dark:bg-opacity-20 p-6 shadow-lg rounded-lg mb-6 border dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200"><span className="text-gray-600 dark:text-gray-400 font-semibold tracking-tight">Title: </span>{assignment.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">Due by: <span className="font-semibold">{new Date(assignment.deadline)?.toLocaleDateString()}</span></p>
            <div className=" mt-2 mb-4 border dark:border-gray-700"/>
            { students?.length > 0 ?
              <div className="mt-6">
                {students.map((student) => {
                  console.log(student);

                  return <div key={student?._id + assignment?._id} className="flex justify-between items-center p-2 mb-4">
                    <p className=" dark:text-gray-200 text-lg font-semibold">{student?.name || student?.email.split('@')[0]}</p>


                    {/* Show File if Uploaded */}
                    {student?.file && student.file.length > 0 && <a
                      href={student.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 mx-2 rounded-lg font-semibold transition duration-300 
                    bg-blue-500 text-white shadow-md hover:bg-blue-600 
                    dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      {/* 📄 View Submission */}
                      <span className="flex items-center gap-2"><FaFilePdf className="text-red-500" />View Submission </span>
                    </a>}
                  </div>
                })}
              </div> :
              <p className="text-center text-gray-600 dark:text-white font-semibold my-2">No Submissions yet!</p>
            }
          </div>
        })}
      </div>
    </div>
  );
};

export default AssignmentsSubmission;
