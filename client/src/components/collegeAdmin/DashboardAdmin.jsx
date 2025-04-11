import React, { useEffect, useState } from 'react';
import { userService } from '../../api/userService';
import { Loader, Table  } from '../Utils'

const eventColumns = [
  { name: 'Activity', id: 'title' },
  { name: 'Date', id: 'deadline', type: 'date' },
  { name: 'Description', id: 'description' },
];

function DashboardAdmin() {
  const [userDashboard, setUserDashboard] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await userService.userDashData();
        setUserDashboard(res || {});
      } catch (error) {
        // console.error('Error fetching dashboard data:', error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const { total_student_college, total_faculty_college, total_department, recent_event } = userDashboard;

  return (
    <main className='flex-1 p-6 min-h-screen'>
      <h2 className='text-center text-2xl font-bold mb-8 dark:text-white'>
        Welcome to Your Dashboard
      </h2>

      {loading ? (
        <Loader />
      ) : (
        <section>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <StatCard title='Total Students' value={total_student_college} color='text-blue-500' />
            <StatCard title='Total Faculty' value={total_faculty_college} color='text-green-500' />
            <StatCard title='Total Departments' value={total_department} color='text-red-500' />
          </div>

          {/* Recent Events Table */}
          {Array.isArray(recent_event) && recent_event.length > 0 && (
            <div className='mt-8'>
              <Table title='Recent Events' data={recent_event} columns={eventColumns} link='/events' />
            </div>
          )}
        </section>
      )}
    </main>
  );
}

// Extracted Card Component
const StatCard = ({ title, value, color }) => (
  <div className='bg-white dark:bg-black dark:bg-opacity-30 dark:border dark:border-gray-700 p-4 shadow rounded-lg'>
    <h2 className='text-lg font-bold text-gray-700 dark:text-gray-300'>{title}</h2>
    <p className={`text-4xl font-semibold ${color}`}>{value ?? '-'}</p>
  </div>
);

export default DashboardAdmin;
