import React from 'react';
import { useApprovals } from '../../data/approvals.js';
import ApprovalCard from '../Utils/ApprovalCard.jsx';
import Loading from '../Loading.jsx';

function Approvals() {
  const { data: requests, isLoading } = useApprovals();

  return (
    <>
      {isLoading ? (
        <div className='flex-1 min-h-screen'>
          <Loading />
        </div>
      ) : (
        <div className='flex-1 p-6 min-h-screen'>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center'>
            Approval Requests
          </h1>
          {requests && requests.length === 0 ? (
            <p className='text-center text-gray-600 dark:text-gray-400 mt-12 text-lg'>
              No pending requests.
            </p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {requests?.map((request) => (
                <ApprovalCard key={request._id} request={request} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Approvals;
