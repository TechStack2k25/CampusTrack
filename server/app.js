// server.js or app.js

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
import { app } from './utils/socket.js'; // This assumes you're using the same 'app' from socket.js
import messageroutes from './routers/messageroutes.js';
import storeroutes from './routers/storeroutes.js';
import dotenv from 'dotenv';
import './utils/passport.config.js';
import session from 'express-session';
import passport from 'passport';
import path from 'path';

dotenv.config({ path: './variable.env' });
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET_STRING,
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: 'lax',
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}
app.use('/api/auth', authroutes);
app.use('/api/user', userroutes);
app.use('/api/college', collegeroutes);

app.use(protect);
app.use(activeuser);

app.use('/api/task', taskroutes);
app.use('/api/event', eventroutes);
app.use('/api/store', storeroutes);
app.use('/api/attendance', attendanceroutes);
app.use('/api/course', courseroutes);
app.use('/api/department', departmentroutes);
app.use('/api/degree', degreeroutes);
app.use('/api/message', messageroutes);

app.use(restrict_to(['Admin', 'HOD', 'faculty']));
app.use('/api/request', requestroutes);

app.use(globalerrorhandler);

export default app;
