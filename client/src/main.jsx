import { createRoot } from 'react-dom/client'
import './index.css';
import{ Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom'
import App from './App.jsx'
import { Home, Login, Signup, ForgotPassword, Loading, Notfound, DashboardContent } from './components/index.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/store.js';
import { AdminDashboard, Dashboard, DashboardFaculty, Schedule }from './pages/index.js';
import { Assignments, Courses, Events, Leaderboard, Lectures } from './components/userComponents/index.js';
import {AssignmentsFaculty, AssignmentsSubmissions, Attendance, DashboardFacultyContent, Notification} from './components/facultyComponents/index.js';
import { Approvals, DashboardAdmin, Departments, Faculty, Scholars } from './components/collegeAdmin/index.js';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App/>}>
        <Route path='' element={<Home />}/>
        <Route path='login' element={<Login />}/>
        <Route path='signup' element={<Signup />}/>
        <Route path='forgot-password' element={<ForgotPassword />}/>

        {/* Authenticated access only */}
        {/* <Route  element={<Dashboard/>}>
          <Route path='dashboard' element={<DashboardContent />} />
          <Route path='courses' element={<Courses />} />
          <Route path='assignments' element={<Assignments />} />
          <Route path='events' element={<Events />} />
          <Route path='schedule' element={<Schedule />} />
          <Route path='lectures' element={<Lectures />} />
          <Route path='leaderboard' element={<Leaderboard />} />
        </Route> */}
        {/* Faculty accessible */}
        {/* <Route  element={<DashboardFaculty/>}>
          <Route path='dashboard' element={<DashboardFacultyContent />} />
          <Route path='courses' element={<Courses />} />
          <Route path='assignments' element={<AssignmentsFaculty />} />
          <Route path='events' element={<Events />} />
          <Route path='schedule' element={<Schedule />} />
          <Route path='lectures' element={<Lectures />} />
          <Route path='attendance' element={<Attendance />} />
          <Route path='submissions' element={<AssignmentsSubmissions />} />
          <Route path='notifications' element={<Notification />} />
        </Route>
      </Route> */}
        <Route  element={<AdminDashboard/>}>
          <Route path='dashboard' element={<DashboardAdmin />} />
          <Route path='courses' element={<Courses />} />
          <Route path='departments' element={<Departments />} />
          <Route path='lectures' element={<Lectures />} />
          <Route path='faculty' element={<Faculty />} />
          <Route path='scholars' element={<Scholars />} />
          <Route path='events' element={<Events />} />
          <Route path='schedule' element={<Schedule />} />
          <Route path='approvals' element={<Approvals />} />
          <Route path='notifications' element={<Notification />} />
        </Route>
      </Route>
      <Route path="*" element={<Notfound />} />
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={<Loading/>} persistor={persistor}>
      <RouterProvider router={router}/>
    </PersistGate>
  </Provider>
)
