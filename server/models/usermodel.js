import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
  // is used to create the account for each user it must be unique
  email: {
    type: String,
    unique: [true, 'Email already exist'],
    require: [true, 'Please enter your email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email addrress'],
  },
  password: {
    type: String,
    require: [true, 'Please enter the password'],
    select: false,
    minlength: 8,
  },
  confirm_password: {
    type: String,
    require: [true, 'PLease enter the confirm password'],
    //validate the password and confirm password is same or not
    validate: {
      validator: function (p) {
        return p == this.password;
      },
      message: 'Password and confirm password is not same',
    },
  },
});

const User = mongoose.model('User', userSchema);
//bcrypt hash the password not encrypt
userSchema.pre('save', async function (next) {
  //check password is changed or not if changed then hash otherwise skip
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirm_password = undefined;
  this.passwordchangedat = Date.now();
  next();
});

//create the instance method to compare the pasword
User.methods.comparedbpassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default User;
