import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { challenges } from '../../data/challenges.js';
import AllAttendance from '../Utils/AllAttendance.jsx';
import { useSelector } from 'react-redux';
import { userService } from '../../api/userService.js';
import { Table } from '../Utils';
import EmptyDashboard from '../Utils/EmptyDashboard.jsx';
import {
  FiLayers,
  FiSend,
  FiHome,
  FiFileText,
  FiUploadCloud,
  FiBookOpen,
  FiCalendar,
  FiMessageCircle,
} from 'react-icons/fi';

const studentFeatures = [
  {
    title: 'Request New Courses',
    description:
      "Can’t find your desired course? Submit a request and get notified when it's added.",
    icon: <FiFileText className='text-indigo-600 text-3xl' />,
  },
  {
    title: 'Upload Assignments',
    description:
      'Easily upload your assignments before the deadline and get submission updates.',
    icon: <FiUploadCloud className='text-emerald-600 text-3xl' />,
  },
  {
    title: 'Access Study Materials',
    description:
      'View lecture notes, PDFs, and resources shared by your faculty in one place.',
    icon: <FiBookOpen className='text-blue-600 text-3xl' />,
  },
  {
    title: 'Track Event Calendar',
    description:
      'Stay updated with upcoming events, webinars, exams, and important dates.',
    icon: <FiCalendar className='text-yellow-500 text-3xl' />,
  },
];

const userFeatures = [
  {
    title: 'Manage your Events',
    description: 'Add important events and schedule accordingly.',
    icon: <FiLayers className='text-green-600 text-3xl' />,
  },
  {
    title: 'Request to Join College',
    description:
      'Find your college with its ID and request to become a verified member of its network.',
    icon: <FiSend className='text-orange-500 text-3xl' />,
  },
  {
    title: 'Set Up Your Own College',
    description:
      'Want to set-up college? Send a request to add and manage your own college space.',
    icon: <FiHome className='text-pink-600 text-3xl' />,
  },
];
const eventColumns = [
  {
    name: 'Activity',
    id: 'title',
  },
  {
    name: 'Date',
    id: 'deadline',
    type: 'date',
  },
  {
    name: 'Description',
    id: 'description',
  },
];

const DashboardContent = () => {
  const { name, role } = useSelector((state) => state.user.user);
  const [userDashboard, setUserDashboard] = useState({});

  const fetchData = async () => {
    try {
      const res = await userService.userDashData();
      setUserDashboard(res);
    } catch (error) {
      // console.log(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="flex-1 p-6 dark:bg-transparent bg-gray-50 min-h-screen">
      <h2 className="text-center text-3xl font-bold mb-10 text-indigo-700 dark:text-indigo-400 dark:shadow-sm">
        Welcome {name ? `! ${name}` : "to Your Dashboard"} 🚀
      </h2>

      {role === 'Student' && (
        <div>
          <AllAttendance />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[{
              title: "Courses",
              desc: "View your active and completed courses.",
              link: "/courses",
            }, {
              title: "Assignments",
              desc: "Check pending and submitted assignments.",
              link: "/assignments",
            }, {
              title: "Event Schedules",
              desc: "Keep track of upcoming events.",
              link: "/events",
            }].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 border dark:border-gray-700 border-gray-200 shadow-md rounded-xl p-6 transition hover:shadow-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                <Link to={item.link} className="text-blue-600 dark:text-blue-400 text-sm mt-3 inline-block hover:underline">View More</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {userDashboard?.recent_event?.length > 0 ? (
        <div className="mt-12">
          <Table title="Recent Events" data={userDashboard?.recent_event} columns={eventColumns} link="/events" />
        </div>
      ) : (
        <EmptyDashboard features={role === 'User' ? userFeatures : studentFeatures} />
      )}
      {/* <><div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Ongoing Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white shadow-md rounded-lg p-6 border-gray-200 dark:bg-gray-900 dark:border-gray-700 border"
            >
              <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">{challenge.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Deadline: {challenge.deadline}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${challenge.progress}%` }}
                ></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Progress: {challenge.progress}%
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Goal Tracker</h2>
        <div className="bg-white shadow-md rounded-lg p-6 border-gray-200 dark:bg-gray-900 dark:border-gray-700 border">
          <p className="text-gray-600 dark:text-white">
            <strong>Weekly Goal:</strong> Complete 2 challenges
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: "50%" }}
            ></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Progress: 50%</p>
        </div>
      </div>
      </> */}
    </main>
  );
};

export default DashboardContent;