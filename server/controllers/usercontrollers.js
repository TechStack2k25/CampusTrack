import asynchandler from '../utils/asynchandler.js';
import ApiError from '../utils/apierror.js';
import { create_request } from './requestcontrollers.js';
import College from '../models/collegemodel.js';

export const getall = asynchandler(async (req, res, next) => {});

export const deluser = asynchandler(async (req, res, next) => {});

export const updateuser = asynchandler(async (req, res, next) => {
  //get the data from request
  const {
    name,
    surname,
    sem,
    year,
    currentdegree,
    degree,
    qualifaication,
    role,
  } = req.body();

  // get the id of user from param
  const id = req.params.id;

  //check the user exist or not
  const requser = await User.findById(id);

  //if not exit then returmn mesaage of sign up
  if (!requser) {
    return next(new ApiError('NO user found ! ,Sign up', 404));
  }

  //if role is present then create a request
  if (role) {
    req.body.requestType = 'Add user';
    const { id } = req.body;
    const college = await College.findOne({ id });
    if (!college) {
      return next(new ApiError('college not found', 404));
    }
    req.body.college = college._id;
    create_request(req, res, next);
  }
  //update the user by id
  const updateduser = await findByIdAndUpdate(
    id,
    {
      name,
      surname,
      sem,
      year,
      currentdegree,
      degree,
      qualifaication,
    },
    { new: true, runValidators: true }
  );

  //user updated give the new data of user
  res.status(201).json({
    message: 'user updated suceesfully',
    data: {
      user: updateduser,
    },
  });
});
