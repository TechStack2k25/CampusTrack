import asynchandler from '../utils/asynchandler.js';
import User from '../models/usermodel.js';
import ApiError from '../utils/apierror.js';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import Email from '../utils/emailhandler.js';
import * as crypto from 'crypto';
//to create acess and refreshtoken
const createacessandrefreshtoken = (id) => {
  //await is not used it is synchronous it generate token and return immediately
  //use header(consist metadata) payload and secret string create signature
  const acesstoken = jwt.sign({ id: id }, process.env.ACESS_SECRET_STR, {
    expiresIn: process.env.ACESS_SECRET_EXPIRES,
  });

  const refreshtoken = jwt.sign({ id: id }, process.env.REFRESH_SECRET_STR, {
    expiresIn: process.env.REFRESH_SECRET_EXPIRES,
  });

  return [acesstoken, refreshtoken];
};
//add username for signup later
export const signup = asynchandler(async (req, res, next) => {
  //take the value from request
  let { email, password, confirmpassword } = req.body;
  email = email.trim().toLowerCase();
  password = password.trim();
  confirmpassword = confirmpassword.trim();
  //check email password and confiem password are not missing
  if (!email || !password || !confirmpassword) {
    return next(new ApiError('All field are required', 400));
  }

  // check the user already exist or not
  const existeduser = await User.findOne({ email: email });

  //if already exist
  if (existeduser) {
    return next(new ApiError('Email already exist', 409));
  }

  //now create the user
  const newuser = await User.create({
    email,
    password,
    confirmpassword,
  });

  //create the acess and refresh token for authentication
  const [acesstoken, refreshtoken] = createacessandrefreshtoken(newuser._id);

  //check the acess and refreshtoken is generated or not
  if (!refreshtoken || !acesstoken) {
    return next(new ApiError('token cannot generated', 400));
  }

  //send the cookie
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  };

  res
    .cookie('acesstoken', acesstoken, options)
    .cookie('refreshtoken', refreshtoken, options);
  //return success message
  res.status(201).json({
    message: 'User Account created Succesfully',
    data: {
      acesstoken,
      refreshtoken,
      email,
      user: newuser,
    },
  });
});

export const login = asynchandler(async (req, res, next) => {
  let { email, password } = req.body;

  email = email.trim().toLowerCase();
  password = password.trim();
  //check email password and confiem password are not missing
  if (!email || !password) {
    return next(new ApiError('All field are required', 400));
  }

  // check the user already exist or not
  const existeduser = await User.findOne({ email: email });

  //if user is not exist
  if (!existeduser) {
    return next(new ApiError('Please Sign up account does not exist'), 404);
  }

  //find the user who are requested
  const requser = await User.findOne({ email }).select('+password');

  //check the user is found or not
  if (!requser) {
    return next(new ApiError('User not found', 404));
  }

  //compare the  pasword to authenticate the user
  if (!(await requser.comparedbpassword(password))) {
    return next(new ApiError('Password is incorrect', 405));
  }

  const [acesstoken, refreshtoken] = createacessandrefreshtoken(requser._id);

  //check the acess and refreshtoken is generated or not
  if (!refreshtoken || !acesstoken) {
    return next(new ApiError('token cannot generated', 400));
  }

  //send the cookie
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  };

  res
    .cookie('acesstoken', acesstoken, options)
    .cookie('refreshtoken', refreshtoken, options);

  res.status(201).json({
    message: 'User login succesfully',
    data: {
      user: requser,
      acesstoken,
      refreshtoken,
    },
  });
});

