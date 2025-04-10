import asynchandler from '../utils/asynchandler.js';
import mongoose from 'mongoose';
import Course from './coursemodel.js';
import User from './usermodel.js';
import College from './collegemodel.js';

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
    const userIds = dept.user;

    await User.updateMany(
      { _id: { $in: userIds } },
      {
        $set: {
          role: 'User',
          department: null,
          college: null,
          currentdegree: null,
          sem: 0,
          year: 0,
          course: [],
        },
      }
    );

    const updatehod = User.findByIdAndUpdate(dept.hod, {
      $set: {
        role: 'User',
        department: null,
        college: null,
        currentdegree: null,
        sem: 0,
        year: 0,
        course: [],
      },
    });

    await Course.deleteMany({ _id: { $in: courseIds } });
  }

  next();
});

deparmentSchema.pre('findOneAndDelete', async function (next) {
  const department = await this.model.findOne(this.getQuery());

  if (!department) {
    return next(); // nothing to delete
  }

  // console.log('delete the department');
  const courseIds = department.courses;

  // Delete related courses
  const result = await Course.deleteMany({ _id: { $in: courseIds } });

  // Optional: Check if deletion failed
  if (!result) {
    return next(new Error('Error deleting courses of department', 400));
  }

  // Update users: remove department and courses
  await User.updateMany(
    { department: department._id },
    {
      $set: {
        role: 'User',
        department: null,
        college: null,
      },
    }
  );

  const updatehod = User.findByIdAndUpdate(department.hod, {
    $set: {
      role: 'User',
      department: null,
      college: null,
    },
  });

  const updatedcollege = await College.findByIdAndUpdate(department.college, {
    $pull: { department: department._id },
  });
  next();
});
const Department = new mongoose.model('Department', deparmentSchema);

export default Department;
