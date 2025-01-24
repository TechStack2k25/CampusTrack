import Course from '../models/coursemodel.js';
import Department from '../models/departmentmodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';
import { isvaliduser } from './authcontrollers.js';

export const addcourse = asynchandler(async (req, res, next) => {
  //take the id of the department
  const department_id = req.params.id;

  //find the department
  const reqdepartment = await Department.findById(id);

  //get the id of user
  const user_id = req.user._id;

  //check user is authorised or not
  if (!isvaliduser(reqdepartment.hod, user_id)) {
    return next(new ApiError('You are unauthorised to add course'));
  }

  //check the department exist or not
  if (!reqdepartment) {
    //give the error if department not found
    return next(new ApiError('Department not found ', 422));
  }

  //take the info of course from request.body
  const { name, coursecode, credit, teacher } = req.body();

  //create the course
  const exist_course = await Course.findOne({ name, coursecode });

  //if exist give error
  if (exist_course) {
    return next(new ApiError('Course are already exist', 401));
  }

  //check we get the user id for course teacher
  if (!teacher) {
    return next(new ApiError('Insufficient Information', 422));
  }

  //check the user exist or not
  const requser = await User.findById(teacher);

  //if not exist give error
  if (!requser) {
    return next(new ApiError('error to add course', 422));
  }

  //if not exist createthe course
  const newcourse = await Course.create({
    name,
    coursecode,
    credit,
    teacher,
  });

  if (!newcourse) {
    return next(new ApiError('Failed to create the course', 422));
  }

  res.status(201).json({
    messsage: 'course added succesfully',
    data: {
      data: newcourse,
    },
  });
});

export const updatecourse = asynchandler(async (req, res, next) => {
  //get the id of the already exist course
  const course_id = req.params.id;

  //check the course is exist or not
  const reqcourse = await Course.findById(course_id);

  //if not exist give the error
  if (!reqcourse) {
    return next(new ApiError('course not found', 404));
  }

  //take the info from request
  const { name, coursecode, credit, teacher } = req.body();
  //if exist update the course
  const updatedcourse = await Course.findByIdAndUpdate(
    course_id,
    {
      name,
      coursecode,
      credit,
      teacher,
    },
    { new: true }
  );

  //return sucess response if updated succes fully
  res.status(201).json({
    message: 'course updated sucesfully',
    data: {
      data: updatedcourse,
    },
  });
});

export const getall = asynchandler(async (req, res, next) => {
  //get the id of department for which get course
  const department_id = req.params.id;

  //check the department exist or not
  const reqdepartment = await Department.findById(department_id).populate(
    'courses'
  );

  //if not exist give error
  if (!reqdepartment) {
    return next(new ApiError('Unable to fetch the department retry it', 422));
  }

  //asign value of course to it
  const allcourses = reqdepartment.courses;

  //check the course is exist or not
  if (!allcourses) {
    return next(new ApiError('Error in fetch course or No coursse exist', 422));
  }

  //return sucess message
  res.status(201).json({
    message: 'courses fetch sucessfully',
    data: {
      data: allcourses,
    },
  });
});

export const delcourse = asynchandler(async (req, res, next) => {
  //get the id of the course to deleted
  const course_id = req.params.id;

  //find the course to deleted
  const reqcourse = await Course.findById(id);

  //if course not found give error
  if (!reqcourse) {
    return next(new ApiError('Error in deleted Course', 404));
  }

  //delete the course
  const deleted_course = await Course.findByIdAndDelete(course_id);

  //check the course is deleted or not
  if (deleted_course.deletedCount !== 1) {
    return next(new ApiError('Error in Deleted the course', 422));
  }

  //return the success mesage
  res.status(201).json({
    message: 'Course deleted Succesfully',
  });
});

export const deleteall_courses = asynchandler(async (req, res, next) => {});
