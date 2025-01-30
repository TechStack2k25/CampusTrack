import React from 'react';
import { useNavigate } from 'react-router-dom';

const Notfound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <p className="mt-4 text-2xl font-medium text-gray-800">
          Oops! Page Not Found.
        </p>
        <p className="mt-2 text-gray-600">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        
        <div className="mt-8">
          <button
            onClick={() => navigate(-1)}
            className="ml-4 px-6 py-3 text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 rounded-md shadow-md transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
