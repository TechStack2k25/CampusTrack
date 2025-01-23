import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    tasktype: {
      type: String,
      enum: ['Assignment', 'Lectures', 'Project'],
      default: 'Assignment',
    },
    chapterno: {
      type: Number,
      min: 1,
    },
    chaptername: {
      type: String,
    },
    reward_point: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'OverDue'],
      default: 'Pending',
    },
    setgoal: {
      type: Boolean,
      default: false,
    },
    goaltype: {
      type: String,
      enum: ['', 'Daily', 'Weekly'],
      default: '',
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
