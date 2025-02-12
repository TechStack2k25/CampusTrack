import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { useSelector } from 'react-redux';

const AssignmentCard = ({ assignment, onSubmit }) => {
  const { role } = useSelector((state) => state.user.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const statusColors = {
    Pending: "bg-red-100 text-red-700",
    Completed: "bg-green-100 text-green-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
  };

  //update and delete functionality to add
  console.log(assignment)


  const date = new Date(assignment?.deadline);
  const isPastDeadline = assignment?.deadline && date < new Date();

  // Handling file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handling file upload
  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file before submitting.");
      return;
    }

    onSubmit({ id: assignment._id, file: selectedFile }); // Pass to parent component
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  console.log(selectedFile);


  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{assignment.title}</h2>

        {assignment?.status && <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-nowrap ${statusColors[assignment.status]
            }`}
        >
          {assignment.status}
        </span>}

      </div>
      <p className="text-gray-600">
        <strong>Course:</strong> {assignment?.coursename}
      </p>
      {assignment?.deadline && <p>
        <strong className="text-gray-600">Due Date:</strong><span className={`font-semibold ${isPastDeadline ? "text-red-600" : "text-green-600"}`}> {date?.toLocaleDateString()}</span>
      </p>}
      {/* Submit Button for Students*/}
      {role === 'Student' && <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Submit Assignment
      </button>
      }


      {/* File Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 transform transition-all scale-100">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✖
            </button>

            {/* Assignment Title */}
            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
              Submit Assignment
            </h2>
            <p className="text-center text-gray-600 text-sm mb-4">
              <strong>Title:</strong> {assignment?.title}
            </p>

            {/* File Upload */}
            
            <label
              htmlFor={`upload-${assignment._id}`}
              className="cursor-pointer bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
            >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id={`upload-${assignment.id}`}
            />
              <FaUpload />
              <span>Upload</span>
            </label>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              {/* Cancel Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Cancel
              </button>

              {/* Submit Button */}
              <button
                onClick={handleUpload}
                className="px-5 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Submit 🚀
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default AssignmentCard;
