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

deparmentSchema.pre('deleteMany', async function (next) {
  const filter = this.getQuery(); // filter used in deleteMany

  const departments = await this.model.find(filter);

  for (const dept of departments) {
    const courseIds = dept.courses;
    const userIds = dept.users;

    await User.updateMany(
      { _id: { $in: userIds } },
      {
        department: null,
        course: [],
      }
    );

    await Course.deleteMany({ _id: { $in: courseIds } });
  }

  next();
});

deparmentSchema.pre('findOneAndDelete', async function (next) {
  const department = await this.model.findOne(this.getQuery());

  if (!department) {
    return next(); // nothing to delete
  }

  const courseIds = department.courses;
  const userIds = department.user;

  // Delete related courses
  const result = await Course.deleteMany({ _id: { $in: courseIds } });

  // Optional: Check if deletion failed
  if (!result) {
    return next(new Error('Error deleting courses of department', 400));
  }

  // Update users: remove department and courses
  await User.updateMany(
    { _id: { $in: userIds } },
    {
      department: null,
      course: [],
    }
  );

  next();
});
const Department = new mongoose.model('Department', deparmentSchema);

export default Department;
