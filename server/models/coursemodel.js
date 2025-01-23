import mongoose from 'mongoose';

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
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
