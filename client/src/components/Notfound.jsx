import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Notfound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-slate-100 to-blue-200 dark:from-gray-800 dark:to-gray-900 px-4">
      <div className="text-center animate-fadeIn">
        <h1 className="text-7xl font-extrabold text-blue-600 dark:text-blue-400 drop-shadow-md">404</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">Oops! Page Not Found</p>
        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          The page you're looking for doesn't exist, was removed, renamed, or might be temporarily unavailable.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-medium rounded-full shadow hover:bg-blue-700 transition"
          >
            <FaArrowLeft />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
