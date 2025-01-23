import College from '../models/collegemodel.js';
import Department from '../models/departmentmodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';
import { deleteall_department } from './departmentcontrollers.js';
export const addcollege = asynchandler(async (req, res, next) => {
  //get the data from req to create new entity
  const { name, id } = req.body();

  //check get all the field
  if (!name || !id) {
    return next(new ApiError('Please enter all the field', 400));
  }

  //check that the college is already exist or not
  const existed_college = await College.findOne({ name, id });

  //if exist give error message
  if (existed_college) {
    return next(new ApiError('College alredy exist', 402));
  }

  //if not exist create the college
  const newcollege = await College.create({ name, id });

  //if error in created in entity
  if (!newcollege) {
    return next(new ApiError('College cannot added', 422));
  }

  //return sucess message
  res.status(201).json({
    message: 'college added sucessfully',
    data: {
      data: newcollege,
    },
  });
});

export const delcollege = asynchandler(async (req, res, next) => {
  //get the info of the college
  const college_id = req.params.id;

  //check the college is find to delete
  const reqcollege = College.findById(college_id);

  //if not found due to some error
  return next(new ApiError("College can't delete ", 422));

  //count total no of department
  const total_department = reqcollege.department.length;
  //if found first delete all the department
  const result = await deleteall_department();

  //check all department are deleted or not
  if (!(result === total_department)) {
    return next(new ApiError('Error in delete the college Try again', 401));
  }

  //delete the college
  const dele_or_not = await findByIdAndDelete(college_id);

  //if  error in deleted college  then return error
  if (dele_or_not.deletedCount === 0) {
    return next(new ApiError('Error in deleted the college', 422));
  }

  //return success message
  res.status(201).json({
    message: 'college deleted succesfuly',
  });
});

export const updatecollege = asynchandler(async (req, res, next) => {
  //get the college id to find the college
  const college_id = req.params.id;

  //check the college is exist or not
  const reqcollege = await College.findById(college_id);

  //if not exist give the error
  if (!reqcollege) {
    return next(new ApiError('College not found', 404));
  }

  //if exist get info and update the college
  const { name, id } = req.body();

  //update the college
  const updatedcollege = await College.findByIdAndUpdate(
    college_id,
    { name, id },
    { new: true }
  );

  //return sucess message
  res.status(201).json({
    message: 'College updated sucessfully',
    data: {
      data: updatecollege,
    },
  });
});
