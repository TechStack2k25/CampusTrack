import College from '../models/collegemodel.js';
import Course from '../models/coursemodel.js';
import Request from '../models/requestmodel.js';
import Task from '../models/taskmodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';
import { isvaliduser } from './authcontrollers.js';

export const create_request = asynchandler(async (req, res, next) => {
  // extract data from req.body
  const { requestType, course, college, task, file } = req.body();

  //get the data of user from req.user
  const requser = req.user;

  //check the request is type of add student and add course
  if (!course && !college) {
    return next(new ApiError('Error in generated request.Try again', 404));
  }

  //if course is exist
  if (requestType === 'Add Course') {
    //check the course is exist or not
    const reqcourse = await Course.findById(course);

    //if course is not found give error
    if (!reqcourse) {
      return next(new ApiError('Error in generated request.Try again', 404));
    }

    //create the request
    const newrequest = await Request.create({
      requestType,
      request_course: course,
      request_by: requser,
      request_dep: requser.department,
    });

    //check request is created sucessfully or not
    if (!newrequest) {
      return next(new ApiError('Error in generated request.Try again', 404));
    }
  }

  //check the we get college or not
  else if (requestType === 'Add User') {
    //check the college exist or not
    const reqcollege = await College.findById(college);

    //if not exist return error
    if (!reqcollege) {
      return next(new ApiError('Error in generated request.Try again', 404));
    }

    //create the request
    const newrequest = await Request.create({
      requestType,
      request_college: college,
      request_by: requser,
      request_role: req.body.role,
    });

    ///check the request is created or not
    if (!newrequest) {
      return next(new ApiError('Error in generated request.Try again', 404));
    }
  }

  //create request for submissin of task
  else if (requestType === 'Submit Task') {
    if (!task) {
      return next(new ApiError('To submit task it not found', 404));
    }
    const newrequest = await Request.create({
      requestType,
      request_course: course,
      request_task: task,
      request_by: req.user._id,
      request_file: file,
    });

    if (!newrequest) {
      return next(
        new ApiError('Error in create request for submit assignment', 422)
      );
    }
  }
  return 1;
});

export const getall_request = asynchandler(async (req, res, next) => {
  //take the data of user from req.user
  const user_id = req.user._id;

  //declare the variable for request
  let allrequest;

  //check the useris admin or not
  const reqcollege = await College.findOne({ admin: user_id });

  //check the user is admin of any college
  if (reqcollege && req.user.role === 'admin') {
    allrequest = Request.find({ request_college: reqcollege._id });
  }

  //check the user is hod of any department
  const reqdep = await Department.findOne({ hod: user_id });

  if (reqdep && req.user.role === 'HOD') {
    allrequest = Request.find({ request_dep: reqdep._id });
  }

  //check the error in get request or not
  if (!allrequest) {
    return next(
      new ApiError('You are unauthorised to aprove or decline request', 401)
    );
  }
  res.status(201).json({
    message: 'All request fetch sucessfully',
    data: {
      data: allrequest,
    },
  });
});

export const updaterequest = asynchandler(async (req, res, next) => {
  //get the updated status from body
  const { new_status } = req.body();

  //get theid from params
  const request_id = req.params.id;

  //get the request to check it existor not
  const require_request = await Request.findById(request_id);

  //if not exist give error
  if (!require_request) {
    return next(new ApiError('Request is not found to update', 404));
  }

  //check the request is accepted or not and of add course
  if (
    require_request.requestType === 'Add Course' &&
    new_status === 'approved'
  ) {
    //get the course to approve
    const reqcourse = await Course.findById(require_request.request_course);

    //if course not find give error
    if (!reqcourse) {
      return next(new ApiError('error in updated request', 422));
    }

    //get the user for which we update
    const requser = await User.findById(require_request.request_by);

    //check user is exist or not
    if (!requser) {
      return next(new ApiError('User not found', 404));
    }

    //add the user in course and save it
    requser.course.push(require_request.request_by);
    requser.save();

    //get the request to deleted
    const deleted_request = Request.findByIdAndDelete(request_id);

    //check the request is deleted or not
    if (deleted_request.deletedCount === 0) {
      //if not deleted change the update and give error
      requser.course.pop();
      requser.save();
      return next(new ApiError('Error in updating request', 422));
    }
  }

  //check the request is for change role
  else if (require_request.requestType === 'Add User') {
    //find the college for which change the role
    const reqcollege = College.findById(require_request.request_college);

    //if college not exist give error
    if (!reqcollege) {
      return next('No college found', 404);
    }

    //add the user in the college and save
    reqcollege.users.push(require_request.request_by);
    reqcollege.save();

    //if update request then delete it
    const deleted_request = Request.findByIdAndDelete(request_id);

    //check the request is deleted or not
    if (deleted_request.deletedCount === 0) {
      //if not delete update the change
      reqcollege.users.pop();
      reqcollege.save();
      return next(new ApiError('Error in updating request', 422));
    }
  }

  //update the request of submit assignment
  else if (
    require_request.requestType === 'Submit Task' &&
    new_status === 'Approved'
  ) {
    //get the id of the task
    const task_id = require_request.request_task;

    //check the task is exist or not
    const reqtask = await Task.findById(task_id);

    //if task is not exist give error
    if (!reqtask) {
      next(new ApiError('Task is not found to update request', 404));
    }

    //get the course for the id of the teacher
    const reqcourse = await Course.findById(require_request.request_course);

    //if course not found give error
    if (!reqcourse) {
      return next(new ApiError('Course not found', 404));
    }

    //check the user is valid or not
    isvaliduser(req.user._id, reqcourse.teacher);

    //if user is authorised add submit status of user and delete it
    const user_id = require_request.request_by;
    const file = require_request.request_file;
    reqtask.submitted_by.push({ user: user_id, file });
    reqtask.save();

    //if update request then delete it
    const deleted_request = Request.findByIdAndDelete(request_id);

    //check the request is deleted or not
    if (deleted_request.deletedCount === 0) {
      //if not delete update the change
      reqtask.submitted_by.pop();
      reqtask.save();
      return next(new ApiError('Error in updating request', 422));
    }
  }
  //return sucess message
  res.status(201).json({
    message: 'request Updated Succesfully',
  });
});
