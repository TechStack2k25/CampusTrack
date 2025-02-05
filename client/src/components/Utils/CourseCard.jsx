import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const CourseCard = ({ course ,deletefn ,updatefn }) => {
  const { role } =useSelector((state)=>state.user.user);
  const navigate=useNavigate();

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <div className="flex justify-between px-1 cursor-pointer" onClick={()=>role==='faculty' && navigate(course?._id)}>
      <h2 className="text-xl font-bold text-gray-800">{course.name}</h2>
      <strong  className="text-gray-600">{course?.coursecode?.toUpperCase()}</strong>
      </div>
      <div>
        <p className="text-gray-600"><strong>Instructor:</strong> {course?.teacher?.name || course?.teacher?.email?.split('@')[0] || "Not assigned!"}</p>
        <p className="text-gray-600"><strong>Credits:</strong> {course.credit}</p>
      </div>
        {role && role==='HOD' && <div className="flex justify-end space-x-4">
          <button
            onClick={() => updatefn({...course,coursecode:course.coursecode?.toUpperCase()})}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          >
           <FaEdit />
          </button>

          <button
            onClick={() => deletefn(course?._id)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
          >
           <FaTrashAlt />
          </button>
        </div>}
    </div>
  );
};

export default CourseCard;
