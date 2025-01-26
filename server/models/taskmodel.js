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
      enum: ['Assignment', 'Project'],
      default: 'Assignment',
    },
    reward_point: {
      type: Number,
    },
    deadline: {
      type: Date,
    },
    submitted_by: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        file: {
          type: String,
        },
      },
    ],
    course: {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
