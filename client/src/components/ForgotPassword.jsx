import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { authService } from "../api/authService.js";
import { useDispatch } from "react-redux";
import { loginSuccess, setError, setSuccess } from "../store/slices/userSlice.js";

const ForgotPassword = () => {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const dispatch = useDispatch();

  const handleEmail = async () => {
    setErrormsg("");
    setRequesting(true);
    try {
      const res = await authService.userForgotPassword({ email });
      if (res) {
        dispatch(setSuccess("Reset link has been sent to your email!"));
        setEmail("");
      } else {
        dispatch(setError("Try Again!"));

      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.message));
    }
    setRequesting(false);
  };

  const resetPassword = async () => {
    setErrormsg("");
    if (password !== confirmPassword) {
      setErrormsg("Passwords do not match!");
      setTimeout(() => setErrormsg(""), 3000);
      return;
    }
    setRequesting(true);
    try {
      const res = await authService.userResetPassword({
        resetToken: token,
        password,
        confirmpassword: confirmPassword,
      });
      if (res) {
        dispatch(loginSuccess(res));
        dispatch(setSuccess("Password has been reset!"));
      } else {
        dispatch(setError("Try Again!"));
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.message));
    }
    setRequesting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 transition-all">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          {token ? "Reset" : "Forgot"} Password
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          {token ? "Set your new password" : "We’ll email you a reset link"}
        </p>

        {token ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter new password"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <input
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Confirm new password"
              />
            </div>
          </>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your email"
            />
          </div>
        )}

        {errormsg && (
          <p className="text-red-500 text-sm text-center mb-4">{errormsg}</p>
        )}

        <button
          disabled={requesting}
          onClick={token ? resetPassword : handleEmail}
          className={`w-full py-2 px-4 font-semibold text-white rounded-lg transition duration-200 shadow ${
            requesting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {requesting ? "Please wait..." : token ? "Reset Password" : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
