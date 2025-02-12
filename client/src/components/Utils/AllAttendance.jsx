import React, { useEffect, useState } from "react";
import { attendanceService } from "../../api/attendanceService";

const AllAttendance = () => {
    const [courses,setCourses]=useState([]);
    const fetchData=async()=>{
        try {
            const res= await attendanceService.studentCoursesAttendance();
            setCourses(res);
        } catch (error) {
            console.log("allAttendance:",error);
        }
    }
    console.log(courses);
    
    useEffect(()=>{
        fetchData();
    },[]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {courses.length > 0 ? (
        courses.map((course) => {
          const attendanceRate = Math.round((course.present / course.total) * 100);

          return (
            <div key={course?._id || course?.name} className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-blue-600">{course.name}</h3>
                <span className="text-gray-500 text-sm">{new Date().toLocaleDateString()}</span>
              </div>

              <p className="text-gray-700 text-sm mb-2">
                {course.present} / {course.total}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className={`h-2 rounded-full ${
                    attendanceRate > 75 ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{ width: `${attendanceRate}%` }}
                ></div>
              </div>

              <p className={`text-sm font-medium mt-2 ${attendanceRate > 75 ? "text-green-600" : "text-red-500"}`}>
                {attendanceRate > 75 ? "Good Attendance" : "Needs Improvement"}
              </p>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-center w-full">No course attendance data available.</p>
      )}
    </div>
  );
};

export default AllAttendance;