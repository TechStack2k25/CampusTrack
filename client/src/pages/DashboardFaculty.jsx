import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components';
import { Outlet } from 'react-router-dom';
import { facultyMenu } from '../data/scholarMenu.js';
import { useSelector } from 'react-redux';

const DashboardFaculty = () => {
  const [menu, setMenu] = useState(facultyMenu);
  const userRole = useSelector((state) => state.user.user?.role);

  useEffect(() => {
    if (userRole === 'faculty' || userRole === 'HOD') {
      setMenu(facultyMenu.filter((item) => item.roles.includes(userRole)));
    }
  }, [userRole]);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar */}
        <Sidebar menuItems={menu} />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 bg-gray-50 dark:bg-gray-900 overflow-y-auto transition-all duration-300">
          <Outlet />
      </main>
    </div>
  );
};

export default DashboardFaculty;
