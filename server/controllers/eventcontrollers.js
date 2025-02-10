import Task from '../models/taskmodel.js';
import User from '../models/usermodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';

export const addevent = asynchandler(async (req, res, next) => {
  const { description, title, date } = req.body;

  const requser = await User.findById(req.user._id);
  
  if (!requser) {
    return next(new ApiError('User Not Found'));
  }

  const newevent = await Task.create({ tasktype:'Event', description, title, deadline:date });
  
  requser.events.push(newevent._id);
  requser.save({ validateBeforeSave: false });
  res.status(201).json({
    message: 'event created successfully',
    data: {
      event: newevent,
    },
  });
});

export const getall = asynchandler(async (req, res, next) => {
  
  if (!req.user) {
    return next(new ApiError('User not found', 404));
  }
  const allevent = await User.findById(req.user?._id).populate('events');

  return res.status(201).json({
    message: 'event fetch sucessfully',
    data: {
      events: allevent?.events || [],
    },
  });
});
