import asynchandler from '../utils/asynchandler.js';
import Course from '../models/coursemodel.js';
import Task from '../models/taskmodel.js';
import User from '../models/usermodel.js';
import ApiError from '../utils/apierror.js';
import Reward from '../models/rewardmodel.js';

export const addtask = asynchandler(async (req, res, next) => {
  //get the id from params
  const id = req.params.id;

  //get  the course to add task
  const reqcourse = await Course.findById(id);

  //check course exist or not if not exist give error
  if (!reqcourse) {
    next(new ApiError('Course does not exist', 404));
  }

  //create the task to add the course
  //1-get the data from the request
  const {
    title,
    description,
    tasktype,
    chapterno,
    chaptername,
    setgoal,
    goaltype,
    deadline,
    duration,
    status,
  } = req.body;

  //2-create task
  if (!title || !tasktype || !(deadline || duration)) {
    return next(new ApiError('Enter the required field', 422));
  }

  const newtask = await Task.create(
    title,
    description,
    tasktype,
    chapterno,
    chaptername,
    setgoal,
    goaltype,
    deadline,
    duration,
    status
  );

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

export const getall = asynchandler(async (req, res, next) => {});

export const deltask = asynchandler(async (req, res, next) => {});

export const updatetask = asynchandler(async (req, res, next) => {
  //get the id of the task
  const id = req.params.id;

  //search the task to check it exist or not
  const reqtask = await Task.findById(id);

  //if not exist return error message of not found
  if (!reqtask) {
    return next(new ApiError('Task is not found'), 404);
  }

  //take the data from request
  const {
    title,
    description,
    tasktype,
    chapterno,
    chaptername,
    setgoal,
    goaltype,
    deadline,
    duration,
    status,
  } = req.body;

  //check the previous status task is alredy submit or submit now
  const prevstatus = reqtask.status;

  //to check previous task is set as goal or ot
  const prevgoal = reqtask.setgoal;

  //now update the task
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    {
      title,
      description,
      tasktype,
      chapterno,
      chaptername,
      setgoal,
      status,
      goaltype,
      deadline,
      duration,
    },
    { new: true, runValidators: true }
  );

  //check the assignment status change or not
  //if change to completed add the rewardpoint
  if (status && status === 'Completed' && prevstatus === 'Pending') {
    //take the id of user from req
    const id = req.user._id;

    //find thre user by it id
    const addrewarduser = await User.findById(id);

    //get the id of model of reward of user
    const reward_id = addrewarduser.reward;

    //find the id of reward model
    let userreward = await Reward.findById(reward_id);

    //check the reward is exist or not
    let reward_model;
    if (!userreward) {
      //if not exist create the reward
      userreward = await Reward.create();
    }

    //take two variable for submission and another for how early or late he submitted
    let fixedpoint, varpoint;
    if (updatedTask.tasktype === 'Assignment') {
      fixedpoint = 70.0;
      varpoint = 1.0;
    } else if (tasktype === 'Project') {
      fixedpoint = 150.0;
      varpoint = 1.5;
    } else {
      fixedpoint = 50.0;
      varpoint = 1.0;
    }
    //to adjust the global time to indian time
    const istOffset = 5.5 * 60 * 60 * 1000;
    const newdeadline = new Date(updatedTask.deadline - istOffset).getTime();
    const newDate = new Date(Date.now()).getTime();
    const variable = (newdeadline - newDate) / (1000 * 3600);

    //add the point to the user total point on thne basis of time he submit
    fixedpoint + varpoint * variable > fixedpoint / 2
      ? (userreward.total_point = Math.ceil(
          userreward.total_point + fixedpoint + varpoint * variable
        ))
      : (userreward.total_point = Math.ceil(fixedpoint / 2));

    //now save the user reward
    userreward.save();
  }

  //check the user completed your goal
  if (setgoal && !prevgoal) {
    //take the id of user from req
    const id = req.user._id;

    //find thre user by it id
    const addrewarduser = await User.findById(id);

    //get the id of model of reward of user
    const reward_id = addrewarduser.reward;

    //find the id of reward model
    let userreward = await Reward.findById(reward_id);

    //check the reward is exist or not
    let reward_model;
    if (!userreward) {
      //if not exist create the reward
      userreward = await Reward.create();
    }
    let point = 0;
    if (goaltype === 'Daily') point = 60;
    else point = 20;

    userreward.total_point = userreward.total_point + point;

    //now save the user reward
    userreward.save();
  }

  res.status(201).json({
    message: 'Task Updated Sucessfully',
    data: {
      updatedTask,
    },
  });
});
