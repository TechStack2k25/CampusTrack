import College from '../models/collegemodel.js';
import Course from '../models/coursemodel.js';
import Department from '../models/departmentmodel.js';
import Message from '../models/messagemodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';
import { getroomSocketId, io } from '../utils/socket.js';

export const getmessages = asynchandler(async (req, res, next) => {
  const id2 = req.params.id;

  const allmessages = await Message.find({
    groupId: id2,
  }).sort({ createdAt: -1 }); //DESC

  const update_messages = await Message.updateMany(
    { groupId: id2 },
    {
      $addToSet: { seenBy: req.user._id },
    }
  );
  res.status(201).json({
    message: 'All Message Fetched',
    data: {
      allmessages,
    },
  });
});

export const dashboardmessages = asynchandler(async (req, res, next) => {
  const reqcourses = await Course.find({ teacher: req.user._id });
  const allcourse =
    reqcourses.length > 0
      ? reqcourses.map((course) => course?._id)
      : req.user.course;
  const allmessages = await Message.aggregate([
    {
      $match: {
        groupId: {
          $in: [req.user.college, req.user.department, ...allcourse],
        },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: '$groupId',
        messages: { $first: '$text' },
        lastMessageTime: { $first: '$createdAt' },
        unseen: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $not: [{ $in: [req.user._id, '$seenBy'] }] },
                  { $ne: ['$senderId', req.user._id] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  res.status(201).json({
    message: 'dashboard messages successfully',
    data: {
      allmessages,
    },
  });
});

export const sendmessage = asynchandler(async (req, res, next) => {
  const { text } = req.body;
  const id = req.params.id;
  if (req.user.role === 'Student') {
    return next(new ApiError('You Cannot Send the messages', 404));
  }
  if (req.user.role !== 'Admin') {
    const reqcollege = await College.findById(id);
    if (reqcollege) {
      return next(new ApiError('You Cannot Send the messages', 404));
    }
  }

  if (req.user.role !== 'HOD') {
    const reqdepartment = await Department.findById(id);
    if (reqdepartment) {
      return next(new ApiError('You Cannot Send the messages', 404));
    }
  }

  if (req.user.role !== 'faculty') {
    const reqcourse = await Course.findOne({ teacher: req.user._id });
    if (reqcourse) {
      return next(new ApiError('You Cannot Send the messages', 404));
    }
  }

  const newmessage = await Message.create({
    senderId: req.user._id,
    groupId: id,
    text,
  });

  const roomId = getroomSocketId(id);
  if (roomId) {
    io.to(roomId).emit('newMessage', newmessage);
    io.to(roomId).emit('getdashboard', newmessage);
  }
  return res.status(201).json({
    message: 'Message Sent Sucess fully',
    data: {
      newmessage,
    },
  });
});
