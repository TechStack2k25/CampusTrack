import React from 'react'

function DashboardAdmin() {
  return (
      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
    
    <h2 className="text-center text-2xl font-bold mb-8">Welcome to Your Dashboard</h2>

    {/* Dashboard Content */}
    <section>
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">Total Students</h2>
          <p className="text-4xl font-semibold text-blue-500">1,250</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">Total Faculty</h2>
          <p className="text-4xl font-semibold text-green-500">85</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">Total Departments</h2>
          <p className="text-4xl font-semibold text-red-500">12</p>
        </div>
      </div>

      {/* Recent Activity Section (mapping will done later) */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Activities</h2>
        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Activity</th>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b">Approved Faculty Registration</td>
                <td className="px-4 py-2 border-b">2025-01-16</td>
                <td className="px-4 py-2 border-b text-green-600">Completed</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Added New Department</td>
                <td className="px-4 py-2 border-b">2025-01-15</td>
                <td className="px-4 py-2 border-b text-green-600">Completed</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Pending Student Approval</td>
                <td className="px-4 py-2 border-b">2025-01-14</td>
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