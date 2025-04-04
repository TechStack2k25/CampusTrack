import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

function Verifying({argName, verifyFunction, successMessage="Done", failureMessage="Failed", redirectPath = "/dashboard" }) {
  const { token } = useParams(); // Get params from URL
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setIsVerifying(true);
      setVerified(false);
      const res = await verifyFunction({ [argName]:token }); // Calling verify function
      setVerified(res ? true : false);
    }
    catch (error) {
      setVerified(false);
    }
    finally {
      setIsVerifying(false);
    }
  }


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {isVerifying ? (
        <div className="p-6 flex flex-col items-center bg-white shadow-md rounded-lg">
          <FaSpinner className="animate-spin text-blue-500 text-6xl" />
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      ) : (
        !isVerifying && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center'>
              {!verified ? (
                <>
                  <FaTimesCircle className='text-red-500 text-6xl mx-auto' />
                  <h2 className='text-xl font-bold text-gray-900 dark:text-white mt-4'>
                    {failureMessage}!!
                  </h2>
                  <button
                    className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                    onClick={() => navigate(redirectPath)}
                  >
                    Try Again later...
                  </button>
                </>
              ) : (
                <>
                  <FaCheckCircle className='text-green-500 text-6xl mx-auto' />
                  <h2 className='text-xl font-bold text-gray-900 dark:text-white mt-4'>
                    {successMessage}
                  </h2>
                  <button
                    className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                    onClick={() => navigate(redirectPath)}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        )
      )
      }
    </div >
  );
}

export default Verifying;
