import mongoose from 'mongoose';
import Course from '../models/coursemodel.js';
import Department from '../models/departmentmodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';
import { isvaliduser } from './authcontrollers.js';
import { create_request } from './requestcontrollers.js';
import User from '../models/usermodel.js';
export const addcourse = asynchandler(async (req, res, next) => {
  //take the id of the department
  const department_id = req.params.id;

  //find the department
  const reqdepartment = await Department.findById(department_id);

  //get the id of user
  const user_id = req.user._id;

  //check the department exist or not
  if (!reqdepartment) {
    //give the error if department not found
    return next(new ApiError('Department not found ', 422));
  }
  //check user is authorised or not
  isvaliduser(reqdepartment.hod, user_id);

  //take the info of course from request.body
  let { name, coursecode, credit, teacher } = req.body;

  coursecode = coursecode.trim().toLowerCase();
  //create the course
  const exist_course = await Course.findOne({
    coursecode,
    department: department_id,
  });

  //if exist give error
  if (exist_course) {
    return next(new ApiError('Course already exists!', 400));
  }

  //check we get the user id for course teacher
  if (teacher) {
    //check the user exist or not
    const requser = await User.findById(teacher);

    //if not exist give error
    if (!requser) {
      return next(new ApiError('error to add course', 422));
    }
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

  reqdepartment.courses.push(newcourse._id);
  reqdepartment.save();
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

  //get the  id of department
  const dep_id = req.user.department;

  //check the department is exist or not
  const reqdepartment = await Department.findById(dep_id);

  //if not exist give error
  if (!reqdepartment) {
    return next(new ApiError('Department does not found', 404));
  }
  const user_id = req.user._id;
  //check user is authorised or not
  isvaliduser(reqdepartment.hod, user_id);

  //take the info from request
  const { name, coursecode, credit, teacher } = req.body;

  //if exist update the course
  const updatedcourse = await Course.findByIdAndUpdate(
    course_id,
    {
      name,
      coursecode,
      credit,
      teacher,
    },
    { new: true, runValidators: true }
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
  //check it is hod or not

  let allcourses;
  let department_id = req.params?.id;
  if (
    req.user.role == 'HOD' ||
    mongoose.Types.ObjectId.isValid(department_id)
  ) {
    if (!mongoose.Types.ObjectId.isValid(department_id))
      department_id = req.user.department;
    //check the department exist or not
    const reqdepartment = await Department.findById(department_id).populate(
      'courses'
    );
    if (!department_id) {
      isvaliduser(req.user._id, reqdepartment.hod, next);
    }
    //if not exist give error
    if (!reqdepartment) {
      return next(new ApiError('Unable to fetch the department retry it', 422));
    }
    //asign value of course to it
    allcourses = await Department.findById(department_id).populate({
      path: 'courses',
      populate: { path: 'teacher' }, // Nested population
    });
    allcourses = allcourses.courses;
  }

  //if user is faculty
  else if (req.user.role == 'faculty') {
    allcourses = await Course.find({ teacher: req.user._id }).populate(
      'teacher'
    );
  }
  //if the user is student
  else if (req.user.role === 'Student') {
    allcourses = await User.findById(req.user._id).populate({
      path: 'course',
      populate: { path: 'teacher' }, // Nested population
    });
    allcourses = allcourses.course;
  }

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
  const reqcourse = await Course.findById(course_id);

  //if course not found give error
  if (!reqcourse) {
    return next(new ApiError('Error in deleting Course', 404));
  }

  //delete the course
  const deleted_course = await Course.findByIdAndDelete(course_id);

  //check the course is deleted or not
  if (!deleted_course) {
    return next(new ApiError('Error in Deleting the course', 422));
  }

  //return the success mesage
  res.status(201).json({
    message: 'Course deleted Succesfully',
  });
});

export const add_course_by_student = asynchandler(async (req, res, next) => {
  const { course_id } = req.body;
  const reqcourse = await Course.findById(course_id);
  if (!reqcourse) {
    return next(new ApiError('Error in found the course', 404));
  }
  req.body.requestType = 'Add Course';
  req.body.course = course_id;
  // Call create_request and let it handle any errors
  // const result =
  return await create_request(req, res, next); // This will call next(error) if an error occurs
});

export const remove_student = asynchandler(async (req, res, next) => {
  //take course id from the params
  const course_id = req.params.id;

  //take the data
  const { message, student_id } = req.body;

  if (message === 'Individual' && !student_id) {
    return next(new ApiError('Give The Student Details'));
  }

  //check the course is exist or not
  const reqcourse = await Course.findById(course_id);

  if (!reqcourse) {
    return next(new ApiError('Course Not Found'));
  }
  let updatedcourse;
  //check that remove the individual student
  let student_attendance;
  if (
    reqcourse.student_attendance &&
    reqcourse.student_attendance.get(student_id)
  )
    student_attendance = reqcourse.student_attendance.delete(student_id);
  if (message === 'Individual') {
    //remove student from course
    updatedcourse = await Course.findByIdAndUpdate(
      course_id,
      {
        $pull: { users: student_id },
        student_attendance,
      },
      { new: true }
    );
    console.log(updatecourse);
    //from student remove course
    const updated_student = await User.findByIdAndUpdate(student_id, {
      $pull: { course: course_id },
    });
  } else {
    //delete courses from students
    const updated_students = await User.updateMany(
      {
        _id: { $in: reqcourse.users },
      },
      {
        $pull: { course: course_id },
        $push: { pastcourse: course_id },
      }
    );

    //remove all student from course
    updatecourse = await Course.findByIdAndUpdate(course_id, {
      users: [],
      student_attendance: new Map(),
    });
  }

  if (!updatecourse) {
    return next(new ApiError('Error in updated Course'));
  }

  res.status(201).json({
    message: 'Course Updated Successfully',
    data: {
      updatecourse,
    },
  });
});
