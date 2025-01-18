import mongoose from 'mongoose';
import validator from 'validator';

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

export default User;
