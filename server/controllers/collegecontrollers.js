import College from '../models/collegemodel.js';
import User from '../models/usermodel.js';
import ApiError from '../utils/apierror.js';
import asynchandler from '../utils/asynchandler.js';
import Email from '../utils/emailhandler.js';
import { isvaliduser } from './authcontrollers.js';
import dotenv from 'dotenv';
import * as crypto from 'crypto';
dotenv.config({ path: './variable.env' });
export const addcollege = asynchandler(async (req, res, next) => {
  //get the data from req to create new entity
  const { email } = req.body;

  const requser = await User.findOne({ email });

  if (!requser) {
    return next(new ApiError('User Not Found', 404));
  }

  const reqcollege = await College.findOne({
    admin: requser._id,
    active: true,
  });

  if (reqcollege) {
    return next(
      new ApiError('Please Use another email to create new College', 422)
    );
  }
  //if not exist create the college
  const newcollege = await College.create({
    admin: requser._id,
    id: requser._id,
  });

  //if error in created in entity
  if (!newcollege) {
    return next(new ApiError('College cannot added', 422));
  }

  const updateduser = await User.findByIdAndUpdate(requser._id, {
    college: newcollege._id,
    role: 'Admin',
  });

  try {
    const url = `${process.env.FRONTEND_URL}/profile`;
    await new Email(requser, url).sendEmailonverification();
  } catch (error) {
    return next(new ApiError('Error in send Email', 404));
  }
  //return sucess message
  res.status(201).json({
    message: 'college added sucessfully',
    data: {
      data: newcollege,
    },
  });
});

export const getcollege = asynchandler(async (req, res, next) => {
  //get the info of the college
  const college_id = req.params.id;

  //check the college is find to delete
  const reqcollege = await College.findById(college_id);

  //if not found due to some error
  if (!reqcollege) {
    return next(new ApiError("College can't delete ", 422));
  }

  //return success message
  res.status(201).json({
    message: 'fetched college successfuly',
    data: reqcollege,
  });
});

export const requestfordelete = asynchandler(async (req, res, next) => {
  const user_id = req.user._id;

  const reqcollege = await College.findOne({ admin: user_id });

  if (!reqcollege) {
    return next(new ApiError('College Not Found', 404));
  }

  const requser = await User.findById(user_id);

  const deleteToken = reqcollege.createdeletetoken();

  if (!deleteToken) {
    return next(new ApiError('Error in creating token Try Again', 404));
  }
  await reqcollege.save();
  try {
    const deleteurl = `${process.env.FRONTEND_URL}/deletecollege/${deleteToken}`;
    await new Email(requser, deleteurl).sendEmailForDeleteCollege();

    res.status(201).json({
      message: 'Email Sent successfully',
    });
  } catch (error) {
    // console.log(error);

    reqcollege.deletecollegetoken = undefined;
    reqcollege.deleteTokenExpires = undefined;
    reqcollege.save();
    return next(new ApiError('Error in sending mail try again', 402));
  }
});

export const delcollege = asynchandler(async (req, res, next) => {
  //get the info of the college
  const { token } = req.params;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  // console.log(hashedToken);
  //check the college is find to delete
  const reqcollege = await College.findOne({
    deletecollegetoken: hashedToken,
    deleteTokenExpires: { $gte: Date.now() },
  });

  //if not found due to some error
  if (!reqcollege) {
    return next(new ApiError("College can't delete ", 422));
  }

  //delete the college
  const dele_or_not = await College.findOneAndDelete({
    deletecollegetoken: hashedToken,
    deleteTokenExpires: { $gte: Date.now() },
  });

  //if  error in deleted college  then return error
  if (!dele_or_not) {
    return next(new ApiError('Error in deleted the college', 422));
  } else {
    (reqcollege.deletecollegetoken = undefined),
      (reqcollege.deleteTokenExpires = undefined),
      reqcollege.save();
  }
  res.status(200).json({
    status: 'success',
    message: 'College deleted',
  });
});

export const updatecollege = asynchandler(async (req, res, next) => {
  //get the college id to find the college
  const admin = req.user._id;

  //check the college is exist or not
  const reqcollege = await College.findOne({ admin });

  //if not exist give the error
  if (!reqcollege) {
    return next(new ApiError('College not found', 404));
  }

  //check valid user or not
  isvaliduser(req.user._id, reqcollege.admin, next);

  //if exist get info and update the college
  const { name, id } = req.body;

  if (!id && !reqcollege._id) {
    return next(new ApiError('Please Provide the Id of College', 400));
  }

  if (!reqcollege._id) {
    const existedcollege = await College.findOne({ id });
    if (existedcollege) return next(new ApiError('College already exist', 404));
  }
  //update the college
  const updatedcollege = await College.findOneAndUpdate(
    { admin },
    { name, id },
    { new: true }
  );

  //return sucess message
  res.status(201).json({
    message: 'College updated sucessfully',
    data: {
      data: updatedcollege,
    },
  });
});

// export const sentemailforcollege = asynchandler(async (req, res, next) => {
//   const user = req.user;

//   try {
//     const url = `${process.env.FRONTEND_URL}/createcollege/${user._id}`;
//     await new Email(user, resetURL).sendCollegecCredentials();
//     res.status(200).json({
//       status: 'success',
//       message: 'Email Sent Sucessfully',
//     });
//   } catch (error) {
//     return next(new ApiError('Error in Sending email', 400));
//   } finally {
//   }
// });
