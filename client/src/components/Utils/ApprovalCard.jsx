import React from 'react'
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function ApprovalCard({request, updatefn}) {
  return (
    
    <div
    key={request._id}
    className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-all"
  >
    <h2 className="text-xl font-semibold text-gray-900 mb-3">
      {request?.request_by?.name || request?.request_by?.email.split('@')[0]}
    </h2>
    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-3">
      {request?.request_role}
    </span>
    {/* IF HOD requests */}
    <p className="text-gray-700 text-sm mb-2">
      <strong>Department:</strong> {request?.request_dep?.name}
    </p>
    <p className="text-gray-700 text-sm mb-4">
      <strong>Email:</strong> {request?.request_by?.email}
    </p>
    <div className="flex justify-between">
      <button
        className="flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-all"
        onClick={() => updatefn({id:request?._id, new_status:'approved'})}
      >
        <FaCheckCircle className="w-5 h-5 mr-2" /> Approve
      </button>
      <button
        className="flex items-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full transition-all"
        onClick={() => updatefn({id:request?._id, new_status:'rejected'})}
      >
        <FaTimesCircle className="w-5 h-5 mr-2" /> Reject
      </button>
    </div>
  </div>
  )
}

export default ApprovalCard