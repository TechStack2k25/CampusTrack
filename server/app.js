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
import {
  restrict_to,
  protect,
  activeuser,
} from './controllers/authcontrollers.js';
import cookieParser from 'cookie-parser';
import attendanceroutes from './routers/attendanceroutes.js';
import degreeroutes from './routers/degreerouters.js';
import { app } from './utils/socket.js';
import messageroutes from './routers/messageroutes.js';
import storeroutes from './routers/storeroutes.js';
import dotenv from 'dotenv';
import './utils/passport.config.js';
import session from 'express-session';
import passport from 'passport';
// extract json payload from request body and make available in req.body;
app.use(express.json());

// extract json payload from request cookie and make available in req.cookies;
app.use(cookieParser());

dotenv.config({ path: './variable.env' });
app.use(
  session({
    secret: process.env.SESSION_SECRET_STRING,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//to console the http request
app.use(morgan('dev'));
//all auth routes redirect to authroutes.js
app.use('/api/auth', authroutes);
//all user routes
app.use('/api/user', userroutes);
//to protect all routes login to acess any task
app.use('/api/college', collegeroutes);
app.use(protect);
app.use(activeuser);
//all task routes
app.use('/api/task', taskroutes);
//to accept and get all request
app.use('/api/event', eventroutes);
app.use('/api/store', storeroutes);
//mark attendace of student
app.use('/api/attendance', attendanceroutes);
//all course routes and only hod can make change in courses
app.use('/api/course', courseroutes);
//all departmentroute
app.use('/api/department', departmentroutes);
app.use('/api/degree', degreeroutes);
app.use('/api/message', messageroutes);
app.use(restrict_to(['Admin', 'HOD', 'faculty']));
app.use('/api/request', requestroutes);

//all college routes

// to handle the error
app.use(globalerrorhandler);
export default app;
