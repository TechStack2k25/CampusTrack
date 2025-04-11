import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../api/authService';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../store/slices/userSlice';
import { GoogleAuthButton } from './Utils';
import { FaSpinner } from 'react-icons/fa';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleSubmission = async (data) => {
    dispatch(loginStart());
    try {
      const user = await authService.userLogin(data);
      if (user) {
        dispatch(loginSuccess(user));
      } else {
        dispatch(loginFailure('Try again later..'));
      }
    } catch (error) {
      dispatch(loginFailure(error?.response?.data?.message));
    }
  };

  const handleGoogle = () => {
    window.location.href = `/api/auth/google`;
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50 dark:bg-black'>
      <div className='flex flex-col justify-center items-center sm:w-full md:w-1/2 px-6 py-12'>
        <div className='w-full max-w-md bg-white dark:bg-gray-900 dark:border-gray-700 border border-gray-200 rounded-2xl shadow-xl p-8 transition-all duration-300'>
          <h2 className='text-3xl font-bold text-gray-800 dark:text-white text-center mb-6'>
            Login
          </h2>

          <form onSubmit={handleSubmit(handleSubmission)}>
            <div className='mb-4'>
              <label
                htmlFor='email'
                className='block text-sm font-semibold text-gray-700 dark:text-gray-400'
              >
                Email:
              </label>
              <input
                type='email'
                id='email'
                placeholder='Enter your email'
                className='mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 transition-all duration-200'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors?.email && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className='mb-4'>
              <label
                htmlFor='password'
                className='block text-sm font-semibold text-gray-700 dark:text-gray-400'
              >
                Password:
              </label>
              <input
                type='password'
                id='password'
                placeholder='Enter your password'
                className='mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 transition-all duration-200'
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors?.password && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>
            {error && (
              <p className='mt-1 text-sm text-red-500 text-center'>{error}</p>
            )}
            <div className='flex items-center justify-end mb-4'>
              <Link
                to={'/forgot-password'}
                className='text-sm text-indigo-600 hover:underline'
              >
                Forgot password?
              </Link>
            </div>
            <button
              type='submit'
              className='w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold tracking-wide transition-all duration-150 flex items-center justify-center'
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className='animate-spin text-white text-lg' />
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className='my-4 flex justify-center'>
            <GoogleAuthButton onClick={handleGoogle} />
          </div>

          <p className='mt-6 text-center text-sm dark:text-gray-500 text-gray-600'>
            Don't have an account?{' '}
            <Link to={'/signup'} className='text-indigo-600 hover:underline'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
