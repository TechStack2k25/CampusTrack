import React from "react";

const DashboardFacultyContent = () => {
  return (
    <div className="flex-1 p-6 min-h-screen">
      <h2 className="text-center dark:text-white text-2xl font-bold mb-8">Welcome to Your Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded p-4 border-gray-200 dark:bg-gray-900 dark:border-gray-700 border">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Upcoming Classes</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">You have 3 classes today.</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 border-gray-200 dark:bg-gray-900 dark:border-gray-700 border">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Recent Announcements</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">No new announcements.</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 border-gray-200 dark:bg-gray-900 dark:border-gray-700 border">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Pending Tasks</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Grade 2 assignments.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardFacultyContent;
