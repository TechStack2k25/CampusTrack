import mongoose from 'mongoose';
import asynchandler from '../utils/asynchandler.js';

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
});

courseSchema.pre('findOneAndDelete', async function (next) {
  const course = await this.model.findOne(this.getQuery());

  if (!course) {
    return next(); // Course not found, nothing to do
  }
  await User.updateMany(
    { courses: { $in: course._id } },
    { $pull: { courses: course._id } }
  );

  // Delete all tasks of the course
  const taskIds = course.task || [];
  const total_task = taskIds.length;

  const result = await Task.deleteMany({ _id: { $in: taskIds } });

  // Check if all tasks were deleted
  if (total_task !== result.deletedCount) {
    return next(new Error('Error in deleting the tasks'));
  }
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
      { courses: courseId },
      { $pull: { courses: courseId } }
    );

    // Delete all tasks of the course
    const result = await Task.deleteMany({ _id: { $in: taskIds } });

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
