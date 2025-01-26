import mongoose from 'mongoose';
import asynchandler from '../utils/asynchandler.js';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please enter the subject name'],
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
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Course = mongoose.model('Course', courseSchema);

courseSchema.pre(
  'remove',
  asynchandler(async function (next) {
    //remove the user from facility
    const userId = this.teacher;

    //now change the role of it
    await User.updateOne({ _id: userId }, { $set: { role: 'User' } });
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
