import React from "react";

const coursesAttendance = [
  { name: "Mathematics", attendance: 85 },
  { name: "Physics", attendance: 72 },
  { name: "Chemistry", attendance: 65 },
  { name: "Biology", attendance: 45 },
];

const AttendanceOverview = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Overview</h2>
      <div className="space-y-4">
        {coursesAttendance.map((course, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">{course.name}</span>
            <div className="flex-1 mx-4 bg-gray-200 rounded-lg h-4">
              <div
                className={`h-4 rounded-lg ${
                  course.attendance >= 75
                    ? "bg-green-500"
                    : course.attendance >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${course.attendance}%` }}
              ></div>
            </div>
            <span className="text-gray-700 font-medium">{course.attendance}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceOverview;
