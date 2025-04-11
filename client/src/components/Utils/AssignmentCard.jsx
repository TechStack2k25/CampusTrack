import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const AssignmentCard = ({ assignment, onSubmit }) => {
  const { role } = useSelector((state) => state.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  

  const date = new Date(assignment?.deadline);
  const today = new Date();
  const isPastDeadline = assignment?.deadline && date < today;

  const statusColors = {
    Pending: 'bg-red-100 text-red-700',
    Completed: 'bg-green-100 text-green-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
  };
  
  //update and delete functionality to add
  // console.log(assignment)

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file before submitting.');
      return;
    }

    setUploading(true);
    const res = await onSubmit({ id: assignment._id, file: selectedFile });
    if (res) {
      setIsModalOpen(false);
      setSelectedFile(null);
    }
    setUploading(false);
  };

  return (
    <div className='bg-white dark:bg-gray-900 dark:border dark:border-gray-700 shadow-md rounded-lg p-4 mb-4'>
      <div className='flex items-center justify-between mb-2'>
        <h2 className='text-xl font-bold text-gray-800 dark:text-gray-200'>
          {assignment.title}
        </h2>
        {assignment?.status && (
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[assignment.status]}`}>
            {assignment.status}
          </span>
        )}
      </div>

      {assignment?.coursename && <p className='text-gray-600 dark:text-gray-400 mb-1'>
        <strong>Course:</strong> {assignment?.coursename}
      </p>}

      {assignment?.deadline && (
        <p className='text-gray-600 dark:text-gray-400'>
          <strong>Due Date:</strong>{' '}
          <span className={`font-semibold ${isPastDeadline ? 'text-red-600' : 'text-green-600'}`}>
            {date?.toLocaleDateString()}
          </span>
        </p>
      )}

      <div className='my-3 flex flex-col md:flex-row gap-2 justify-center md:justify-start items-center'>
        {assignment?.file && (
          <a
            href={assignment.file}
            target='_blank'
            rel='noopener noreferrer'
            className='px-4 py-2 rounded-lg font-semibold transition bg-blue-500 text-white shadow-md hover:bg-blue-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
          >
            📄 View
          </a>
        )}

        {role === 'Student' && date >= today && (
          <button
            onClick={() => setIsModalOpen(true)}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition'
          >
            {assignment?.file ? 'Update Assignment' : 'Submit Assignment'}
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
          <div className='relative bg-white dark:bg-gray-950 dark:border dark:border-gray-700 p-6 rounded-2xl shadow-2xl w-96'>
            <button
              onClick={() => setIsModalOpen(false)}
              className='absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl'
              aria-label='Close upload modal'
            >
              ✖
            </button>

            <h2 className='text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2'>
              Submit Assignment
            </h2>
            <p className='text-center text-sm mb-4 text-gray-600 dark:text-gray-400'>
              <strong>Title:</strong> {assignment?.title}
            </p>

            <label
              htmlFor={`upload-${assignment._id}`}
              className='cursor-pointer bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2'
            >
              <FaUpload />
              <span>{selectedFile ? selectedFile.name : 'Upload PDF'}</span>
              <input
                type='file'
                accept='.pdf'
                id={`upload-${assignment._id}`}
                disabled={uploading}
                onChange={handleFileChange}
                className='hidden'
              />
            </label>

            <div className='flex justify-end gap-3 mt-6'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='px-5 py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 shadow-md hover:shadow-lg transform hover:scale-105'
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className='px-5 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:scale-105'
              >
                {uploading ? 'Uploading ⏳' : 'Submit 🚀'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;
