import React from 'react';
import { Sidebar } from '../components';
import { Outlet } from 'react-router-dom';
import { adminMenu } from '../data/scholarMenu.js';

function AdminDashboard() {
  return (
    <div className="relative flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar menuItems={adminMenu} />
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboard;
