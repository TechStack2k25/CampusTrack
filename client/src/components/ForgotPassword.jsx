import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { authService } from "../api/authService.js"
import { useDispatch } from "react-redux";
import { loginSuccess, setError, setSuccess } from "../store/slices/userSlice.js";

const ForgotPassword = () => {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requesting,setRequesting]=useState(false);
  const [errormsg,setErrormsg]=useState('');
  const dispatch=useDispatch();

  const handleEmail=async()=>{
    console.log(email);
    setErrormsg('');
    setRequesting(true);
    try {
      const res=await authService.userForgotPassword({email});
      if(res){
        dispatch(setSuccess("Reset link has been sent to your email!"))
        setEmail("");
      }
      else{
        dispatch(setError("Try Again!"));
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.message));
    }
    setRequesting(false);

  }

  const resetPassword=async()=>{
      console.log(password,confirmPassword);
      setErrormsg('');
      if(password!==confirmPassword){
        setErrormsg("Password do not match!");
        setTimeout(() => setErrormsg(""), 3000);
        return;
      }
      setRequesting(true);
      try {
        const res=await authService.userForgotPassword({resetToken:token, password, confirmpassword:confirmPassword});
        if(res){
          dispatch(loginSuccess(res));
          dispatch(setSuccess("Password has been reset!"));
          setEmail("");
        }
        else{
          dispatch(setError("Try Again!"));
        }
      } catch (error) {
        dispatch(setError(error?.response?.data?.message));
      }
      setRequesting(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{token ? "Reset" : "Forgot"} Password</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">Enter your {token ? "credentials" : "email to reset your password"}</p>
        {token ?

          <div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
              />
            </div>
          </div>
          :

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
        }
        {errormsg.length>0 && (
            <p className="text-red-500 text-sm mb-2 text-center">{errormsg}</p>
          )}
        <button disabled={requesting} 
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        onClick={token?resetPassword:handleEmail}>
          {requesting?'Wait a moment ⏳':'Reset Password'}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;