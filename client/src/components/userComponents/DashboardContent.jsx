import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { challenges } from '../../data/challenges.js'
import AllAttendance from '../Utils/AllAttendance.jsx';
import { useSelector } from 'react-redux';
import { userService } from '../../api/userService.js';
import { Table } from '../Utils';
import EmptyDashboard from '../Utils/EmptyDashboard.jsx';
import { FiLayers, FiSend, FiHome, FiFileText, FiUploadCloud, FiBookOpen, FiCalendar, FiMessageCircle } from "react-icons/fi";

const studentFeatures = [
  {
    title: "Request New Courses",
    description: "Can’t find your desired course? Submit a request and get notified when it's added.",
    icon: <FiFileText className="text-indigo-600 text-3xl" />,
  },
  {
    title: "Upload Assignments",
    description: "Easily upload your assignments before the deadline and get submission updates.",
    icon: <FiUploadCloud className="text-emerald-600 text-3xl" />,
  },
  {
    title: "Access Study Materials",
    description: "View lecture notes, PDFs, and resources shared by your faculty in one place.",
    icon: <FiBookOpen className="text-blue-600 text-3xl" />,
  },
  {
    title: "Track Event Calendar",
    description: "Stay updated with upcoming events, webinars, exams, and important dates.",
    icon: <FiCalendar className="text-yellow-500 text-3xl" />,
  },
  {
    title: "Ask Doubts & Chat",
    description: "Use the forum or direct chat to resolve doubts with peers or faculty in real-time.",
    icon: <FiMessageCircle className="text-pink-600 text-3xl" />,
  },
];

const userFeatures = [
  {
    title: "Manage your Events",
    description: "Add important events and schedule accordingly.",
    icon: <FiLayers className="text-green-600 text-3xl" />,
  },
  {
    title: "Request to Join College",
    description: "Find your college with its ID and request to become a verified member of its network.",
    icon: <FiSend className="text-orange-500 text-3xl" />,
  },
  {
    title: "Set Up Your Own College",
    description: "Want to set-up college? Send a request to add and manage your own college space.",
    icon: <FiHome className="text-pink-600 text-3xl" />,
  },
];
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


const DashboardContent = () => {
  const { name,role } = useSelector((state)=>state.user.user);

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
    <main className="flex-1 p-6">
      <h2 className="dark:text-white text-center text-2xl font-bold mb-8 shadow">Welcome {name ? `! ${name} `:"to Your Dashboard "} 🚀</h2>
      {role==='Student' && <div>
      <AllAttendance />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Cards for each feature */}
        <div className="bg-white shadow-md rounded p-4 border-gray-200 dark:bg-gray-900 dark:border-gray-700 border">
          <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Courses</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">View your active and completed courses.</p>
          <Link to={'/courses'} className="text-blue-500 text-sm mt-2 inline-block hover:underline ">View More</Link>
        </div>
        <div className="bg-white shadow-md rounded p-4 border-gray-200 dark:bg-gray-900 dark:border-gray-700 border">
          <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Assignments</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Check pending and submitted assignments.</p>
          <Link to={'/assignments'} className="text-blue-500 text-sm mt-2 inline-block hover:underline ">View More</Link>
        </div>
        <div className="bg-white shadow-md rounded p-4 border-gray-200 dark:bg-gray-900 dark:border-gray-700 border">
          <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Event Schedules</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Keep track of upcoming events.</p>
          <Link to={'/events'} className="text-blue-500 text-sm mt-2 inline-block hover:underline ">View More</Link>
        </div>
      </div>
        
        </div>}
        {userDashboard?.recent_event?.length>0 ? <div className='mt-8'>
        <Table title={"Recents Events"} data={userDashboard?.recent_event} columns={eventColumns} link={'/events'}/>
      </div>:
      <EmptyDashboard features={role==='User'?userFeatures:studentFeatures}/>}

      
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
