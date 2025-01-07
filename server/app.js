import express from 'express';
import morgan from 'morgan';
import globalerrorhandler from './controller/errorcontroller.js';
import authroutes from './routers/authrouters.js';

const app = express();

// extract json payload from request body and make available in req.body;
app.use(express.json());
//to console the http request
app.use(morgan('dev'));
//all auth routes redirect to authroutes.js
app.use('/api/auth', authroutes);
app.use(globalerrorhandler); // to handle the error
export default app;
