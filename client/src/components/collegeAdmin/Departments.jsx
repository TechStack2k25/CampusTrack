import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { setError, setSuccess } from '../../store/slices/userSlice';
import { departmentService } from '../../api/departmentService';
import { useDepartments } from '../../data/departments.js';
import { useDispatch } from 'react-redux';
import { ConfirmModal } from '../Utils';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const Departments = () => {
  const { data: departments } = useDepartments('all');
  // console.log(departments)
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [dept, setDept] = useState(null);
  const [deptTodelete, setDeptToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Defined mutation using useMutation hook
  const mutationTocreateDepartment = useMutation({
    mutationFn: departmentService.createDepartment,
    onSuccess: (data) => {
      // console.log('department created successfully:', data);
      dispatch(setSuccess('Department created successfully!'));
      //invalidate alldepartment queries to refetch data
      queryClient.invalidateQueries(['alldepartments']);
    },
    onError: (error) => {
      dispatch(setError(error?.response?.data?.message));
      // console.error('Error creating department', error);
    },
  });

  const mutationToupdateDepartment = useMutation({
    mutationFn: departmentService.updateDepartment,
    onSuccess: (data) => {
      // console.log('department created successfully:', data);
      dispatch(setSuccess('Department updated successfully!'));
      //invalidate alldepartment queries to refetch data
      queryClient.invalidateQueries(['alldepartments']);
    },
    onError: (error) => {
      dispatch(setError(error?.response?.data?.message));
      // console.error('Error updating department', error);
    },
  });

  const addDepartment = async (department) => {
    department?._id
      ? mutationToupdateDepartment.mutate(department)
      : mutationTocreateDepartment.mutate(department);
    setDept(null); // Close modal
    reset(); // Reset form fields
  };

  const handleDelete = (deptId) => {
    setDeptToDelete(deptId); // Store the department ID
  };

  // Hide the delete modal without performing any action
  const handleCancelDelete = () => {
    setDeptToDelete(null); // Clear the selected department ID
  };

  // Confirm deletion and perform the delete action
  const handleConfirmDelete = async () => {
    try {
      const res = await departmentService.deleteDepartment({
        _id: deptTodelete,
      });
      if (res) {
        setDeptToDelete(null);
        dispatch(setSuccess('Deleted Successfully!'));
      }
    } catch (error) {
      dispatch(setError('Try again later!'));
    }
  };

  return (
    <div className='flex-1 p-6 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='ml-8 sm:ml-0  text-2xl font-bold text-gray-700 dark:text-gray-300'>
          Departments
        </h1>
        <button
          onClick={() => {
            setDept({ code: '', name: '' });
            reset({ code: '', name: '' });
          }}
          className='transition duration-300 transform text-blue-600 px-3 py-1 dark:bg-gray-800 rounded shadow-md hover:bg-blue-700 hover:text-white font-black text-xl hover:rounded-full'
        >
          +
        </button>
      </div>

      {/* Departments List */}
      {departments && departments?.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {departments?.map((dept) => (
            <div
              key={dept._id}
              className='bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-800 dark:from-blue-900 dark:to-black'
            >
              <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-semibold text-blue-600'>
                  {dept.name}
                </h2>
                <p className='text-sm font-bold text-gray-600 dark:text-gray-50 mt-1 bg-gray-100 dark:bg-blue-950 px-3 py-1 rounded-lg shadow-md inline-block'>
                  {dept?.code}
                </p>
              </div>
              {dept?.hod && (
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mt-2 bg-gray-100 dark:bg-gray-950 px-3 py-1 rounded-lg inline-block'>
                  <span className='font-semibold'>Head : </span>
                  {dept?.hod?.name || dept?.hod?.email?.split('@')[0] || 'N/A'}
                </p>
              )}
              <div className='mt-4 flex justify-end space-x-3'>
                <button
                  onClick={() => {
                    setDept(dept);
                    reset(dept);
                  }} // Edit functionality
                  className='text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md transition duration-300 transform hover:scale-105'
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(dept._id)} // Delete functionality
                  className='text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md transition duration-300 transform hover:scale-105'
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-600 mt-12 text-lg'>
          No Departments to show.
        </p>
      )}

      {/* confirmation to delete */}
      {deptTodelete && (
        <ConfirmModal
          text={
            'This action cannot be undone. Do you want to delete this department?'
          }
          done={handleConfirmDelete}
          cancel={handleCancelDelete}
          danger={true}
          heading={'Are you sure?'}
          cancelText={'Cancel'}
          doneText={'Confirm'}
        />
      )}

      {/* Modal for Adding Department */}
      {dept && (
        <div className='fixed z-30 inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white dark:bg-gray-950 dark:border dark:border-gray-700 w-96 p-6 rounded shadow-lg relative'>
            <button
              onClick={() => {
                setDept(null);
                reset();
              }}
              className='absolute top-2 right-2 text-gray-500 hover:text-gray-800'
            >
              ✖
            </button>
            <h2 className='text-xl font-bold text-gray-700 dark:text-gray-300 mb-4'>
              {dept?._id ? 'Update' : 'Add'} Department
            </h2>
            <form onSubmit={handleSubmit(addDepartment)}>
              {/* Department Name */}
              <div className='mb-4'>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-600 dark:text-gray-400 tracking-tight'
                >
                  Department Name
                </label>
                <input
                  type='text'
                  id='name'
                  {...register('name', { required: 'Name is required' })}
                  className={`w-full px-4 py-2 border rounded ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className='text-sm text-red-500'>{errors.name.message}</p>
                )}
              </div>

              {/* Department Code */}
              <div className='mb-4'>
                <label
                  htmlFor='code'
                  className='block text-sm font-medium text-gray-600 dark:text-gray-400 tracking-tight'
                >
                  Department Code
                </label>
                <input
                  type='text'
                  id='departmentcode'
                  {...register('code', { required: 'Code is required!' })}
                  className={`w-full px-4 py-2 border rounded ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.code && (
                  <p className='text-sm text-red-500'>{errors.code.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className='text-right'>
                <button
                  type='submit'
                  className='bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 dark:hover:bg-indigo-800'
                >
                  {dept?._id ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
