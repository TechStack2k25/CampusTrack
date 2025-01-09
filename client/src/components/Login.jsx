import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  }=useForm();

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleSubmission=(data)=>{
    console.log(data);
    //after login API
    // dispatch changes to store
  }
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center sm:w-full md:w-1/2 px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit(handleSubmission)}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors && errors?.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors?.email?.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors && errors?.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-end mb-4">
              <Link to={'/forgot-password'} className="text-sm text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
            {/* conditional loading and google Oauth */}
            {error.length>0 && (
                <p className="mt-1 text-sm text-red-500">
                  {error}
                </p>
              )}
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to={'/signup'} className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
