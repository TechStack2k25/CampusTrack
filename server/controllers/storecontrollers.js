import Course from '../models/coursemodel.js';
import Store from '../models/storemodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const getall = asynchandler(async (req, res, next) => {
  const course = req.params.id;

  const reqcourse = await Course.findById(course);

  if (!reqcourse) {
    return next(new ApiError('Course Not found', 404));
  }

  const allresources = await Store.find({ course });

  res.status(201).json({
    message: 'All Resource fetched',
    data: {
      allresources,
      course:reqcourse,
    },
  });
});

export const deleteresource = asynchandler(async (req, res, next) => {
  const id = req.params._id;

  if (!id) {
    return next(new ApiError('Course Material Not Found Try again', 404));
  }

  const deletedstore = await Store.findByIdAndDelete(id);

  if (!deletedstore.acknowledged) {
    return next(new ApiError('Error in Deleting And Try Again', 404));
  }

  res.status(201).json({
    message: 'Resource Delete Successsfully',
  });
});

export const addresource = asynchandler(async (req, res, next) => {
  const id = req.params.id;
  const { lecture, part } = req.body;
  const reqcourse = await Course.findById(id);

  if (!reqcourse) {
    return next(new ApiError('cousre not found', 404));
  }

  const uploadedfile = await uploadOnCloudinary(req.file.path);

  if (!uploadedfile?.url) {
    return next(new ApiError('Error in Uploading Resource', 444));
  }

  const uploadedresource = await Store.create({
    course: id,
    resource: uploadedfile?.url,
    lecture,
    part,
  });

  if (!uploadedresource) {
    return next(new ApiError('Resource Uploaded sucessfully'));
  }

  res.status(201).json({
    message: 'Resource uploaded Sucessfully',
    data: {
      uploadedresource,
    },
  });
});
