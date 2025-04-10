import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

function Verifying({
  argName,
  verifyFunction,
  successMessage = "Successful",
  failureMessage = "Failed",
  redirectPath = "/dashboard"
}) {
  const { token } = useParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setIsVerifying(true);
      setVerified(false);
      const res = await verifyFunction({ [argName]: token });
      setVerified(!!res);
    } catch {
      setVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md p-6 mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl relative transition-all duration-500 ease-in-out">
        {isVerifying ? (
          <div className="flex flex-col items-center text-center animate-fadeIn">
            <FaSpinner className="animate-spin text-blue-500 text-6xl mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Verifying, please wait...</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a few seconds.</p>
          </div>
        ) : verified ? (
          <div className="flex flex-col items-center text-center animate-fadeIn">
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{successMessage}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">You will be redirected shortly or click below.</p>
            <button
              className="mt-5 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
              onClick={() => navigate(redirectPath)}
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center animate-fadeIn">
            <FaTimesCircle className="text-red-500 text-6xl mb-4" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400">{failureMessage}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Something went wrong. Please try again later.</p>
            <button
              className="mt-5 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition"
              onClick={() => navigate(redirectPath)}
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Verifying;
