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
    type: String,
  },
  request_course: {
    type: mongoose.Types.ObjectId,
    ref: 'Course',
  },
  request_dep: {
    type: String
  },
  request_task: {
    type: mongoose.Types.ObjectId,
    ref: 'Task',
  },
  request_by: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
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
});

const Request = mongoose.model('Request', requestSchema);

export default Request;
