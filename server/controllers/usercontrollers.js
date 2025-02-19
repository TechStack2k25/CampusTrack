import asynchandler from '../utils/asynchandler.js';
import ApiError from '../utils/apierror.js';
import { create_request } from './requestcontrollers.js';
import User from '../models/usermodel.js';
import Apiquery from '../utils/apiquery.js';
import Course from '../models/coursemodel.js';
import Request from '../models/requestmodel.js';
import Department from '../models/departmentmodel.js';
import College from '../models/collegemodel.js';

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
    requsers = await requiremodel.filter().paginate().sort().models;
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

export const getprofile = asynchandler(async (req, res, next) => {
  const requser = await User.findById(req.user._id);
  res.status(201).json({
    message: 'Get profile sucessfully',
    data: {
      user: requser,
    },
  });
});

export const get_dashboard = asynchandler(async (req, res, next) => {
  const user_id = req.user._id;

  // Get pending requests by the user
  const pending_request = await Request.find({ request_by: user_id });

  // Get 5 recent upcoming events
  const recent_event = await Task.find({
    _id: { $in: req.user.events },
    deadline: { $gte: new Date() }, // Only future events
  })
    .sort({ deadline: 1 }) // Sort by nearest deadline
    .limit(5);

  // Count number of courses the user is enrolled in or teaches
  const taught_courses = await Course.countDocuments({ teacher: req.user._id });
  const enrolled_courses = req.user.course?.length || 0;

  // Find department where user is HOD
  const reqdepartment = await Department.findOne({ hod: req.user._id });

  // Get total courses in department (fixing issue of accessing 'courses' from array)
  const total_course_dep = reqdepartment?.courses?.length;

  // Count students and faculty in department
  const total_student_dep = await User.countDocuments({
    role: 'Student',
    department: reqdepartment?._id || ' ',
  });

  const total_faculty_dep = await User.countDocuments({
    role: 'faculty',
    department: reqdepartment?._id || ' ',
  });

  // Get the college where the user is admin
  const reqcollege = await College.findOne({ admin: req.user._id });

  // Count students and faculty in college
  const total_student_college = await User.countDocuments({
    role: 'Student',
    college: reqcollege?._id || ' ',
  });

  const total_faculty_college = await User.countDocuments({
    role: 'faculty',
    college: reqcollege?._id || ' ',
  });

  // Return JSON response
  res.status(200).json({
    pending_request,
    recent_event,
    total_course_dep,
    total_student_dep,
    total_faculty_dep,
    //total department
    //task of today
    total_student_college,
    total_faculty_college,
  });
});
