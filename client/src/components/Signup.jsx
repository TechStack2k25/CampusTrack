import React from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { authService } from "../api/authService";
import { useDispatch } from 'react-redux';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../store/slices/userSlice';

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    dispatch(loginStart());
    try {
      const user = await authService.userSignUp(data);
      if (user) {
        dispatch(loginSuccess(user));
      } else {
        dispatch(loginFailure("Try again later.."));
      }
    } catch (error) {
      dispatch(loginFailure(error?.response?.data?.message));
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black transition-all">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 dark:border-gray-700 border border-gray-200 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Email:
            </label>
            <input
              type='email'
              id='email'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full px-4 py-2 mt-1 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700`}
            />
            {errors?.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Password:
            </label>
            <input
              type='password'
              id='password'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              className={`w-full px-4 py-2 mt-1 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700`}
            />
            {errors?.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmpassword"
              {...register("confirmpassword", {
                required: "Confirm your password",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: (value) =>
                  value === password || "Passwords do not match!",
              })}
              className={`w-full px-4 py-2 mt-1 border ${
                errors.confirmpassword ? "border-red-500" : "border-gray-300"
              } rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700`}
            />
            {errors?.confirmpassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmpassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium tracking-wide transition duration-150"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200"
          >
            <FcGoogle className='mr-2 text-xl' />
            Sign Up with Google
          </button>
        </div>
        <p className="mt-6 text-center text-sm dark:text-gray-500 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
