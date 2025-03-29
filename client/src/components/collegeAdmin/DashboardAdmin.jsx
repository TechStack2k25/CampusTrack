import React, { useEffect, useState } from 'react'
import { userService } from '../../api/userService';
import Table from '../Utils/Table';


const activityColumns = [{
  name:"Activity",
  id:"title",
}, {
  name:"Date",
  id:"date",
  type:"date",
}, {
  name:"Status",
  id:"status",
}];

const eventColumns = [{
  name:"Activity",
  id:"title",
}, {
  name:"Date",
  id:"deadline",
  type:"date",
}, {
  name:"Description",
  id:"description",
}];
const activityData = [
  { title: "Approved Faculty Registration", date: "2025-01-16", status: "Completed" },
  { title: "Added New Department", date: "2025-01-15", status: "Completed" },
  { title: "Pending Student Approval", date: "2025-01-14", status: "Pending" },
];

const colorScheme = {
  status: {
    Completed:"text-green-600",
    Pending: "text-yellow-600",
  },
};

function DashboardAdmin() {
  const [userDashboard,setUserDashboard]=useState({});

  const fetchData=async()=>{
    try {
      const res=await userService.userDashData();
      setUserDashboard(res);
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  }

  useEffect(()=>{
    fetchData();
  },[]);
  console.log(userDashboard);
  
  return (
      <main className="flex-1 p-6 min-h-screen">
    
    <h2 className="text-center text-2xl font-bold mb-8 dark:text-white">Welcome to Your Dashboard</h2>

    {/* Dashboard Content */}
    <section>
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-black dark:bg-opacity-30 dark:border dark:border-gray-700 p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Total Students</h2>
          <p className="text-4xl font-semibold text-blue-500">{userDashboard?.total_student_college|| "No data to show!"}</p>
        </div>
        <div className="bg-white dark:bg-black dark:bg-opacity-30 dark:border dark:border-gray-700 p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Total Faculty</h2>
          <p className="text-4xl font-semibold text-green-500">{userDashboard?.total_faculty_college || "No Data to show!"}</p>
        </div>
        <div className="bg-white dark:bg-black dark:bg-opacity-30 dark:border dark:border-gray-700 p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Total Departments</h2>
          <p className="text-4xl font-semibold text-red-500">12</p>
        </div>
      </div>

      {userDashboard?.recent_event?.length>0 && <div className='mt-8'>
        <Table title={"Recents Events"} data={userDashboard?.recent_event} columns={eventColumns} link={'/events'}/>
      </div>}

      {/* Recent Activity Section (mapping will done later) */}
      {activityData?.length>0 && <div className='mt-8'>
        <Table title={"Recent Activities"} data={activityData} columns={activityColumns} colorScheme={colorScheme} />
      </div>}
    </section>
  </main>
  )
}

export default DashboardAdmin