import College from '../models/collegemodel.js';
import Course from '../models/coursemodel.js';
import Request from '../models/requestmodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';

const create_request = asynchandler(async (req, res, next) => {
  // extract data from req.body
  const { requestType, course, college } = req.body();

  //get the data of user from req.user
  const requser = req.user;

  //check the request is type of add student and add course
  if (!course && !college) {
    return next(new ApiError('Error in generated request.Try again', 404));
  }

  //if course is exist
  if (course) {
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
  else if (college) {
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
  return 1;
});

const getall_request = asynchandler(async (req, res, next) => {
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

const updaterequest = asynchandler(async (req, res, next) => {
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

    //add the user in course and save it
    reqcourse.user.push(require_request.request_by);
    reqcourse.save();

    //get the request to deleted
    const deleted_request = Request.findByIdAndDelete(request_id);

    //check the request is deleted or not
    if (deleted_request.deletedCount === 0) {
      //if not deleted change the update and give error
      reqcourse.user.pop();
      reqcourse.save();
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

  //return sucess message
  res.status(201).json({
    message: 'request Updated Succesfully',
  });
});
