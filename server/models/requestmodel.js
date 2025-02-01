import mongoose from 'mongoose';

const requestSchema = mongoose.Schema({
  requestType: {
    type: String,
    required: true,
  },
  request_role: {
    type: String,
    enum: ['User', 'Student', 'facilty', 'HOD', 'admin'],
  },
  request_college: {
    type: mongoose.Types.ObjectId,
    ref: 'College',
  },
  request_course: {
    type: mongoose.Types.ObjectId,
    ref: 'Course',
  },
  request_dep: {
    type: mongoose.Types.ObjectId,
    ref: 'Department',
  },
  request_task: {
    type: mongoose.Types.ObjectId,
    ref: 'Task',
  },
  request_by: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  request_role: {
    type: String,
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
