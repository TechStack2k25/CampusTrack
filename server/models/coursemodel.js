import mongoose from 'mongoose';
import asynchandler from '../utils/asynchandler.js';
import Store from './storemodel.js';
import User from './usermodel.js';
import Task from './taskmodel.js';
import Department from './departmentmodel.js';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter the subject name'],
  },
  coursecode: {
    type: String,
    required: [true, 'Please enter the subject code'],
  },
  credit: {
    type: Number,
    required: [true, 'Please Enter the credit'],
    min: 2,
    max: 5,
  },
  task: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  student_attendance: {
    type: Map,
    of: Number, // Maps student ID to the number of classes attended
    default: {},
  },
  total_classes: {
    type: Number,
    default: 0, // This will hold the total number of classes held
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
});

courseSchema.pre('findOneAndDelete', async function (next) {
  const course = await this.model.findOne(this.getQuery());

  if (!course) {
    return next(); // Course not found, nothing to do
  }

  // console.log(course._id);
  await User.updateMany(
    { course: { $in: course._id } },
    { $pull: { course: course._id } }
  );

  // Delete all tasks of the course
  const taskIds = course.task || [];
  const total_task = taskIds.length;

  const result = await Task.deleteMany({ _id: { $in: taskIds } });
  const result2 = await Store.deleteMany({ course: course._id });
  // Check if all tasks were deleted
  if (total_task !== result.deletedCount) {
    return next(new Error('Error in deleting the tasks'));
  }

  const updateddepartment = await Department.findByIdAndUpdate(
    course.department,
    {
      $pull: { courses: course._id },
    }
  );
  next();
});

courseSchema.pre('deleteMany', async function (next) {
  const filter = this.getQuery();

  const courses = await this.model.find(filter);

  for (const course of courses) {
    const courseId = course._id;
    const taskIds = course.task || [];

    // Remove the course from all users who have it
    await User.updateMany(
      { course: courseId },
      { $pull: { course: courseId } }
    );

    // Delete all tasks of the course
    const result = await Task.deleteMany({ _id: { $in: taskIds } });
    const result2 = await Store.deleteMany({ course: course._id });
    // Check if task deletion count matches
    if (!result) {
      return next(
        new Error('Error in deleting some tasks for course: ' + courseId)
      );
    }
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
