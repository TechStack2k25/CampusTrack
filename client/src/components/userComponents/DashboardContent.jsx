import React from 'react';
import { Link } from 'react-router-dom';

const DashboardContent = () => {
  return (
    <main className="flex-1 bg-gray-100 p-6">
      <h2 className="text-center text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Cards for each feature */}
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-semibold">Courses</h3>
          <p className="text-sm text-gray-600">View your active and completed courses.</p>
          <Link to={'/courses'} className="text-blue-500 text-sm mt-2 inline-block">View More</Link>
        </div>
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-semibold">Assignments</h3>
          <p className="text-sm text-gray-600">Check pending and submitted assignments.</p>
          <Link to={'/assignments'} className="text-blue-500 text-sm mt-2 inline-block">View More</Link>
        </div>
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-semibold">Event Schedules</h3>
          <p className="text-sm text-gray-600">Keep track of upcoming events.</p>
          <Link to={'/events'} className="text-blue-500 text-sm mt-2 inline-block">View More</Link>
        </div>
        {/* Add other sections similarly */}
      </div>
    </main>
  );
};

export default DashboardContent;
