import asynchandler from '../utils/asynchandler.js';
import User from '../models/usermodel.js';
import ApiError from '../utils/apierror.js';

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
  const { email, password, confirmpassword } = req.body();

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
  //return sucess mesage
  res.status(201).json({
    message: 'User Account created Succesfully',
    data: {
      email,
    },
  });
});

export const login = asynchandler(async (req, res, next) => {
  const { email, password } = req.body();

  //check email password and confiem password are not missing
  if (!email || !password) {
    return next(new ApiError('All field are required', 400));
  }

  // check the user already exist or not
  const existeduser = await User.findOne({ email: email });

  //if user is not exist
  if (!existeduser) {
    return next(new ApiError('Please Sign up account does not exist'), 401);
  }

  //find the user who are requested
  const requser = await User.findOne({ email }).select('+password');

  //compare the  pasword to authenticate the user
  if (!(await requser.comparepassword(password))) {
    return next(new ApiError('Password is incorrect', 400));
  }

  const [acesstoken, refreshtoken] = createacessandrefreshtoken(requser._id);

  //check the acess and refreshtoken is generated or not
  if (!refreshtoken || !acesstoken) {
    return next(new ApiError('token cannot generated', 400));
  }

  res.status(201).json({
    message: 'User login succesfully',
    data: {
      user: requser,
      acesstoken,
      refreshtoken,
    },
  });
});

export const protect = asynchandler(async (req, res, next) => {});
export const restrict_to = (role) => asynchandler(async (req, res, next) => {});
export const isloggedin = asynchandler(async (req, res, next) => {});
export const forgotpassword = asynchandler((req, res, next) => {});
export const resetpassword = asynchandler(async (req, res, next) => {});
export const updatepassword = asynchandler(async (req, res, next) => {});
export const logout = asynchandler(async (req, res, next) => {});
