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

courseSchema.pre(
  'findOneAndDelete',
  asynchandler(async function (next) {
    await User.updateMany(
      { courses: this._id }, // Find users who have this course in their array
      { $pull: { courses: this._id } } // Remove course ID from their array
    );
    //delete all task of course
    const taskIds = this.task || [];

    //store the number of task
    const total_task = taskIds.length;

    //here filter the  task and delete
    const result = await Task.deleteMany({ _id: { $in: taskIds } });

    //check the all task all deleted properly
    if (total_task !== result.deletedCount) {
      return next(new ApiError('Error in deleteding the task', 422));
    }
    next();
  })
);

courseSchema.pre(
  'deleteMany',
  asynchandler(async function (next) {
    await User.updateMany(
      { courses: this._id }, // Find users who have this course in their array
      { $pull: { courses: this._id } } // Remove course ID from their array
    );
    //delete all task of course
    const taskIds = this.task || [];

    //store the number of task
    const total_task = taskIds.length;

    //here filter the  task and delete
    const result = await Task.deleteMany({ _id: { $in: taskIds } });

    //check the all task all deleted properly
    if (total_task !== result.deletedCount) {
      return next(new ApiError('Error in deleteding the task', 422));
    }
    next();
  })
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
