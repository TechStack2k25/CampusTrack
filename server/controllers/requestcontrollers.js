import College from '../models/collegemodel.js';
import Course from '../models/coursemodel.js';
import Department from '../models/departmentmodel.js';
import Request from '../models/requestmodel.js';
import Task from '../models/taskmodel.js';
import User from '../models/usermodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';
import { isvaliduser } from './authcontrollers.js';

export const create_request = asynchandler(async (req, res, next) => {
  // extract data from req.body
  let { requestType, course, college, dep_id, role, year, degree, sem } =
    req.body;

  //get the data of user from req.user
  const requser = req.user;

  //check the request is type of add student and add course
  if (!requestType) {
    return next(new ApiError('Error in generating request.Try again', 404));
  }

  //if course is exist
  if (requestType === 'Add Course') {
    //check the course is exist or not
    const reqcourse = await Course.findById(course);

    //if course is not found give error
    if (!reqcourse) {
      return next(new ApiError('Error in generating request.Try again', 404));
    }
    // check the qlready requested or not
    const existed_request = await Request.findOne({
      requestType,
      request_course: course,
      request_by: req.user._id,
      request_role: req.user.role,
      request_dep: req.user.department,
    });
    if (existed_request) {
      return next(new ApiError('You are already request for it', 411));
    }
    //create the request
    const newrequest = await Request.create({
      requestType,
      request_course: course,
      request_by: requser,
      request_role: req.user.role,
      request_dep: req.user.department,
    });

    //check request is created sucessfully or not
    if (!newrequest) {
      return next(new ApiError('Error in generating request.Try again', 404));
    }
  }

  //check the we get college or not
  else if (requestType === 'Add user') {
    if (role === 'Student' || role === 'faculty') {
      //check the college exist or not
      const reqcollege = await College.findOne({ id: college });

      if (!reqcollege || !dep_id) {
        return next(new ApiError("Can't find the college ", 404));
      }
      //get the department in which he want to add
      const reqdepartment = await Department.findById(dep_id);

      //if not exist return error
      if (!reqcollege) {
        return next(new ApiError('Error in generating request.Try again', 404));
      }

      if (role == 'Student') {
        sem = 1;
        year = 1;
      }
      //check the request is already exist
      const existed_request = await Request.findOne({
        requestType,
        request_college: reqcollege._id,
        request_by: requser._id,
        request_role: role,
        request_dep: reqdepartment._id,
        request_year: year,
        request_degree: degree,
        request_sem: sem,
      });

      if (existed_request) {
        return next(new ApiError('You have already request for it', 411));
      }

      //create the request
      const newrequest = await Request.create({
        requestType,
        request_college: reqcollege._id,
        request_by: requser._id,
        request_role: role,
        request_degree: degree,
        request_dep: reqdepartment._id,
        request_year: year,
        request_degree: degree,
      });

      ///check the request is created or not
      if (!newrequest) {
        return next(new ApiError('Error in generating request.Try again', 404));
      }
    }

    //if the user want to be hod
    else if (role === 'HOD') {
      const department = req.user.department;
      //check the department is exist or not

      if (req.user.role !== 'faculty') {
        return next(new ApiError('You Cannot Request to be HOD', 403));
      }

      const reqdepartment = await Department.findById(department);

      //give error if department noy found
      if (!reqdepartment) {
        return next(new ApiError('Department Not found', 404));
      }

      //check the request is existed or not
      const existed_request = await Request.findOne({
        requestType,
        request_dep: reqdepartment._id,
        request_by: requser._id,
        request_role: role,
      });

      if (existed_request) {
        return next(new ApiError('You are Already request for it', 411));
      }

      const newrequest = await Request.create({
        requestType,
        request_dep: reqdepartment._id,
        request_by: requser._id,
        request_role: role,
      });
    }
  }
  return res.status(201).json({
    message: 'Request generated successfully',
  });
});

