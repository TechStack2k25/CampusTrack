import React from "react";

const DashboardFacultyContent = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <h2 className="text-center text-2xl font-bold mb-8">Welcome to Your Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold text-lg">Upcoming Classes</h2>
          <p className="text-gray-600 mt-2">You have 3 classes today.</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold text-lg">Recent Announcements</h2>
          <p className="text-gray-600 mt-2">No new announcements.</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold text-lg">Pending Tasks</h2>
          <p className="text-gray-600 mt-2">Grade 2 assignments.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardFacultyContent;
