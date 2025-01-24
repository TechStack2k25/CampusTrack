import College from '../models/collegemodel.js';
import Department from '../models/departmentmodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';
import { deleteall_courses } from './coursecontrollers.js';

export const adddepartment = asynchandler(async (req, res, next) => {
  //get thed id of college
  const college_id = req.params.id;

  //check the college is exist or not
  const reqcollege = await College.findById(college_id);

  //if not exist give error
  if (!reqcollege) {
    return next(new ApiError('College not found', 404));
  }

  //take the info from request
  const { name, code, hod } = req.body;

  if (!name || !code) {
    return next(new ApiError('Please Enter all the infromation', 400));
  }

  //check the department is exist or not
  const existed_department = Department.findOne({ name, code });

  //if exist return the error message
  return next(new ApiError('Department already exist', 409));

  const newdepartment = await Department.create({
    name,
    code,
    hod,
    college: reqcollege,
  });

  //add the department in college
  reqcollege.push_back(newdepartment._id);
  reqcollege.save();
  //return sucesss message
  res.status(201).json({
    message: 'Department created succesfully',
    data: {
      data: newdepartment,
    },
  });
});

export const updatedepartment = asynchandler(async (req, res, next) => {
  //take the id of the department
  const dep_id = req.params.id;

  //check the department is exist or not
  const existed_dep = await Department.findById(id);

  //if exit return error message
  if (!existed_dep) {
    return next(new ApiError('Department not found', 422));
  }

  //if exit update the course
  //1- get the info from request
  const { name, code, hod } = req.body;

  //2-Update the department
  const updateddepartment = await Department.findByIdAndUpdate(
    dep_id,
    { name, code, hod },
    { new: true }
  );

  //return the sucess message
  res.status(201).json({
    message: 'department updated successfully',
    data: {
      data: updateddepartment,
    },
  });
});

export const getall = asynchandler(async (req, res, next) => {
  //get the id of college
  const college_id = req.body;

  //check the college exist or not
  const reqcollege = await College.findById(college_id);

  //if not exist return error
  if (!reqcollege) {
    return next(new ApiError('College not found ', 404));
  }

  //if exist return all department
  const all_department = await Department.findMany({
    college: college_id,
  }).populate('department');

  //check department fetch successfull or not
  if (!all_department) {
    return next(new ApiError('Error in find all department', 422));
  }

  //return sucess message
  return res.status(201).json({
    message: 'department fetch sucessfully',
    data: {
      data: all_department,
    },
  });
});

export const deldepartment = asynchandler(async (req, res, next) => {
  //get the id of department from params
  const dep_id = req.params.id;

  //find the department to delete it
  const find_dep = Department.findById(dep_id);

  //if not found return error
  if (!dep_id) {
    return next(new ApiError('Department not found to delete', 404));
  }
  //store the no. of courses of that department
  const num_course = find_dep.courses.length;

  //delete the department
  const dele_or_not = await findByIdAndDelete(dep_id);

  //check department is deleted or not
  if (dele_or_not.deletedCount === 0) {
    return next(new ApiError('Error in deleted department', 422));
  }

  //return sucess message
  res.status(201).json({
    message: 'department deleted sucessfully',
  });
});

export const deleteall_department = (college_id) =>
  asynchandler(async (req, res, next) => {});
