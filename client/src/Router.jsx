import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  AdminDashboard,
  Dashboard,
  DashboardFaculty,
  Schedule,
} from './pages/index.js';
import {
  Assignments,
  Courses,
  Events,
  Leaderboard,
  Lectures,
  Request,
  StudyMaterial,
} from './components/userComponents/index.js';
import {
  AssignmentsFaculty,
  AssignmentsSubmissions,
  Attendance,
  DashboardFacultyContent,
  Notification,
} from './components/facultyComponents/index.js';
import {
  Approvals,
  DashboardAdmin,
  Degrees,
  Departments,
  Faculty,
  Scholars,
  Profile as AdminProfile,
} from './components/collegeAdmin/index.js';
import { DashboardContent, Notfound, Profile } from './components/index.js';
import WebAdmin from './components/WebAdmin/WebAdmin.jsx';

const Routers = () => {
  const role = useSelector((state) => state.user.user?.role) || 'user';
  // console.log(role);

  return (
    <Routes>
      {role === 'Owner' && <Route path='dashboard' element={<WebAdmin />} />}
      {role === 'faculty' && (
        <>
          <Route element={<DashboardFaculty />}>
            <Route path='dashboard' element={<DashboardFacultyContent />} />
            <Route path='profile' element={<Profile />} />
            <Route path='courses' element={<Courses />} />
            <Route path='courses/:courseId' element={<Assignments />} />
            <Route path='study/:courseId' element={<StudyMaterial />} />
            <Route path='assignments' element={<AssignmentsFaculty />} />
            <Route path='events' element={<Events />} />
            <Route path='schedule' element={<Schedule />} />
            <Route path='attendance' element={<Attendance />} />
            <Route path='submissions' element={<AssignmentsSubmissions />} />
            <Route path='approvals' element={<Approvals />} />
            {/* <Route path="notifications" element={<Notification />} /> */}
            <Route path='request' element={<Request />} />
            <Route path='*' element={<Notfound />} />
          </Route>
        </>
      )}
      {role === 'HOD' && (
        <>
          <Route element={<DashboardFaculty />}>
            <Route path='dashboard' element={<DashboardFacultyContent />} />
            <Route path='profile' element={<Profile />} />
            <Route path='courses' element={<Courses />} />
            <Route path='events' element={<Events />} />
            <Route path='schedule' element={<Schedule />} />
            <Route path='attendance' element={<Attendance />} />
            <Route path='approvals' element={<Approvals />} />
            {/* <Route path="notifications" element={<Notification />} /> */}
            <Route path='*' element={<Notfound />} />
          </Route>
        </>
      )}
      {role === 'Admin' && (
        <>
          <Route element={<AdminDashboard />}>
            <Route path='dashboard' element={<DashboardAdmin />} />
            <Route path='profile' element={<AdminProfile />} />
            <Route path='departments' element={<Departments />} />
            <Route path='degrees' element={<Degrees />} />
            <Route path='faculty' element={<Faculty />} />
            <Route path='scholars' element={<Scholars />} />
            <Route path='events' element={<Events />} />
            <Route path='schedule' element={<Schedule />} />
            <Route path='approvals' element={<Approvals />} />
            {/* <Route path="notifications" element={<Notification />} /> */}
            <Route path='*' element={<Notfound />} />
          </Route>
        </>
      )}
      {role === 'User' && (
        <>
          <Route element={<Dashboard />}>
            <Route path='dashboard' element={<DashboardContent />} />
            <Route path='profile' element={<Profile />} />
            <Route path='events' element={<Events />} />
            <Route path='schedule' element={<Schedule />} />
            <Route path='request' element={<Request />} />
            <Route path='*' element={<Notfound />} />
          </Route>
        </>
      )}
      {role === 'Student' && (
        <>
          <Route element={<Dashboard />}>
            <Route path='dashboard' element={<DashboardContent />} />
            <Route path='profile' element={<Profile />} />
            <Route path='courses' element={<Courses />} />
            <Route path='courses/:courseId' element={<Assignments />} />
            <Route path='study/:courseId' element={<StudyMaterial />} />
            <Route path='assignments' element={<Assignments />} />
            <Route path='events' element={<Events />} />
            <Route path='schedule' element={<Schedule />} />
            {/* <Route path="lectures" element={<Lectures />} /> */}
            {/* <Route path="notifications" element={<Notification />} /> */}
            <Route path='request' element={<Request />} />
            <Route path='leaderboard' element={<Leaderboard />} />
            <Route path='*' element={<Notfound />} />
          </Route>
        </>
      )}
    </Routes>
  );
};

export default Routers;
