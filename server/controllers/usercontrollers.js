import asynchandler from '../utils/asynchandler.js';
import ApiError from '../utils/apierror.js';
import { create_request } from './requestcontrollers.js';
import User from '../models/usermodel.js';
import Apiquery from '../utils/apiquery.js';
import Course from '../models/coursemodel.js';

export const getall = asynchandler(async (req, res, next) => {
  const queryobj = req.query;
  const course = queryobj.course;
  delete queryobj.course;
  let requsers = [];
  if (course) {
    const reqcourse = await Course.findById(course).populate({
      path: 'users', // The field to populate
      match: { role: queryobj.role }, //ensure role
      populate: {
        path: 'department', // The model to use for populating 'department' (ensure 'Department' is the correct model name)
        select: 'name', //only name required
        model: 'Department',
      },
    });
    requsers = reqcourse?.users?.map((user) => {
      const userObj = user.toObject(); // Convert to plain object
      userObj.attendance = reqcourse.student_attendance?.get(user._id) || 0;
      return userObj;
    });
  } else {
    const requiremodel = new Apiquery(User, queryobj);
    requsers = await requiremodel.filter().paginate().models;
  }
  res.status(201).json({
    message: 'User fetch sucessfully',
    data: requsers,
  });
});

export const deluser = asynchandler(async (req, res, next) => {});

export const updateuser = asynchandler(async (req, res, next) => {
  //get the data from request
  const {
    name,
    surname,
    sem,
    year,
    currentdegree,
    degree,
    qualifaication,
    role,
    email,
  } = req.body;

  const semail = email.trim().toLowerCase();
  //check the user exist or not
  const requser =
    (await User.findOne({ email: semail })) ||
    (await User.findById(req.user._id));

  //if not exit then returmn mesaage of sign up
  if (!requser) {
    return next(new ApiError('NO user found ! ,Sign up', 404));
  }
  //if role is present then create a request
  if (role && requser.role != role) {
    req.body.requestType = 'Add user';
    return await create_request(req, res, next); // This will call next(error) if an error occurs

    // if (!result) return;
  }
  //update the user by id
  const updateduser = await User.findByIdAndUpdate(
    requser._id,
    {
      name,
      surname,
      sem,
      year,
      currentdegree,
      degree,
      qualifaication,
    },
    { new: true, runValidators: true }
  );

  //user updated give the new data of user
  res.status(201).json({
    message: 'user updated suceesfully',
    data: {
      user: updateduser,
    },
  });
});
