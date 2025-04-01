import asynchandler from '../utils/asynchandler.js';
import mongoose from 'mongoose';
import Department from './departmentmodel.js';
import Course from './coursemodel.js';

const collegeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  degree: [String],
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
        sem: NaN,
        year: NaN,
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

const College = mongoose.model('College', collegeSchema);

export default College;
