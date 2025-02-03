import asynchandler from '../utils/asynchandler.js';
import Course from '../models/coursemodel.js';
import Task from '../models/taskmodel.js';
import User from '../models/usermodel.js';
import ApiError from '../utils/apierror.js';
import Reward from '../models/rewardmodel.js';
import { create_request } from './requestcontrollers.js';
import { isvaliduser } from './authcontrollers.js';

export const addtask = asynchandler(async (req, res, next) => {
  //get the course id
  const course_id = req.params.id;

  //check the course exist or not
  const reqcourse = await Course.findById(course_id);

  //check course is exist or not
  if (!reqcourse) {
    return next(new ApiError('Course not found', 404));
  }
  //check authorised or not
  isvaliduser(req.user._id, reqcourse.teacher);

  //create task and add to course
  //get the data from the request
  const { title, description, tasktype, reward_point, deadline } = req.body;

  //check all required field get or not
  if (!title || !deadline || !reward_point) {
    return next(new ApiError('Enter the required field', 422));
  }

  //create task
  const newtask = await Task.create({
    title,
    description,
    tasktype,
    deadline,
    reward_point,
    course: reqcourse,
  });

  // add the id of the task in course
  reqcourse.task.push(newtask._id);
  reqcourse.save();

  //if added succesfully response to it
  res.status(201).json({
    message: 'task added succesfully',
    data: {
      data: newtask,
    },
  });
});

export const getall = asynchandler(async (req, res, next) => {
  const course_id = req.params.id;
  let alltasks = [];
  //check we want all task or task of specific course
  if (mongoose.Types.ObjectId.isValid(course_id)) {
    const reqcourse = await Course.findById(course_id);

    //check course exist or not
    if (!reqcourse) {
      return next(new ApiError('Course not found', 404));
    }

    //get all courses
    alltasks = await reqcourse.populate('task');
  }

  const courseIds = req.user.course;
  //  get all the course of all ids
  const reqcourses = await Course.find({ _id: { $in: courseIds } }).populate(
    'tasks'
  );

  //get all the tasks
  reqcourses.forEach((course) => {
    alltasks.push(...course.task);
  });

  res.status(201).json({
    message: 'tasks fetch suceesfully',
    data: {
      data: alltasks,
    },
  });
});

export const deltask = asynchandler(async (req, res, next) => {
  const task_id = req.params.id;

  //check the task is exist or not
  const reqtask = await Task.findById(task_id);

  //if not exist give error
  if (!reqtask) {
    return next(new ApiError('Task not found to delete', 404));
  }

  //get the course for get id of authorisd user
  const reqcourse = await Course.findById(reqtask.course);

  //if course not found give error
  if (!reqcourse) {
    return next(new ApiError('Course not found', 404));
  }

  //check the user is authorised or not
  isvaliduser(req.user._id, reqcourse.teacher);

  //delete the task
  const result = await Task.findByIdAndDelete(task_id);

  //check the task is deleted or not
  if (result.deletedCount === 0) {
    return next(new ApiError('error in deleting the task', 422));
  }

  //return sucess message
  res.status(201).json({
    message: 'task deleted sucessfully',
  });
});

export const updatetask = asynchandler(async (req, res, next) => {
  // get the id of the task
  const id = req.params.id;
  //search the task to check it exist or not
  const reqtask = await Task.findById(id);
  //if not exist return error message of not found
  if (!reqtask) {
    return next(new ApiError('Task is not found'), 404);
  }
  //take the data from request
  const { title, description, tasktype, deadline, reward_point } = req.body;

  //find the course
  const reqcourse = await Course.findById(reqtask.course);

  //check the course is exist or not
  if (!reqcourse) {
    return next(new ApiError('Coursse not found', 404));
  }

  //check the user is authorised or not
  isvaliduser(req.user._id, reqcourse.teacher);

  //now update the task
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    {
      title,
      description,
      tasktype,
      deadline,
      reward_point,
    },
    { new: true, runValidators: true }
  );
  res.status(201).json({
    message: 'Task Updated Sucessfully',
    data: {
      data: updatedTask,
    },
  });
});

export const submittask = asynchandler(async (req, res, next) => {
  //get the task_id from params
  const task_id = req.params.id;

  //find the task from task id
  const reqtask = await Task.findById(task_id);

  //if task not found give error
  if (!reqtask) {
    return next(new ApiError('Task not found', 404));
  }

  //add some point in request object
  req.body.requestType = 'Submit Task';
  req.body.course = reqtask.course;
  req.body.task = task_id;

  //create request for submit task
  create_request(req, res, next);

  //on sucessfull return sucesss message
  res.status(201).json({
    message: 'request for submit assignment created sucessfully',
  });
});

// //check the previous status task is alredy submit or submit now
// const prevstatus = reqtask.status;
// //to check previous task is set as goal or ot
// const prevgoal = reqtask.setgoal;
//take the id of user from req
//    const id = req.user._id;
//    //find thre user by it id
//    const addrewarduser = await User.findById(id);
//    //get the id of model of reward of user
//    const reward_id = addrewarduser.reward;
//    //find the id of reward model
//    let userreward = await Reward.findById(reward_id);
//    //check the reward is exist or not
//    let reward_model;
//    if (!userreward) {
//      //if not exist create the reward
//      userreward = await Reward.create();
//    }
//    //take two variable for submission and another for how early or late he submitted
//    let fixedpoint, varpoint;
//    if (updatedTask.tasktype === 'Assignment') {
//      fixedpoint = 70.0;
//      varpoint = 1.0;
//    } else if (tasktype === 'Project') {
//      fixedpoint = 150.0;
//      varpoint = 1.5;
//    } else {
//      fixedpoint = 50.0;
//      varpoint = 1.0;
//    }
//    //to adjust the global time to indian time
//    const istOffset = 5.5 * 60 * 60 * 1000;
//    const newdeadline = new Date(updatedTask.deadline - istOffset).getTime();
//    const newDate = new Date(Date.now()).getTime();
//    const variable = (newdeadline - newDate) / (1000 * 3600);
//    //add the point to the user total point on thne basis of time he submit
//    fixedpoint + varpoint * variable > fixedpoint / 2
//      ? (userreward.total_point = Math.ceil(
//          userreward.total_point + fixedpoint + varpoint * variable
//        ))
//      : (userreward.total_point = Math.ceil(fixedpoint / 2));
//    //now save the user reward
//    userreward.save();
//  }
//  //check the user completed your goal
//  if (setgoal && !prevgoal) {
//    //take the id of user from req
//    const id = req.user._id;
//    //find thre user by it id
//    const addrewarduser = await User.findById(id);
//    //get the id of model of reward of user
//    const reward_id = addrewarduser.reward;
//    //find the id of reward model
//    let userreward = await Reward.findById(reward_id);
//    //check the reward is exist or not
//    let reward_model;
//    if (!userreward) {
//      //if not exist create the reward
//      userreward = await Reward.create();
//    }
//    let point = 0;
//    if (goaltype === 'Daily') point = 60;
//    else point = 20;
//    userreward.total_point = userreward.total_point + point;
//    //now save the user reward
//    userreward.save();
//  }
