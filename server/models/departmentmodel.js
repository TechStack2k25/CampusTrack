import asynchandler from '../utils/asynchandler.js';
import mongoose from 'mongoose';
import Course from './coursemodel.js';
import User from './usermodel.js';

const deparmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  hod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
});

deparmentSchema.pre(
  'deleteMany',
  asynchandler(async function (next) {
    //delete all the course of department
    const courseIds = this.courses;

    //store the total number of course
    const num_course = courseIds.length;

    //filter the courses and delete
    const result = await Course.deleteMany({ _id: { $in: courseIds } });

    //check all courses delete successfully
    if (result.deletedCount !== num_course) {
      return next(new ApiError('error in deleted course of department ', 422));
    }

    next();
  })
);

deparmentSchema.pre(
  'findOneAndDelete',
  asynchandler(async function (next) {
    //delete all the course of department
    const courseIds = this.courses;

    //store the total number of course
    const num_course = courseIds.length;

    //filter the courses and delete
    const result = await Course.deleteMany({ _id: { $in: courseIds } });

    //check all courses delete successfully
    if (result.deletedCount !== num_course) {
      return next(new ApiError('error in deleted course of department ', 422));
    }

    next();
  })
);
const Department = new mongoose.model('Department', deparmentSchema);

export default Department;
