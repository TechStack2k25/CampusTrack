import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import {  Link } from 'react-router-dom';
import { authService } from "../api/authService";
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from "../store/slices/userSlice";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");
  const dispatch=useDispatch();

 
  const onSubmit =async (data) => {
    console.log("User Data:", data);
    dispatch(loginStart());
    try {
      //Normal signup data
      const user=await authService.userSignUp(data);
      if(user){
        console.log(user);
        dispatch(loginSuccess(user));
      }
      else{
        dispatch(loginFailure('Try again later..'));
      }
    } catch (error) {
      dispatch(loginFailure(error?.response?.data?.message));
    }
  };

  // Google Auth handler
  const handleGoogleAuth = () => {
    //window.location.href
    //for Oauth
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full px-4 py-2 mt-1 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring focus:ring-blue-200`}
            />
            {errors && errors?.email && <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className={`w-full px-4 py-2 mt-1 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring focus:ring-blue-200`}
            />
            {errors && errors?.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-600">
              Confirm password
            </label>
            <input
              type="password"
              id="confirmpassword"
              {...register("confirmpassword", {
                required: "Confirm your Password!!",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                validate: (value) =>
                  value === password || "Passwords do not match!",
              })}
              className={`w-full px-4 py-2 mt-1 border ${
                errors.confirmpassword ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring focus:ring-blue-200`}
            />
            {errors && errors?.confirmpassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmpassword.message}</p>
            )}
          </div>

            {/* User data submit */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Google Auth Button */}
        <div className="mt-2">
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center bg-gray-100 border border-gray-300 py-2 rounded-md hover:bg-gray-200 transition duration-200"
          >
            <FcGoogle className="mr-2 text-xl" />
            Sign Up with Google
          </button>
        </div>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
