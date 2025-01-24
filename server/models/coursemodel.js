import mongoose from 'mongoose';
import asynchandler from '../utils/asynchandler';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please enter the subject name'],
  },
  department: {
    type: String,
    require: [true, 'Please enter the department'],
  },
  coursecode: {
    type: String,
    require: [true, 'Please enter the subject code'],
  },
  credit: {
    type: Number,
    require: [true, 'Please Enter the credit'],
    min: 2,
    max: 5,
  },
  task: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Course = mongoose.model('Course', courseSchema);

courseSchema.pre(
  'remove',
  asynchandler(async function (next) {
    //delete all task of course
    const taskIds = this.task;

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
export default Course;
