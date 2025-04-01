import React, { useEffect, useState } from "react";
import { attendanceService } from "../../api/attendanceService";

const AllAttendance = () => {
    const [courses, setCourses] = useState([]);

    const fetchData = async () => {
        try {
            const res = await attendanceService.studentCoursesAttendance();
            setCourses(res);
        } catch (error) {
            console.log("allAttendance:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if(courses.length===0) return;

    return (
        <div className="py-6 px-1 rounded-lg shadow mb-4 border border-gray-200 dark:border-gray-700 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Academic Records</h2>
            
            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => {
                        const attendanceRate = course?.total_classes
                            ? Math.round((course.attendance / course.total_classes) * 100)
                            : 0;

                        return (
                            <div key={course?._id || course?.name} className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 border shadow-md rounded-lg p-6 hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold text-blue-600">{course?.name}</h3>
                                    <span className="text-gray-700 text-sm dark:text-gray-400">{course?.attendance} / {course?.total_classes}</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 h-2 rounded-full">
                                    <div
                                        className={`h-2 rounded-full transition-all ${
                                            attendanceRate > 75 ? "bg-green-500" : "bg-red-500"
                                        }`}
                                        style={{ width: `${attendanceRate}%` }}
                                    ></div>
                                </div>

                                {course?.total_classes>0 && <p className={`text-sm font-medium mt-2 ${attendanceRate > 75 ? "text-green-600" : "text-red-500"}`}>
                                    {attendanceRate > 75 ? "Good Attendance!" : "!Needs Improvement"}
                                </p>}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-500 text-center">No course attendance data available.</p>
            )}
        </div>
    );
};

export default AllAttendance;
