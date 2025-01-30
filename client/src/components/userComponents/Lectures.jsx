import React from "react";
import { AttendanceOverview, AttendanceRecords, UpcomingLectures } from "../Utils/index";


const Lectures = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
          Lectures Summary
        </h1>

        {/* Attendance Overview */}
        <AttendanceOverview />

        {/* Upcoming Lectures */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upcoming Lectures
          </h2>
          <UpcomingLectures />
        </div>

        {/* Past Attendance Records */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Attendance Records
          </h2>
          <AttendanceRecords />
        </div>
      </div>
    </div>
  );
};

export default Lectures;
