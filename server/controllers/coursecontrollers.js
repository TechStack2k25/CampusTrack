import Course from '../models/coursemodel.js';
import Department from '../models/departmentmodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';

export const addcourse = asynchandler(async (req, res, next) => {
  //take the id of the department
  const department_id = req.params.id;

  //find the department
  const reqdepartment = await Department.findById(id);

  //check the department exist or not
  if (!reqdepartment) {
    //give the error if department not found
    return next(new ApiError('Department not found ', 422));
  }

  //take the info of course from request.body
  const { name, coursecode, credit } = req.body();

  //create the course
  const exist_course = await Course.findOne({ name, coursecode });

  //if exist give error
  if (exist_course) {
    return next(new ApiError('Course are already exist', 401));
  }

  //check the course coordinator and assign to it
  const { requser_id } = req.query;

  //check we get the user id for course coordinator
  if (!requser_id) {
    return next(new ApiError('Insufficient Information', 422));
  }

  //check the user exist or not
  const requser = await User.findById(requser_id);

  //if not exist give error
  if (!requser) {
    return next(new ApiError('Insufficient Information', 422));
  }

  //if not exist createthe course
  const newcourse = await Course.create({
    name,
    coursecode,
    credit,
    coordinator: requser_id,
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

export const getall = asynchandler(async (req, res, next) => {});

export const delcourse = asynchandler(async (req, res, next) => {});

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
  const { name, coursecode, credit } = req.body();
  //if exist update the course
  const updatedcourse = await Course.findByIdAndUpdate(
    course_id,
    {
      name,
      coursecode,
      credit,
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
