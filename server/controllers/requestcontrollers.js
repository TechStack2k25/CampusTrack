import College from '../models/collegemodel.js';
import Course from '../models/coursemodel.js';
import Request from '../models/requestmodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';

const create_request = asynchandler(async (req, res, next) => {
  const { requestType, course, college } = req.body();
  const requser = req.user;
  if (!course && !college) {
    return next(new ApiError('Error in generated request.Try again', 404));
  }
  if (course) {
    const reqcourse = await Course.findById(course);
    if (!course) {
      return next(new ApiError('Error in generated request.Try again', 404));
    }

    const newrequest = await Request.create({
      requestType,
      request_course: course,
      request_by: requser,
      request_dep: requser.department,
    });

    if (!newrequest) {
      return next(new ApiError('Error in generated request.Try again', 404));
    }
  } else if (college) {
    const reqcollege = await College.findById(college);

    if (!college) {
      return next(new ApiError('Error in generated request.Try again', 404));
    }

    const newrequest = await Request.create({
      requestType,
      request_college: college,
      request_by: requser,
    });

    if (!newrequest) {
      return next(new ApiError('Error in generated request.Try again', 404));
    }
  }

  res.status(201).json({
    message: 'request generated sucessfully',
  });
});

const getall_request = asynchandler(async (req, res, next) => {
  const user_id = req.user._id;
  let allrequest;
  const reqcollege = await College.findOne({ admin: user_id });
  if (reqcollege && req.user.role === 'admin') {
    allrequest = Request.find({ request_college: reqcollege._id });
  }

  const reqdep = await Department.findOne({ hod: user_id });
  if (reqdep && req.user.role === 'HOD') {
    allrequest = Request.find({ request_dep: reqdep._id });
  }

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
  const { new_status } = req.body();
  const request_id = req.params.id;

  const require_request = await Request.findById(request_id);

  if (!require_request) {
    return next(new ApiError('Request is not found to update', 404));
  }

  if (
    require_request.requestType === 'Add Course' &&
    new_status === 'approved'
  ) {
    const reqcourse = await Course.findById(require_request.request_course);

    if (!reqcourse) {
      return next(new ApiError('error in updated request', 422));
    }

    reqcourse.user.push(require_request.request_by);
    reqcourse.save();
    const deleted_request = Request.findByIdAndDelete(request_id);
    if (deleted_request.deletedCount === 0) {
      reqcourse.user.pop();
      reqcourse.save();
      return next(new ApiError('Error in updating request', 422));
    }
  } else if (require_request.requestType === 'Add Student') {
    const reqcollege = College.findById(require_request.request_college);
    if (!reqcollege) {
      return next('No college found', 404);
    }
    reqcollege.users.push(require_request.request_by);
    reqcollege.save();
    const deleted_request = Request.findByIdAndDelete(request_id);
    if (deleted_request.deletedCount === 0) {
      reqcollege.users.pop();
      reqcollege.save();
      return next(new ApiError('Error in updating request', 422));
    }
  }
  res.status(201).json({
    message: 'request Updated Succesfully',
  });
});
