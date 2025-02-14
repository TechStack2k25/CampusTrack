import React from 'react'

function DashboardAdmin() {
  return (
      <main className="flex-1 p-6 min-h-screen">
    
    <h2 className="text-center text-2xl font-bold mb-8 dark:text-white">Welcome to Your Dashboard</h2>

    {/* Dashboard Content */}
    <section>
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-black dark:bg-opacity-30 dark:border dark:border-gray-700 p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Total Students</h2>
          <p className="text-4xl font-semibold text-blue-500">1,250</p>
        </div>
        <div className="bg-white dark:bg-black dark:bg-opacity-30 dark:border dark:border-gray-700 p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Total Faculty</h2>
          <p className="text-4xl font-semibold text-green-500">85</p>
        </div>
        <div className="bg-white dark:bg-black dark:bg-opacity-30 dark:border dark:border-gray-700 p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Total Departments</h2>
          <p className="text-4xl font-semibold text-red-500">12</p>
        </div>
      </div>

      {/* Recent Activity Section (mapping will done later) */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-400 tracking-tight mb-4">Recent Activities</h2>
        <div className="bg-white dark:bg-black dark:bg-opacity-30 dark:border dark:border-gray-700 shadow rounded-lg">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b dark:text-white">Activity</th>
                <th className="px-4 py-2 border-b dark:text-white">Date</th>
                <th className="px-4 py-2 border-b dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b dark:text-gray-400">Approved Faculty Registration</td>
                <td className="px-4 py-2 border-b dark:text-gray-400">2025-01-16</td>
                <td className="px-4 py-2 border-b text-green-600">Completed</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b dark:text-gray-400">Added New Department</td>
                <td className="px-4 py-2 border-b dark:text-gray-400">2025-01-15</td>
                <td className="px-4 py-2 border-b text-green-600">Completed</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b dark:text-gray-400">Pending Student Approval</td>
                <td className="px-4 py-2 border-b dark:text-gray-400">2025-01-14</td>
                <td className="px-4 py-2 border-b text-yellow-600">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
  )
}

export default DashboardAdmin