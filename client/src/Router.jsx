import React from 'react';
import {Routes, Route} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AdminDashboard, Dashboard, DashboardFaculty, Schedule }from './pages/index.js';
import { Assignments, Courses, Events, Leaderboard, Lectures } from './components/userComponents/index.js';
import {AssignmentsFaculty, AssignmentsSubmissions, Attendance, DashboardFacultyContent, Notification} from './components/facultyComponents/index.js';
import { Approvals, DashboardAdmin, Departments, Faculty, Scholars } from './components/collegeAdmin/index.js';
import { DashboardContent } from './components/index.js';


const Routers = () => {
    const role = useSelector((state) => state.user.user?.role) || "user"; 
    console.log(role);
    

  
    return (
      <Routes>
        {role === 'faculty' && (
          <>
          <Route  element={<DashboardFaculty/>}>
            <Route path="dashboard" element={<DashboardFacultyContent />} />
            <Route path="courses" element={<Courses />} />
            <Route path="assignments" element={<AssignmentsFaculty />} />
            <Route path="events" element={<Events />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="submissions" element={<AssignmentsSubmissions />} />
            <Route path="notifications" element={<Notification />} />
            </Route>
          </>
        )}
        {role === 'admin' && (
          <>
          <Route  element={<AdminDashboard/>}>
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="courses" element={<Courses />} />
            <Route path="departments" element={<Departments />} />
            <Route path="faculty" element={<Faculty />} />
            <Route path="scholars" element={<Scholars />} />
            <Route path="events" element={<Events />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="notifications" element={<Notification />} />
            </Route>
          </>
        )}
        {role !== 'faculty' && role !== 'admin' && (
          <>
          <Route  element={<Dashboard/>}>
            <Route path="dashboard" element={<DashboardContent />} />
            <Route path="courses" element={<Courses />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="events" element={<Events />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="lectures" element={<Lectures />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            </Route>
          </>
        )}
      </Routes>
    );
  };

  export default Routers