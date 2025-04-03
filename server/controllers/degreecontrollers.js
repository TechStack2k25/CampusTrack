import College from '../models/collegemodel.js';
import Degree from '../models/degreemodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';

export const adddegree = asynchandler(async (req, res, next) => {
  //take id of college from params
  const college = req.params.id;

  //check the college exist or not
  const reqcollege = await College.findById(college);

  if (!reqcollege) {
    return next(new ApiError('No college found', 404));
  }

  //take the data from body
  const { name, totalYears, totalSemesters } = req.body;

  //check all field area available
  if (!name || !totalSemesters || !totalYears) {
    return next(new ApiError('Please Fill All Required field'));
  }

  //create the new Degreee
  const newdegree = await Degree.create({
    name,
    totalYears,
    totalSemesters,
    college,
  });

  //return error if not created

  if (!newdegree) {
    return next(new ApiError('Try Again', 422));
  }

  res.status(201).json({
    messagge: 'Degree Created Sucessfully',
    data: {
      newdegree,
    },
  });
});

export const getall = asynchandler(async (req, res, next) => {
  //get college of user
  const college = req.params.id;

  //check the college exist or not
  const reqcollege = await College.findById(college);

  if (!reqcollege) {
    return next(new ApiError('College  not found'));
  }

  //fetch the alldegree
  const alldegree = await Degree.find(reqcollege);

  //if degree not found give error
  if (!alldegree) {
    return next(new ApiError("Can't find degree try again", 422));
  }

  req.status(201).json({
    messagge: 'All Degree Fetch Sucessfully',
    data: {
      alldegree,
    },
  });
});

export const updatedegree = asynchandler(async (req, res, next) => {
  const degree = req.params.id;

  //check the degree is exist or not
  const reqdegree = await Degree.findById(degree);

  if (!reqdegree) {
    return next(new ApiError('Error in get degree', 422));
  }

  //take the data from body
  const { name, totalYears, totalSemesters } = req.body;

  //check all field area available
  if (!name && !totalSemesters && !totalYears) {
    return next(new ApiError('Please Fill All Required field'));
  }

  //update the degree
  const updateddegree = await Degree.findByIdAndUpdate(degree, {
    name,
    totalYears,
    totalSemesters,
  });

  //give error if not updated

  if (!updateddegree) {
    return next(new ApiError('Error in Updating,Try Again', 422));
  }

  res.status(201).json({
    messagge: 'Degree Updated Sucessfully',
    data: {
      updateddegree,
    },
  });
});

export const deletedegree = asynchandler(async (req, res, next) => {
  const degree = req.params.id;
  //check the degree is exist or not
  const reqdegree = await Degree.findById(degree);

  if (!reqdegree) {
    return next(new ApiError('Error in get degree', 422));
  }
  //delete the degree
  const deleteddegree = await Degree.findByIdAndDelete(degree);
  //if not delete give the error
  if (!deleteddegree) {
    return next(new ApiError('Error in deleted degree', 422));
  }

  res.status(201).json({
    messagge: 'Error in Deleting message',
  });
});

export const getdegree = asynchandler(async (req, res, next) => {
  const id = req.params.id;
  const reqdegree = await Degree.findById(id);
  res.status(201).json({
    message: 'Degree Fetched',
    data: {
      reqdegree,
    },
  });
});
