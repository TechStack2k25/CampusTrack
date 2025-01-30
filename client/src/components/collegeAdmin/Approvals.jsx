import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function Approvals() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "John Doe",
      role: "Student",
      department: "Computer Science",
      email: "john.doe@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Faculty",
      department: "Mathematics",
      email: "jane.smith@example.com",
    },
  ]);

  const [modal, setModal] = useState({ isOpen: false, message: "", type: "" });

  const closeModal = () => {
    setModal({ isOpen: false, message: "", type: "" });
  };

  const handleApprove = (id) => {
    setRequests(requests.filter((request) => request.id !== id));
    setModal({ isOpen: true, message: "Request approved successfully!", type: "success" });
  };

  const handleReject = (id) => {
    setRequests(requests.filter((request) => request.id !== id));
    setModal({ isOpen: true, message: "Request rejected.", type: "error" });
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Approval Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {request.name}
            </h2>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-3">
              {request.role}
            </span>
            <p className="text-gray-700 text-sm mb-2">
              <strong>Department:</strong> {request.department}
            </p>
            <p className="text-gray-700 text-sm mb-4">
              <strong>Email:</strong> {request.email}
            </p>
            <div className="flex justify-between">
              <button
                className="flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-all"
                onClick={() => handleApprove(request.id)}
              >
                <FaCheckCircle className="w-5 h-5 mr-2" /> Approve
              </button>
              <button
                className="flex items-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full transition-all"
                onClick={() => handleReject(request.id)}
              >
                <FaTimesCircle className="w-5 h-5 mr-2" /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      {requests.length === 0 && (
        <p className="text-center text-gray-600 mt-12 text-lg">
          No pending requests.
        </p>
      )}

      {modal.isOpen && (
        <div className="fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2
              className={`text-lg font-medium mb-4 ${
                modal.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {modal.type === "success" ? "Success" : "Error"}
            </h2>
            <p className="text-gray-700 mb-6">{modal.message}</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
