import asynchandler from '../utils/asynchandler.js';
import ApiError from '../utils/apierror.js';
import { create_request } from './requestcontrollers.js';
import User from '../models/usermodel.js';
import Apiquery from '../utils/apiquery.js';
import Course from '../models/coursemodel.js';
import Request from '../models/requestmodel.js';
import Department from '../models/departmentmodel.js';
import College from '../models/collegemodel.js';
import Message from '../models/messagemodel.js';
import Task from '../models/taskmodel.js';
import Email from '../utils/emailhandler.js';
import * as crypto from 'crypto';

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
    requsers = await requiremodel
      .filter()
      .paginate()
      .sort()
      .models.populate('department');
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

  const semail = email?.trim().toLowerCase();
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

export const getUserData = asynchandler(async (req, res, next) => {
  const requser = await User.findById(req.user._id).populate(
    'college department course currentdegree'
  );
  if (!requser) return next(new ApiError('User not found', 404));
  res.status(201).json({
    message: 'Get User Data sucessfully',
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
    department: reqdepartment?._id,
  });

  const total_faculty_dep = await User.countDocuments({
    role: 'faculty',
    department: reqdepartment?._id,
  });

  // Get the college where the user is admin
  const reqcollege = await College.findOne({ admin: req.user._id });

  // Count students and faculty in college
  const total_student_college = await User.countDocuments({
    role: 'Student',
    college: reqcollege?._id,
  });

  const total_department = await Department.countDocuments({
    college: reqcollege?._id,
  });
  const total_faculty_college = await User.countDocuments({
    role: 'faculty',
    college: reqcollege?._id,
  });

  // Return JSON response
  res.status(200).json({
    pending_request,
    recent_event,
    total_course_dep,
    total_student_dep,
    total_faculty_dep,
    total_department,
    taught_courses,
    enrolled_courses,
    //task of today
    total_student_college,
    total_faculty_college,
  });
});

const updatetheuser = async (updated_user, sem, year) => {
  const reqcollege = updated_user.college;
  if (updated_user.sem % 2 == 0) year = true;
  // console.log(sem, year);
  if (updated_user.sem === updated_user.currentdegree.totalSemesters) {
    if (updated_user.course.length === 0) {
      const dep_id = updated_user.department;
      updated_user.pastcolleges.push(reqcollege._id);
      updated_user.pastdegree.push(updated_user.degree._id);
      updated_user.sem = NaN;
      updated_user.year = NaN;
      updated_user.department = null;
      updated_user.college = null;
      updated_user.currentdegree = null;
      updated_user.course = [];
      updated_user.role = 'User';
      await updated_user.save({ validateBeforeSave: false });

      await College.findByIdAndUpdate(reqcollege._id, {
        $pull: { users: updated_user._id },
      });

      await Department.findByIdAndUpdate(dep_id, {
        $pull: { user: updated_user._id },
      });
    }
  } else if (year === true && sem === true) {
    updated_user = await User.findByIdAndUpdate(
      updated_user._id,
      {
        sem: updated_user.sem + 1,
        year: updated_user.year + 1,
      },
      { new: true }
    );
  } else if (sem) {
    updated_user = await User.findByIdAndUpdate(
      updated_user._id,
      {
        sem: updated_user.sem + 1,
      },
      { new: true }
    );
  } else {
    return next(new ApiError('Please Enter All Required Fields', 422));
  }
  return updated_user;
};

export const update_sem = asynchandler(async (req, res, next) => {
  let { message, sem, year, student_id } = req.body;
  sem = true;

  const reqcollege = await College.findOne({ admin: req.user._id });
  let updated_users, updated_departments, updated_colleges, updated_course;

  if (!reqcollege) {
    return next(new ApiError('You Cannot Perform that Action', 422));
  }

  if (message === 'Individual') {
    updated_users = await User.findOne({
      college: reqcollege._id,
      _id: student_id,
    }).populate('currentdegree');

    if (!updated_users) {
      return next(new ApiError('User Not Found', 404));
    }

    if (
      updated_users.sem === updated_users.currentdegree.totalSemesters &&
      updated_users.course.length !== 0
    ) {
      return next(new ApiError('Cannot Update the Student', 422));
    }

    updated_users = await updatetheuser(updated_users, sem, year);
  } else if (message === 'remove_student') {
    updated_users = await User.findOne({
      college: reqcollege._id,
      _id: student_id,
    });

    if (!updated_users) {
      return next(new ApiError('User Not Found', 404));
    }

    const allcourse = updated_users.course;
    const dep_id = updated_users.department;

    updated_users.sem = NaN;
    updated_users.year = NaN;
    updated_users.department = null;
    updated_users.college = null;
    updated_users.currentdegree = null;
    updated_users.course = [];
    updated_users.role = 'User';
    await updated_users.save({ validateBeforeSave: false });

    await College.findByIdAndUpdate(reqcollege._id, {
      $pull: { users: updated_users._id },
    });

    await Department.findByIdAndUpdate(dep_id, {
      $pull: { user: updated_users._id },
    });

    await Course.updateMany(
      { _id: { $in: allcourse } },
      {
        $pull: { users: student_id },
        $unset: { [`attendance.${student_id}`]: '' },
      }
    );
  } else {
    updated_users = await User.find({
      college: reqcollege._id,
      role: 'Student',
    }).populate('currentdegree');

    try {
      updated_users = await Promise.all(
        updated_users.map((user) => updatetheuser(user, sem, year, next))
      );
    } catch (error) {
      console.log(error);
      return next(new ApiError('Error in updating', 404));
    }
  }

  res.status(201).json({
    message: 'Sem Updated Successfully',
    data: {
      updated_users,
      updated_colleges,
      updated_course,
    },
  });
});

export const sendEmail = asynchandler(async (req, res, next) => {
  const id = req.user._id;
  const requser = await User.findById(id);
  const emailToken = requser.createEmailtoken();

  try {
    const emailURL = `${process.env.FRONTEND_URL}/verifyemail/${emailToken}`;
    await new Email(requser, emailURL).sendEmailToken();
    await requser.save({ validateBeforeSave: false });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    requser.emailToken = undefined;
    requser.emailExpires = undefined;
    await requser.save({ validateBeforeSave: false });
    return next(
      new ApiError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

export const verifyuser = asynchandler(async (req, res, next) => {
  const { emailToken } = req.body;

  if (!emailToken) return next(new ApiError('Email Token Is required', 401));

  const hashedToken = crypto
    .createHash('sha256')
    .update(emailToken)
    .digest('hex');

  const requser = await User.findOne({
    emailToken: hashedToken,
    emailExpires: { $gte: Date.now() },
  });

  if (!requser) {
    return next(new ApiError('Token is invalid or expired', 401));
  }

  requser.active = true;

  requser.emailToken = undefined;
  requser.emailExpires = undefined;
  await requser.save({ validateBeforeSave: false });

  res.status(201).json({
    message: 'Email Verify successfully',
  });
});

export const removefaculty = asynchandler(async (req, res, next) => {
  const { remove_id } = req.body;
  if (!remove_id) {
    return next(new ApiError('Please Provide All Details', 404));
  }

  const requser = await User.findById(remove_id);

  if (!requser) {
    return next(new ApiError('User Not Found', 404));
  }
  const allcourse = await Course.updateMany(
    { teacher: requser._id },
    {
      teacher: null,
    },
    { new: true }
  );

  const updateduser = await User.findByIdAndUpdate(
    remove_id,
    {
      college: null,
      department: null,
      role: 'User',
    },
    { new: true }
  );

  res.status(201).json({
    message: 'User Removed Succeesfully',
  });
});
