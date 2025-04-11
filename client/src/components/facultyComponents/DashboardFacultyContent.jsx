import React, { useEffect, useState } from 'react';
import { userService } from '../../api/userService';
import Table from '../Utils/Table';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const eventColumns = [
  { name: 'Activity', id: 'title' },
  { name: 'Date', id: 'deadline', type: 'date' },
  { name: 'Description', id: 'description' },
];

const DashboardFacultyContent = () => {
  const { role } = useSelector((state) => state.user.user);
  const [userDashboard, setUserDashboard] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await userService.userDashData();
        setUserDashboard(res);
      } catch (error) {
        // console.log(error?.response?.data?.message);
      }
    };
    fetchData();
  }, []);

  const cardsForFaculty = [
    {
      title: 'Courses',
      desc: 'View your active courses.',
      link: '/courses',
    },
    {
      title: 'Assignments',
      desc: 'Check pending and submitted assignments.',
      link: '/assignments',
    },
    {
      title: 'Event Schedules',
      desc: 'Keep track of upcoming events.',
      link: '/events',
    },
  ];

  return (
    <div className="flex-1 p-6 min-h-screen transition-colors duration-300">
      <h2 className="text-center text-2xl font-bold mb-10 text-gray-800 dark:text-white">
        Welcome to Your Dashboard
      </h2>

      {/* HOD Overview Section */}
      {role === 'HOD' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <DashboardStatCard
            title="Total Students"
            value={userDashboard?.total_student_dep || 'No data'}
            color="text-blue-500"
          />
          <DashboardStatCard
            title="Total Faculty"
            value={userDashboard?.total_faculty_dep || 'No data'}
            color="text-green-500"
          />
        </div>
      ) : (
        // Faculty Quick Links Section
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {cardsForFaculty.map((item, idx) => (
            <ActionCard key={idx} {...item} />
          ))}
        </div>
      )}

      {/* Recent Events */}
      {userDashboard?.recent_event?.length > 0 && (
        <div className="mt-8">
          <Table
            title="Recent Events"
            data={userDashboard.recent_event}
            columns={eventColumns}
            link="/events"
          />
        </div>
      )}
    </div>
  );
};

// Card for HOD
const DashboardStatCard = ({ title, value, color }) => (
  <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow-md transition hover:shadow-lg">
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
    <p className={`text-4xl font-bold ${color}`}>{value}</p>
  </div>
);

//  Card for Faculty
const ActionCard = ({ title, desc, link }) => (
  <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
    <Link to={link} className="text-blue-600 dark:text-blue-400 text-sm mt-3 inline-block hover:underline">
      View More →
    </Link>
  </div>
);

export default DashboardFacultyContent;
