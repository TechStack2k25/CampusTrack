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
    required: true,
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

collegeSchema.pre(
  'findOneAndDelete',
  asynchandler(async function (next) {
    //delete all department college
    const depIds = this.department;

    //remove the user from college
    const userId = this.users;

    //now change the role of it
    await User.updateMany(
      { _id: { $in: userId } },
      {
        $set: { role: 'User' },
        department: null,
        college: null,
        currentdegree: null,
        sem: 0,
        year: 0,
        course: [],
      }
    );

    //filter the courses and delete
    const result = await Department.deleteMany({ _id: { $in: depIds } });

    //check all courses delete successfully
    if (result.acknowledged) {
      return next(new ApiError('error in deleted course of department ', 422));
    }
  })
);

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
