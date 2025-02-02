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
  const { requestType, course, college, dep_id, task, file, role, year } =
    req.body;

  //get the data of user from req.user
  const requser = req.user;

  //check the request is type of add student and add course
  if (!requestType) {
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
      request_role: req.user.role,
      request_dep: req.user.department,
    });

    //check request is created sucessfully or not
    if (!newrequest) {
      return next(new ApiError('Error in generated request.Try again', 404));
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
        return next(new ApiError('Error in generated request.Try again', 404));
      }

      //create the request
      const newrequest = await Request.create({
        requestType,
        request_college: reqcollege._id,
        request_by: requser._id,
        request_role: role,
        request_dep: reqdepartment._id,
        request_year: year,
      });

      ///check the request is created or not
      if (!newrequest) {
        return next(new ApiError('Error in generated request.Try again', 404));
      }
    }

    //if the user want to be hod
    else if (role === 'HOD') {
      const department = req.user.department;
      //check the department is exist or not

      if (req.user.role !== 'faculty') {
        return next(new ApiError('You Cannot Request to be HOD', 401));
      }

      const reqdepartment = await Department.findById(department);

      //give error if department noy found
      if (!reqdepartment) {
        return next(new ApiError('Department Not found', 404));
      }
      const newrequest = await Request.create({
        requestType,
        request_dep: reqdepartment._id,
        request_by: requser._id,
        request_role: role,
      });
    }
  }

  //create request for submissin of task
  // else if (requestType === 'Submit Task') {
  //   if (!task) {
  //     return next(new ApiError('To submit task it not found', 404));
  //   }
  //   const newrequest = await Request.create({
  //     requestType,
  //     request_course: course,
  //     request_task: task,
  //     request_by: req.user._id,
  //     request_file: file,
  //   });

  //   if (!newrequest) {
  //     return next(
  //       new ApiError('Error in create request for submit assignment', 422)
  //     );
  //   }
  // }
  return 1;
});

export const getall_request = asynchandler(async (req, res, next) => {
  //take the data of user from req.user
  const user_id = req.user._id;

  //declare the variable for request
  let allrequest = {};

  //check the useris admin or not
  const reqcollege = await College.findOne({ admin: user_id });

  //check the user is admin of any college
  if (reqcollege && req.user.role === 'Admin') {
    const user_request = await Request.find({
      request_college: reqcollege._id,
    })
      .populate('request_by')
      .populate('request_dep');

    const hod_request = await Request.find({
      request_role: 'HOD',
      request_dep: { $in: reqcollege.department },
    })
      .populate('request_by')
      .populate('request_dep');

    allrequest.user = user_request; // Assign user requests
    allrequest.hod = hod_request;
  }

  //check the user is hod or not
  const reqdepartment = await Department.findOne({ hod: req.user._id });
  if (reqdepartment) {
    //find all faculty request
    // console.log(reqdepartment);
    const faculty_request = await Request.find({
      request_dep: reqdepartment._id,
      request_role: 'faculty',
    }).populate('request_course').populate('request_by');
    allrequest.faculty = faculty_request;
  }

  //check the user is teacher of any course
  if (req.user.role === 'faculty') {
    const reqcourse = await Course.find({ teacher: req.user._id });
    const courseIds = reqcourse.map((course) => course._id);
    console.log(courseIds)
    const student_request = await Request.find({
      requestType: 'Add Course',
      request_course: { $in: courseIds },
    }).populate('request_by').populate('request_course');

    //to get all submit request
    const submit_request = await Request.find({
      requestType: 'Sunmit Task',
      request_course: { $in: courseIds },
    });
    allrequest.student = student_request;
    allrequest.submit = submit_request;
  }
  if (req.user.role === 'User' || req.user.role === 'Student') {
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
  const { new_status } = req.body;
  console.log(new_status);
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
    console.log(require_request.requestType);

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
    requser.course.push(require_request.request_by);
    requser.save({ validateBeforeSave: false });
    reqcourse.users.push(require_request.request_by);
    reqcourse.save();
    //get the request to deleted
    const deleted_request = await Request.findByIdAndDelete(request_id);

    //check the request is deleted or not
    if (deleted_request.deletedCount === 0) {
      //if not deleted change the update and give error
      requser.course.pop();
      requser.save({ validateBeforeSave: false });
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
      //check the  user is exist or not
      const requser = await User.findById(require_request.request_by);
      if (!requser) {
        return next(new ApiError('not found the requested User', 404));
      }
      //add the user in the college and save
      reqcollege.users.push(require_request.request_by);
      requser.department = require_request.request_dep;
      requser.role = require_request.request_role;
      requser.year = require_request.request_year;
      requser.save({ validateBeforeSave: false });
      reqcollege.save();
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

      //make the hod of it
      reqdepartment.hod = require_request.request_by;
      reqdepartment.save();
      //change the role of user
      requser.role = require_request.request_role;
      requser.department = require_request.request_dep;
      requser.save({ validateBeforeSave: false });
    }

    // if update request then delete it
    const deleted_request = await Request.findByIdAndDelete(request_id);

    //  // check the request is deleted or not
    //   if (deleted_request.deletedCount === 0) {
    //     //if not delete update the change
    //     reqcollege.users.pop();
    //     reqcollege.save();
    //     return next(new ApiError('Error in updating request', 422));
    //   }
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

  if(new_status==='rejected'){
    const deleted_request = await Request.findByIdAndDelete(request_id);

  if(!deleted_request){
    return next(new ApiError('Try again later!', 422));
  }
  }
  //return sucess message
  res.status(201).json({
    message: 'request Updated Succesfully',
  });
});
