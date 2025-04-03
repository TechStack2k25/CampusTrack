import College from '../models/collegemodel.js';
import Department from '../models/departmentmodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';
import { isvaliduser } from './authcontrollers.js';
export const addcollege = asynchandler(async (req, res, next) => {
  //get the data from req to create new entity
  let { name, id, degree } = req.body;
  id = id.trim().toLowerCase();
  //check get all the field
  if (!name || !id) {
    return next(new ApiError('Please enter all the field', 400));
  }

  //check that the college is already exist or not
  const existed_college = await College.findOne({ id });

  //if exist give error message
  if (existed_college) {
    return next(new ApiError('College alredy exist', 402));
  }

  //if not exist create the college
  const newcollege = await College.create({
    name,
    id,
    degree,
    admin: req.user._id,
  });

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

export const getcollege = asynchandler(async (req, res, next) => {
  //get the info of the college
  const college_id = req.params.id;

  //check the college is find to delete
  const reqcollege = await College.findById(college_id);

  //if not found due to some error
  if (!reqcollege) {
    return next(new ApiError("College can't delete ", 422));
  }

  //return success message
  res.status(201).json({
    message: 'fetched college successfuly',
    data: reqcollege,
  });
});
export const delcollege = asynchandler(async (req, res, next) => {
  //get the info of the college
  const college_id = req.params.id;

  //check the college is find to delete
  const reqcollege = await College.findById(college_id);

  //if not found due to some error
  if (!reqcollege) {
    return next(new ApiError("College can't delete ", 422));
  }

  //delete the college
  const dele_or_not = await College.findByIdAndDelete(college_id);

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

  //check valid user or not
  isvaliduser(req.user._id, reqcollege.admin, next);

  //if exist get info and update the college
  const { name, id, degree } = req.body;

  //update the college
  const updatedcollege = await College.findByIdAndUpdate(
    college_id,
    { name, id, degree },
    { new: true }
  );

  //return sucess message
  res.status(201).json({
    message: 'College updated sucessfully',
    data: {
      data: updatedcollege,
    },
  });
});
