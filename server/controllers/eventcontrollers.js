import Task from '../models/taskmodel.js';
import User from '../models/usermodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';

export const addevent = asynchandler(async (req, res, next) => {
  const { description, tittle, date } = req.body;
  const newevent = await Task.create({ req, res, next });
  const requser = await User.findById(req.user._id);

  if (requser) {
    return next(new ApiError('User Not Found'));
  }

  requser.push(newevent._id);
  requser.save({ validateBeforeSave: false });
  res.status(201).json({
    message: 'event created sucessfully',
    data: {
      event: newevent,
    },
  });
});

export const getall = asynchandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ApiError('User not found', 404));
  }
  const allevent = await req.user.populate('events');
  return res.status(201).json({
    message: 'event fetch sucessfully',
    data: {
      events: allevent,
    },
  });
});
