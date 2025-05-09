import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from '../../api/requestService.js';
import { useDispatch } from 'react-redux';
import { setError, setSuccess } from '../../store/slices/userSlice.js';

function ApprovalCard({ request }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: requestService.updateRequest,
    onSuccess: () => {
      dispatch(setSuccess('Request handled successfully!'));
      queryClient.invalidateQueries(['allapprovals']);
    },
    onError: (err) => {
      dispatch(setError(err?.response?.data?.message || 'Something went wrong.'));
    },
  });

  const handleUpdate = (status) => {
    mutation.mutate({ id: request._id, new_status: status });
  };

  return (
    <div
      className={`bg-white dark:bg-black dark:bg-opacity-20 border dark:border-gray-800 shadow-md rounded-2xl p-6 transition-all ${
        mutation.isLoading ? 'opacity-60 pointer-events-none' : 'hover:shadow-lg'
      }`}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-3 dark:text-gray-100">
        {request?.request_by?.name || request?.request_by?.email?.split('@')[0]}
      </h2>
      <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-3">
        {request?.request_role}
      </span>

      {request?.requestType === 'Add user' && (
        <>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
            <strong>Department:</strong> {request?.request_dep?.name}
          </p>
          {request?.request_degree && (
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
              <strong>Degree:</strong> {request?.request_degree?.name}
            </p>
          )}
        </>
      )}

      {request?.requestType === 'Add Course' && (
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
          <strong>Course:</strong>{' '}
          {`${request?.request_course?.name} (${request?.request_course?.coursecode?.toUpperCase()})`}
        </p>
      )}

      <p className="text-gray-700 text-sm mb-4 dark:text-gray-300">
        <strong>Email:</strong> {request?.request_by?.email}
      </p>

      <div className="flex justify-between">
        <button
          className="flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-all disabled:opacity-50"
          disabled={mutation.isLoading}
          onClick={() => handleUpdate('approved')}
        >
          <FaCheckCircle className="w-5 h-5 mr-2" /> Approve
        </button>
        <button
          className="flex items-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full transition-all disabled:opacity-50"
          disabled={mutation.isLoading}
          onClick={() => handleUpdate('rejected')}
        >
          <FaTimesCircle className="w-5 h-5 mr-2" /> Reject
        </button>
      </div>
    </div>
  );
}

export default ApprovalCard;
