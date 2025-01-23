import asynchandler from '../utils/asynchandler.js';
import ApiError from '../utils/apierror.js';

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
      role,
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