export const getall_request = asynchandler(async (req, res, next) => {
  //take the data of user from req.user
  const user_id = req.user._id;

  //declare the variable for request
  let allrequest = {};
  //check the user is admin of any college
  if (req.user.role === 'Admin') {
    //check the useris admin or not
    const reqcollege = await College.findOne({ admin: user_id });

    const user_request = await Request.find({
      request_college: reqcollege._id,
    })
      .populate('request_by')
      .populate('request_dep')
      .populate('request_degree');

    const hod_request = await Request.find({
      request_role: 'HOD',
      request_dep: { $in: reqcollege.department },
    })
      .populate('request_by')
      .populate('request_dep');

    allrequest.user = user_request; // Assign user requests
    allrequest.hod = hod_request;
  }

  if (req.user.role === 'HOD') {
    //check the user is hod or not
    const reqdepartment = await Department.findOne({ hod: req.user._id });
    if (reqdepartment) {
      //find all faculty request
      const faculty_request = await Request.find({
        request_dep: reqdepartment._id,
        request_role: 'faculty',
      })
        .populate('request_course')
        .populate('request_by');
      allrequest.faculty = faculty_request;
    }
  }

  //check the user is teacher of any course
  if (req.user.role === 'faculty') {
    const reqcourse = await Course.find({ teacher: req.user._id });
    const courseIds = reqcourse.map((course) => course._id);
    const student_request = await Request.find({
      requestType: 'Add Course',
      request_course: { $in: courseIds },
    })
      .populate('request_by')
      .populate('request_course');
    allrequest.student = student_request;
  }
  if (req.user.role === 'User' || req.user.role === 'Student') {
    return next(
      new ApiError('You are unauthorised to aprove or decline request', 403)
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
  const { new_status } = req.body;
  //get theid from params
  const request_id = req.params.id;

  //get the request to check it existor not
  const require_request = await Request.findById(request_id);

  // get the user to make change in him
  const requser = await User.findById(require_request.request_by);

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
    //if the user is teacher then make it
    if (require_request.request_role === 'faculty') {
      reqcourse.teacher = require_request.request_by;
    }
    //add the user in course and save it
    if (requser.role === 'Student') {
      requser.course.push(require_request.request_course);
      requser.save({ validateBeforeSave: false });
      reqcourse.users.push(require_request.request_by);
    }
    reqcourse.save();
    //get the request to deleted
    const deleted_request = await Request.findByIdAndDelete(request_id);

    //check the request is deleted or not
    if (!deleted_request) {
      //if not deleted change the update and give error
      requser.course.pop();
      requser.save({ validateBeforeSave: false });
      reqcourse.users.pop();
      reqcourse.save();
      return next(new ApiError('Error in updating request', 422));
    }
  }

  //check the request is for change role
  else if (
    require_request.requestType === 'Add user' &&
    new_status === 'approved'
  ) {
    if (
      require_request.request_role === 'Student' ||
      require_request.request_role === 'faculty'
    ) {
      //find the college for which change the role
      const reqcollege = await College.findById(
        require_request.request_college
      );

      //if college not exist give error
      if (!reqcollege) {
        return next('No college found', 404);
      }
      const reqdepartment = await Department.findById(
        require_request.request_dep
      );
      if (!reqdepartment) {
        return next('No Department found', 404);
      }
      //check the  user is exist or not
      const requser = await User.findById(require_request.request_by);
      if (!requser) {
        return next(new ApiError('not found the requested User', 404));
      }
      //add the user in the college and save
      reqcollege.users.push(require_request.request_by);
      reqdepartment.user.push(require_request.request_by);
      requser.department = require_request.request_dep;
      requser.role = require_request.request_role;
      requser.currentdegree = require_request.request_degree;
      requser.college = reqcollege._id;
      requser.sem = require_request.request_sem;
      requser.year = require_request.request_year;
      requser.save({ validateBeforeSave: false });
      reqcollege.save();
      reqdepartment.save();
    } else if (
      require_request.request_dep &&
      require_request.request_role === 'HOD'
    ) {
      //find the department for which want to be hod
      const reqdepartment = await Department.findById(
        require_request.request_dep
      );
      //if department not found give error
      if (!reqdepartment) {
        return next(new ApiError('Deoartment not found', 404));
      }

      //before make hod remove subject from it
      const newcourse = await Course.updateMany(
        { teacher: require_request.request_by },
        { teacher: null },
        { runValidators: true }
      );
      //make the hod of it
      requser.course = [];
      reqdepartment.hod = require_request.request_by;
      reqdepartment.save();
      //change the role of user
      requser.role = require_request.request_role;
      requser.department = require_request.request_dep;
      requser.save({ validateBeforeSave: false });
    }

    // if update request then delete it
    const deleted_request = await Request.findByIdAndDelete(request_id);
  }

  if (new_status === 'rejected') {
    const deleted_request = await Request.findByIdAndDelete(request_id);

    if (!deleted_request) {
      return next(new ApiError('Try again later!', 422));
    }
  }
  //return sucess message
  res.status(201).json({
    message: 'request Updated Succesfully',
  });
});
