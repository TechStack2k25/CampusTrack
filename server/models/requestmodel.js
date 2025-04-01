import mongoose from 'mongoose';

const requestSchema = mongoose.Schema({
  requestType: {
    type: String,
    required: true,
  },
  request_role: {
    type: String,
    enum: ['User', 'Student', 'faculty', 'HOD', 'Admin'],
  },
  request_college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
  request_course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  request_dep: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  request_task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
  request_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  request_degree: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Degree',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  request_file: {},
  request_year: {
    type: Number,
  },
  request_sem: {
    type: Number,
  },
});

const Request = mongoose.model('Request', requestSchema);

export default Request;
