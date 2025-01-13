import React from 'react';
import { Link } from 'react-router-dom';
import { challenges } from '../../data/challenges.js'

const DashboardContent = () => {
  return (
    <main className="flex-1 p-6">
      <h2 className="text-center text-2xl font-bold mb-8">Welcome to Your Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Cards for each feature */}
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-semibold">Courses</h3>
          <p className="text-sm text-gray-600">View your active and completed courses.</p>
          <Link to={'/courses'} className="text-blue-500 text-sm mt-2 inline-block hover:underline ">View More</Link>
        </div>
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-semibold">Assignments</h3>
          <p className="text-sm text-gray-600">Check pending and submitted assignments.</p>
          <Link to={'/assignments'} className="text-blue-500 text-sm mt-2 inline-block hover:underline ">View More</Link>
        </div>
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-semibold">Event Schedules</h3>
          <p className="text-sm text-gray-600">Keep track of upcoming events.</p>
          <Link to={'/events'} className="text-blue-500 text-sm mt-2 inline-block hover:underline ">View More</Link>
        </div>
      </div>
      <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ongoing Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white shadow-md rounded-lg p-6"
              >
                <h3 className="text-lg font-bold">{challenge.title}</h3>
                <p className="text-gray-600 mt-2">
                  Deadline: {challenge.deadline}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
                <p className="text-gray-500 mt-2">
                  Progress: {challenge.progress}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Goal Tracker */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Goal Tracker</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-600">
              <strong>Weekly Goal:</strong> Complete 2 challenges
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
            <p className="text-gray-500 mt-2">Progress: 50%</p>
          </div>
        </div>
    </main>
  );
};

export default DashboardContent;
