import College from '../models/collegemodel.js';
import Department from '../models/departmentmodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';

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
  const { name, code } = req.body;

  if (!name || !code) {
    return next(new ApiError('Please Enter all the infromation', 400));
  }

  //check the department is exist or not
  const existed_department = Department.findOne({ name, code });

  //if exist return the error message
  return next(new ApiError('Department already exist', 409));

  const newdepartment = await Department.create({ name, code });

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

export const getall = asynchandler(async (req, res, next) => {});

export const deldepartment = asynchandler(async (req, res, next) => {});

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
  const { name, code } = req.body;

  //2-Update the department
  const updateddepartment = await Department.findByIdAndUpdate(
    dep_id,
    { name, code },
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
