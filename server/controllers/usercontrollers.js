import asynchandler from '../utils/asynchandler.js';
import ApiError from '../utils/apierror.js';

export const getall = asynchandler(async (req, res, next) => {});

export const deluser = asynchandler(async (req, res, next) => {});

export const updateuser = asynchandler(async (req, res, next) => {
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
  const id = req.params.id;
  const requser = await User.findById(id);
  if (!requser) {
    return next(new ApiError('NO user found ! ,Sign up', 404));
  }
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
    { new: true }
  );
  res.status(201).json({
    message: 'user updated suceesfully',
    data: {
      user: updateduser,
    },
  });
});
