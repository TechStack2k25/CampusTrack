import asynchandler from '../utils/asynchandler.js';
import mongoose from 'mongoose';
import Department from './departmentmodel.js';
import * as crypto from 'crypto';
const collegeSchema = mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    unique: true,
  },
  department: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deletecollegetoken: String,
  deleteTokenExpires: Date,
});

collegeSchema.pre('findOneAndDelete', async function (next) {
  try {
    // Get the college document being deleted
    const college = await this.model.findOne(this.getQuery());

    if (!college) return next(); // Nothing to delete

    const depIds = college.department;
    const userIds = college.users;

    // Update users to remove their college and related data
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

    // Delete all departments associated with the college
    const result = await Department.deleteMany({ _id: { $in: depIds } });

    // If the operation failed, throw error
    if (!result) {
      return next(new Error('Error in deleting departments of college'));
    }

    next(); // Proceed with deletion
  } catch (err) {
    next(err); // Forward error to Mongoose
  }
});

collegeSchema.methods.createdeletetoken = function () {
  const deleteToken = crypto.randomBytes(32).toString('hex');

  this.deletecollegetoken = crypto
    .createHash('sha256')
    .update(deleteToken)
    .digest('hex');

  this.deleteTokenExpires = Date.now() + 10 * 60 * 1000;

  return deleteToken;
};
const College = mongoose.model('College', collegeSchema);

export default College;
