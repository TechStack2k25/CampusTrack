import React from "react";
import { upcomingLectures } from '../../data/lectures.js'
const UpcomingLectures = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <ul className="divide-y divide-gray-200">
        {upcomingLectures.map((lecture, index) => (
          <li key={index} className="py-4">
            <div className="flex justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-800">{lecture.course}</p>
                <p className="text-gray-500">Instructor: {lecture.instructor}</p>
              </div>
              <div>
                <p className="text-gray-700">{lecture.date}</p>
                <p className="text-gray-500">{lecture.time}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingLectures;
