import React from "react";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-bold text-gray-800">{course.name}</h2>
      <div >
        <p className="text-gray-600"><strong>Instructor:</strong> {course.instructor}</p>
        <p className="text-gray-600"><strong>Credits:</strong> {course.credits}</p>
        <p className="text-gray-600"><strong>Schedule:</strong> {course.schedule}</p>
      </div>
    </div>
  );
};

export default CourseCard;
