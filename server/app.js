import express from 'express';
import morgan from 'morgan';
import globalerrorhandler from './controllers/errorcontroller.js';
import authroutes from './routers/authrouters.js';
import collegeroutes from './routers/collegeroutes.js';
import departmentroutes from './routers/departmentroutes.js';
import courseroutes from './routers/courseroutes.js';
import taskroutes from './routers/taskroutes.js';
import eventroutes from './routers/eventrouter.js';
import userroutes from './routers/userrouters.js';
import requestroutes from './routers/requestroutes.js';
import { restrict_to, protect } from './controllers/authcontrollers.js';
import cookieParser from 'cookie-parser';
import attendanceroutes from './routers/attendanceroutes.js';
import degreeroutes from './routers/degreerouters.js';

const app = express();

// extract json payload from request body and make available in req.body;
app.use(express.json());

// extract json payload from request cookie and make available in req.cookies;
app.use(cookieParser());
//to console the http request
app.use(morgan('dev'));
//all auth routes redirect to authroutes.js
app.use('/api/auth', authroutes);
//to protect all routes login to acess any task
app.use(protect);
//all user routes
app.use('/api/user', userroutes);
//to accept and get all request
app.use('/api/request', requestroutes);
app.use('/api/degree', degreeroutes);
//all event routes
app.use('/api/event', eventroutes);
//all task routes and only faculty can make change in task
app.use('/api/task', taskroutes);
//mark attendace of student
app.use('/api/attendance', attendanceroutes);
//all course routes and only hod can make change in courses
app.use('/api/course', courseroutes);
//all departmentroute
app.use('/api/department', departmentroutes);

//all college routes
app.use('/api/college', restrict_to('Admin'), collegeroutes);
// to handle the error
app.use(globalerrorhandler);
export default app;
