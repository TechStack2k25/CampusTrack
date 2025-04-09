import React, { useEffect, useState } from 'react';
import { userService } from '../../api/userService';
import Table from '../Utils/Table';
import { useSelector } from 'react-redux';

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

const DashboardFacultyContent = () => {
  const { role } = useSelector((state) => state.user.user);

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
  // console.log(userDashboard);

  return (
    <div className='flex-1 p-6 min-h-screen'>
      <h2 className='text-center dark:text-white text-2xl font-bold mb-8'>
        Welcome to Your Dashboard
      </h2>
      {/* Overview */}
      {role && role === 'HOD' && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
          <div className='bg-white dark:bg-black dark:bg-opacity-30 dark:border dark:border-gray-700 p-4 shadow rounded-lg'>
            <h2 className='text-lg font-bold text-gray-700 dark:text-gray-300'>
              Total Students
            </h2>
            <p className='text-4xl font-semibold text-blue-500'>
              {userDashboard?.total_student_dep || 'No data to show!'}
            </p>
          </div>
          <div className='bg-white dark:bg-black dark:bg-opacity-30 dark:border dark:border-gray-700 p-4 shadow rounded-lg'>
            <h2 className='text-lg font-bold text-gray-700 dark:text-gray-300'>
              Total Faculty
            </h2>
            <p className='text-4xl font-semibold text-green-500'>
              {userDashboard?.total_faculty_dep || 'No Data to show!'}
            </p>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8'>
        <div className='bg-white shadow-md rounded p-4 border-gray-200 dark:bg-gray-900 dark:border-gray-700 border'>
          <h2 className='text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2'>
            Upcoming Classes
          </h2>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            You have 3 classes today.
          </p>
        </div>
        <div className='bg-white shadow-md rounded p-4 border-gray-200 dark:bg-gray-900 dark:border-gray-700 border'>
          <h2 className='text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2'>
            Recent Announcements
          </h2>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            No new announcements.
          </p>
        </div>
        <div className='bg-white shadow-md rounded p-4 border-gray-200 dark:bg-gray-900 dark:border-gray-700 border'>
          <h2 className='text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2'>
            Pending Tasks
          </h2>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Grade 2 assignments.
          </p>
        </div>
      </div>
      {userDashboard?.recent_event?.length > 0 && (
        <div className='mt-8'>
          <Table
            title={'Recents Events'}
            data={userDashboard?.recent_event}
            columns={eventColumns}
            link={'/events'}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardFacultyContent;
