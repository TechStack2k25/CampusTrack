import mongoose from 'mongoose';

const requestSchema = mongoose.Schema({
  requestType: {
    type: String,
    required: true,
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
  request_by: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
});

const Request = mongoose.model('Request', requestSchema);

export default Request;