export const protect = asynchandler(async (req, res, next) => {
  //test token store header
  const test_token = req.headers.authorization;

  //to store acess and refrshtoken either from header or cookies
  let acesstoken, refreshtoken;

  //if header have token the store it
  if (test_token && test_token.startsWith('Bearer')) {
    acesstoken = test_token.split(' ')[1];
    refreshtoken = test_token.split(' ')[2];
  }

  //if there is not header then take it from cookie
  else {
    acesstoken = req.cookies?.acesstoken;
    refreshtoken = req.cookies?.refreshtoken;
  }

  //if we does not get either the acess or refresh token
  if (!refreshtoken) {
    return next(new ApiError('Unauthorised user', 401));
  }

  //check the acess token is valid
  let decodedtoken = await promisify(jwt.verify)(
    acesstoken,
    process.env.ACESS_SECRET_STR
  );

  //if acess token is not valid check the refresh token
  if (!decodedtoken) {
    decodedtoken = await promisify(jwt.verify)(
      refreshtoken,
      process.env.REFRESH_SECRET_STR
    );
  }

  //if refresh token is invalid return the error message unauthenticated
  if (!decodedtoken) {
    return next(new ApiError('You are unauthenticated', 403));
  }

  //how send new acesstoken when it expire and refresh token is valid

  //if token match find the user which try to acess
  const requser = await User.findById(decodedtoken.id);

  //if user not found return error
  if (!requser) {
    return next(new ApiError('USer Not found', 403));
  }

  //check the user change the passwordor not
  if (await requser.ispasswordChanged(decodedtoken.iat)) {
    return next(new ApiError('Your password is changed . Login again!', 401));
  }

  //authorise the user
  req.user = requser;

  next();
});
export const restrict_to = (role) =>
  asynchandler(async (req, res, next) => {
    //get the role of the user
    const user_role = req.user.role;
    //check the user is quthorised to perform action
    if (role !== user_role) {
      return next(new ApiError('You Cannot perform that action', 403));
    }

    //if authorised give permission
    next();
  });
export const isvaliduser = (user, authorised_user, next) => {
  //check the user is quthorised or not
  if (user.toString() !== authorised_user.toString()) {
    return next(new ApiError('You Cannot perform that action', 403));
  }
};
export const forgotpassword = asynchandler(async (req, res, next) => {
  //get the email to forgot password
  let { email } = req.body;
  email = email.trim().toLowerCase();
  //check the user is exist or not
  const requser = await User.findOne({ email });
  //if not exist give error
  if (!requser) {
    return next(new ApiError('User not found', 404));
  }

  const resetToken = requser.createResettoken();
  await requser.save({ validateBeforeSave: false });

  try {
    const resetURL = `${process.env.FRONTEND_URL}/${resetToken}`;
    await new Email(requser, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    requser.passwordResetToken = undefined;
    requser.passwordResetExpires = undefined;
    await requser.save({ validateBeforeSave: false });
    return next(
      new ApiError('There was an error sending the email. Try again later!'),
      500
    );
  }
});
export const resetpassword = asynchandler(async (req, res, next) => {
  const { resetToken, password, confirmpassword } = req.body;

  if (!resetToken || !password || !confirmpassword) {
    return next(new ApiError('Please fill all required field', 400));
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const requser = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });

  if (!requser) {
    return next(new ApiError('Token is invalid or expired', 401));
  }

  requser.password = password;
  requser.confirmpassword = confirmpassword;
  requser.passwordResetToken = undefined;
  requser.passwordResetExpires = undefined;
  await requser.save();
  const [acesstoken, refreshtoken] = createacessandrefreshtoken(requser._id);

  //check the acess and refreshtoken is generated or not
  if (!refreshtoken || !acesstoken) {
    return next(new ApiError('token cannot generated', 400));
  }

  //send the cookie
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  };

  res
    .cookie('acesstoken', acesstoken, options)
    .cookie('refreshtoken', refreshtoken, options);
  //return success message
  res.status(201).json({
    message: 'Password reset Succesfully',
    data: {
      acesstoken,
      refreshtoken,
      user: requser,
    },
  });
});
export const updatepassword = asynchandler(async (req, res, next) => {
  const requser = await User.findById(req.user._id).select('+password');

  const { current_password, new_password, confirmpassword } = req.body;

  if (!new_password || !confirmpassword || !current_password) {
    return next(new ApiError('All field are required', 400));
  }
  if (!(await requser.comparedbpassword(current_password))) {
    return next(new ApiError('Current Password is incorrect', 400));
  }

  requser.password = new_password;
  requser.confirmpassword = confirmpassword;
  await requser.save();

  const [acesstoken, refreshtoken] = createacessandrefreshtoken(requser._id);

  //check the acess and refreshtoken is generated or not
  if (!refreshtoken || !acesstoken) {
    return next(new ApiError('token cannot generated', 400));
  }

  //send the cookie
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  };

  res
    .cookie('acesstoken', acesstoken, options)
    .cookie('refreshtoken', refreshtoken, options);
  //return success message
  res.status(201).json({
    message: 'Password updated Successfully',
    data: {
      acesstoken,
      refreshtoken,
      user: requser,
    },
  });
});
export const logout = asynchandler(async (req, res, next) => {
  res.clearCookie('acesstoken').clearCookie('refreshtoken');
  res.status(200).json({ status: 'success' });
});
