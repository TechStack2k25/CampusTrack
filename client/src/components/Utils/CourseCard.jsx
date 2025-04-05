import React, { useState } from "react";
import { FaBookOpen, FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ConfirmModal from "./ConfirmModal";


const CourseCard = ({ course ,deletefn ,updatefn }) => {
  const { role } =useSelector((state)=>state.user.user);
  const navigate=useNavigate();
  const [courseId, setCourseId] = useState(null);

  const handleDelete = (id) => {
      setCourseId(id); // Store the course ID
    };
  
    // Hide the delete modal without performing any action
    const handleCancelDelete = () => {
      setCourseId(null); // Clear the selected course ID
    };
  
    // Confirm deletion and perform the delete action
    const handleConfirmDelete = async() => {
      deletefn(courseId);
      setCourseId(null);
      return null;
    };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 border-gray-200 dark:bg-gray-900 dark:border-gray-700 border">
      <div className="flex justify-between px-1 cursor-pointer" onClick={()=>role==='faculty' && navigate(course?._id)}>
      <h2 className="text-xl font-bold text-gray-800 tracking-tight dark:text-white">{course.name}</h2>
      <strong  className="text-gray-600 dark:text-white">{course?.coursecode?.toUpperCase()}</strong>
      </div>
      <div className="mt-2">
        <p className="text-gray-600 dark:text-gray-400"><strong>Instructor:</strong> {course?.teacher?.name || course?.teacher?.email?.split('@')[0] || "Not assigned!"}</p>
        <p className="text-gray-600 dark:text-gray-400"><strong>Credits:</strong> {course.credit}</p>
        {['faculty','Student'].includes(role) && <p 
            onClick={()=>navigate(`/study/${course?._id}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-all duration-200 cursor-pointer"
          >
            <FaBookOpen className="text-lg" /> Study Materials
          </p>}
      </div>
        {role && role==='HOD' && <div className="flex justify-end space-x-4">
          {updatefn && <button
            onClick={() => updatefn({...course,coursecode:course.coursecode?.toUpperCase()})}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          >
           <FaEdit />
          </button>}

          <button
            onClick={() => handleDelete(course?._id)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
          >
           <FaTrashAlt />
          </button>
        </div>}
        {courseId && <ConfirmModal 
          heading={"Are you sure?"}
          text={'This action cannot be undone. Do you want to delete this course?'}
          done={handleConfirmDelete}
          cancel={handleCancelDelete}
          danger={true}
          cancelText={"Cancel"} doneText={"Confirm"}
        />}
    </div>
  );
};

export default CourseCard;
