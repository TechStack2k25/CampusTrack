import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { setError, setSuccess } from '../../store/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmModal } from '../Utils';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { degreeService } from '../../api/degreeService';
import { v4 as uuid } from 'uuid';

const Degrees = () => {
  const dispatch = useDispatch();
  const [allDegrees, setAllDegrees] = useState([]);
  const [degree, setDegree] = useState(null);
  const [degreeTodelete, setDegreeToDelete] = useState(null);
  const college = useSelector((state) => state.user.user.college);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchData = async () => {
    try {
      const res = await degreeService.getAll({ _id: college });
      if (res) setAllDegrees(res);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addDegree = async (degree) => {
    try {
      const res = degree?._id
        ? await degreeService.updateDegree(degree)
        : await degreeService.addDegree({ _id: college, ...degree });

      if (res) {
        setAllDegrees((prev) =>
          degree?._id
            ? prev.map((item) => (item?._id === degree?._id ? degree : item))
            : [...prev, { _id: uuid(), ...degree }]
        );
        setDegree(null);
        reset();
      }
    } catch (error) {}
  };

  const handleDelete = (degId) => setDegreeToDelete(degId);
  const handleCancelDelete = () => setDegreeToDelete(null);

  const handleConfirmDelete = async () => {
    try {
      const res = await degreeService.deleteDegree({ _id: degreeTodelete });
      if (res) {
        setAllDegrees((prev) =>
          prev.filter((item) => item?._id !== degreeTodelete)
        );
        setDegreeToDelete(null);
        dispatch(setSuccess('Deleted Successfully!'));
      }
    } catch (error) {
      dispatch(setError('Try again later!'));
    }
  };

  return (
    <div className='flex-1 p-6 min-h-screen dark:from-gray-900 dark:to-black transition-all rounded-3xl'>
      <div className='flex justify-between items-center mb-10'>
        <h1 className='text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-tight ml-8 sm:ml-0'>
          🎓 Degree
        </h1>
        <button
          onClick={() => {
            setDegree({ name: '', totalYears: 1, totalSemesters: 1 });
            reset({ name: '', totalYears: 1, totalSemesters: 1 });
          }}
          className='transition duration-300 transform text-white bg-indigo-600 px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 font-semibold text-lg'
        >
          + 
        </button>
      </div>

      {allDegrees && allDegrees.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {allDegrees.map((deg) => (
            <div
              key={deg._id}
              className='bg-white/60 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700'
            >
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-bold text-indigo-700 dark:text-indigo-400'>
                  {deg.name}
                </h2>
              </div>

              <div className='grid md:grid-cols-2 gap-4'>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-gray-900 px-4 py-2 rounded-lg shadow-sm'>
                  <span className='font-semibold'>Years:</span> {deg.totalYears}
                </p>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-gray-900 px-4 py-2 rounded-lg shadow-sm'>
                  <span className='font-semibold'>Semesters:</span>{' '}
                  {deg.totalSemesters}
                </p>
              </div>

              <div className='flex justify-end space-x-4 mt-6'>
                <button
                  onClick={() => {
                    setDegree(deg);
                    reset(deg);
                  }}
                  className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition transform hover:scale-105 shadow-md'
                >
                  <FiEdit />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(deg._id)}
                  className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition transform hover:scale-105 shadow-md'
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-600 dark:text-gray-300 mt-16 text-lg'>
          No degrees to show. Add one to get started!
        </p>
      )}

      {/* Confirmation Modal */}
      {degreeTodelete && (
        <ConfirmModal
          text='This action cannot be undone. Do you want to delete this degree?'
          done={handleConfirmDelete}
          cancel={handleCancelDelete}
          danger={true}
          heading='Are you sure?'
          cancelText='Cancel'
          doneText='Confirm'
        />
      )}

      {/* Add/Edit Modal */}
      {degree && (
        <div className='fixed z-50 inset-0 bg-black bg-opacity-60 flex justify-center items-center'>
          <div className='bg-white dark:bg-gray-950 dark:border dark:border-gray-800 w-[90%] max-w-md p-6 rounded-xl shadow-2xl relative animate-fade-in'>
            <button
              onClick={() => {
                setDegree(null);
                reset();
              }}
              className='absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl'
            >
              ✖
            </button>
            <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-6 text-center'>
              {degree._id ? 'Update Degree' : 'Add Degree'}
            </h2>
            <form onSubmit={handleSubmit(addDegree)} className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-600 dark:text-gray-300'>
                  Degree Name
                </label>
                <input
                  type='text'
                  {...register('name', { required: 'Name is required' })}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className='text-sm text-red-500 mt-1'>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className='text-sm font-medium text-gray-600 dark:text-gray-300'>
                  Total Years
                </label>
                <input
                  type='number'
                  {...register('totalYears', {
                    required: 'Required!',
                    min: { value: 1, message: 'Minimum 1 year' },
                    max: { value: 5, message: 'Maximum 5 years' },
                  })}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                    errors.totalYears ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.totalYears && (
                  <p className='text-sm text-red-500 mt-1'>
                    {errors.totalYears.message}
                  </p>
                )}
              </div>

              <div>
                <label className='text-sm font-medium text-gray-600 dark:text-gray-300'>
                  Total Semesters
                </label>
                <input
                  type='number'
                  {...register('totalSemesters', {
                    required: 'Required!',
                    min: { value: 1, message: 'Minimum 1 semester' },
                    max: { value: 10, message: 'Maximum 10 semesters' },
                  })}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
                    errors.totalSemesters
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors.totalSemesters && (
                  <p className='text-sm text-red-500 mt-1'>
                    {errors.totalSemesters.message}
                  </p>
                )}
              </div>

              <div className='pt-4 text-right'>
                <button
                  type='submit'
                  className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-md'
                >
                  {degree._id ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Degrees;
