import asynchandler from '../utils/asynchandler.js';
import Course from '../models/coursemodel.js';
import Task from '../models/taskmodel.js';
import User from '../models/usermodel.js';
import ApiError from '../utils/apierror.js';
import { isvaliduser } from './authcontrollers.js';
import mongoose from 'mongoose';
import { deleteOnCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';

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
  let alltask = [];
  let reqcourses;
  //check we want all task or task of specific course
  if (mongoose.Types.ObjectId.isValid(course_id)) {
    reqcourses = await Course.findById(course_id);

    //check course exist or not
    if (!reqcourses) {
      return next(new ApiError('Course not found', 404));
    }

    //get all courses
    reqcourses = await reqcourses.populate('task');
    if (req.user.role === 'Student') {
      alltask = reqcourses?.task?.map((tsk) => {
        const file = tsk.submitted_by?.get(req.user._id.toString()) || null;
        const taskstatus = file ? 'Submitted' : 'Pending';

        // Remove submitted_by from the final object
        const { submitted_by, ...taskWithoutSubmittedBy } = tsk.toObject
          ? tsk.toObject()
          : tsk;

        return { ...taskWithoutSubmittedBy, taskstatus, file };
      });
    } else {
      alltask = reqcourses.task;
    }
  } else {
    const courseIds = req.user.course;
    //  get all the course of all ids
    reqcourses = await Course.find({ _id: { $in: courseIds } }).populate(
      'task'
    );

    reqcourses.forEach((course) => {
      course.alltask = course.task.map((tsk) => {
        // Ensure tsk is a plain object
        const taskObject = tsk.toObject ? tsk.toObject() : tsk;

        // Extract file from submitted_by
        const file =
          taskObject.submitted_by?.get(req.user._id?.toString()) || null;
        const taskstatus = file ? 'Submitted' : 'Pending';

        // Remove submitted_by field
        const { submitted_by, ...taskWithoutSubmittedBy } = taskObject;
        return {
          ...taskWithoutSubmittedBy,
          taskstatus,
          file,
          coursename: course?.name,
        };
      });
      alltask = [...alltask, ...course?.alltask];
    });
  }
  res.status(201).json({
    message: 'tasks fetch suceesfully',
    data: {
      data: alltask,
    },
  });
});

export const getall_submission = asynchandler(async (req, res, next) => {
  if (req.user.role !== 'faculty') {
    return next(new ApiError('You cannot perform that action'));
  }
  const course_id = req.params.id;

  const reqcourse = await Course.findById(course_id);

  if (!reqcourse) {
    return next(new ApiError('Course not found', 422));
  }
  let alltasks = await Task.find({ _id: { $in: reqcourse.task } });
  // console.log(alltasks);
  const userIdsSet = new Set();

  alltasks.forEach((task) => {
    if (task.submitted_by instanceof Map) {
      task.submitted_by.forEach((value, key) => {
        userIdsSet.add(key);
      });
    }
  });

  const userIds = Array.from(userIdsSet);

  const all_users = await User.find({ _id: { $in: userIds } }).select(
    '-department -college -currentdegree -course -pastdegree -pastcolleges -qualification -pastcourse -events'
  );

  alltasks = alltasks.map((task) => {
    const { submitted_by } = task;

    const task_users = all_users.map((user) => {
      const file = submitted_by.get(user._id?.toString());
      if (file) {
        const userData = user?.toObject();
        // console.log(userData);

        return { ...userData, file };
      }
    });
    return { task, task_users };
  });
  res.status(201).json({
    message: 'All task fetch successfully',
    data: {
      data: { alltasks, reqcourse },
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
  console.log(req?.body?.file);

  const uploadedfile = await uploadOnCloudinary(req.file.path);

  if (!uploadedfile.url) {
    return next(new ApiError('Error in Submitted Assignment', 444));
  }

  const submitted_file = reqtask.submitted_by.get(req.user._id.toString());

  const userreward = await User.findById(req.user._id);
  if (!submitted_file) {
    let fixedpoint, varpoint;
    if (reqtask.tasktype === 'Assignment') {
      fixedpoint = 70.0;
      varpoint = 1.0;
    } else if (tasktype === 'Project') {
      fixedpoint = 150.0;
      varpoint = 1.5;
    }
    //to adjust the global time to indian time
    const istOffset = 5.5 * 60 * 60 * 1000;
    const newdeadline = new Date(reqtask.deadline - istOffset).getTime();
    const newDate = new Date(Date.now()).getTime();
    const variable = (newdeadline - newDate) / (1000 * 3600);
    //add the point to the user total point on thne basis of time he submit
    let temp = fixedpoint + varpoint * variable;
    temp = temp > 1.75 * fixedpoint ? 1.75 * fixedpoint : temp;
    temp > fixedpoint / 2
      ? (userreward.reward = Math.ceil(userreward.reward + temp))
      : (userreward.reward = Math.ceil(fixedreward / 2));
  }
  if (submitted_file) {
    temp = temp > fixedpoint / 2 ? temp : fixedpoint / 2;
    userreward.reward = userreward.reward - 1.75 * fixedpoint + temp;
    await deleteOnCloudinary(submitted_file);
  }
  //now save the user reward
  userreward.save();
  reqtask.submitted_by.set(req.user._id, uploadedfile.url);
  reqtask.save();

  res.status(201).json({
    message: 'Assignment Submitted successfully',
  });
});
