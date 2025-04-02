import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const userSchema = new mongoose.Schema({
  // is used to create the account for each user it must be unique
  email: {
    type: String,
    unique: [true, 'Email already exist'],
    required: [true, 'Please enter your email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email addrress'],
  },
  password: {
    type: String,
    required: [true, 'Please enter the password'],
    select: false,
    minlength: 8,
  },
  confirmpassword: {
    type: String,
    required: [true, 'PLease enter the confirm password'],
    //validate the password and confirm password is same or not
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords do not match!',
    },
  },
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  sem: {
    type: Number,
  },
  year: {
    type: Number,
  },
  department: {
    type: mongoose.Types.ObjectId,
    ref: 'Department',
  },
  college: {
    type: mongoose.Types.ObjectId,
    ref: 'College',
  },
  currentdegree: {
    type: mongoose.Types.ObjectId,
    ref: 'Degree',
  },
  course: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
  ],
  pastdegree: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Degree',
    },
  ],
  pastcolleges: [{ type: mongoose.Schema.ObjectId, ref: 'College' }],
  pastcourse: [{ type: mongoose.Schema.ObjectId, ref: 'Course' }],
  role: {
    type: String,
    enum: ['User', 'Student', 'faculty', 'HOD', 'Admin'],
    default: 'User',
  },
  events: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Task',
    },
  ],
  reward: Number,
  passwordchangedat: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailToken: String,
  emailExpires: Date,
  active: {
    type: Boolean,
    default: false,
  },
});

//bcrypt hash the password not encrypt
userSchema.pre('save', async function (next) {
  //check password is changed or not if changed then hash otherwise skip
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmpassword = undefined;
  this.passwordchangedat = Date.now();

  next();
});

//create the instance method to compare the pasword
userSchema.methods.comparedbpassword = async function (password) {
  const flag = await bcrypt.compare(password, this.password);
  return flag;
};

//check the user change the password or not
userSchema.methods.ispasswordChanged = async function (requested_time) {
  //here get time return time in millisecond while decoded acess token give time in sec
  const password_change_time = parseInt(
    this.passwordchangedat.getTime() / 1000
  );
  return password_change_time > requested_time;
};

userSchema.methods.createResettoken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createEmailtoken = function () {
  const emailToken = crypto.randomBytes(32).toString('hex');
  this.emailToken = crypto
    .createHash('sha256')
    .update(emailToken)
    .digest('hex');
  this.emailExpires = Date.now() + 10 * 60 * 1000;

  return emailToken;
};
const User = mongoose.model('User', userSchema);

export default User;
