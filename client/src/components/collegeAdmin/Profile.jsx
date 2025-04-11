import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
  setError,
  clearError,
  setSuccess,
} from '../../store/slices/userSlice';
import { userService } from '../../api/userService.js';
import { ConfirmModal, Input } from '../Utils';
import { useEffect, useState } from 'react';
import { collegeService } from '../../api/collegeService.js';
import { FaEdit } from 'react-icons/fa';

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [password, setPassword] = useState({
    current_password: '',
    new_password: '',
    confirmpassword: '',
  });

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmUpdateSem, setConfirmUpdateSem] = useState(false);
  const [college, setCollege] = useState({ name: '', id: '' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: college });

  const fetchCollege = async () => {
    try {
      const res = await collegeService.getCollege({ _id: user?.college });
      if (res) {
        setCollege(res);
        reset(res);
      }
    } catch (error) {
      dispatch(setError('Failed to fetch college data.'));
    }
  };

  const onSubmit = async (data) => {
    dispatch(clearError());

    try {
      // Handle password update
      const { current_password, new_password, confirmpassword } = password;
      const isChangingPassword =
        current_password || new_password || confirmpassword;

      if (isChangingPassword) {
        if (new_password.length < 6) {
          return dispatch(setError('Min length is 6!'));
        }
        if (!confirmpassword || new_password !== confirmpassword) {
          return dispatch(setError('Confirm your password!'));
        }
        if (!current_password) {
          return dispatch(setError('Your current password!'));
        }

        const passwordRes = await userService.passwordUpdate(password);
        if (!passwordRes) {
          return dispatch(setError('Try Again later!'));
        }

        dispatch(setSuccess('Password updated!'));
        setPassword({
          current_password: '',
          new_password: '',
          confirmpassword: '',
        });
      }

      // Handle college update
      const updatedCollege = await collegeService.updateCollege(data);
      if (updatedCollege) {
        setCollege(updatedCollege);
        reset(updatedCollege);
        dispatch(setSuccess('College updated!'));
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || 'Update failed.'));
    }
  };

  const deleteCollege = async () => {
    try {
      const res = await collegeService.deleteCollegeRequestMail();
      if (res) {
        setConfirmDelete(false);
        dispatch(setSuccess('Check your mail!'));
      } else {
        dispatch(setError('Try again later!'));
      }
    } catch (error) {
      dispatch(setError('Try again later!'));
    }
  };

  const updateSemesters = async () => {
    try {
      const res = await userService.updateSem();
      if (res) {
        dispatch(setSuccess('Semester Updated!'));
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || 'Update failed.'));
    } finally {
      setConfirmUpdateSem(false);
    }
  };

  useEffect(() => {
    fetchCollege();
  }, []);

  return (
    <div className='flex-1 p-6'>
      <button
        className='absolute top-2 right-2 text-blue-600 hover:text-blue-800 transition'
        title='Update Semester'
        onClick={() => setConfirmUpdateSem(true)}
      >
        <FaEdit className='w-5 h-5' />
      </button>

      <div className='max-w-md mx-auto mt-10 p-6 border dark:border-gray-800 shadow-lg rounded-lg'>
        <h2 className='text-xl font-bold text-center mb-4 dark:text-white'>
          College
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium dark:text-gray-400'>
              College ID:
            </label>
            <input
              type='text'
              {...register('id', { required: 'College Id is required' })}
              className='w-full dark:bg-gray-600 dark:text-white p-2 border border-gray-300 rounded mt-1'
            />
          </div>

          <div>
            <label className='block text-sm font-medium dark:text-gray-400'>
              Name:
            </label>
            <input
              type='text'
              {...register('name', { required: 'Name is required' })}
              className='w-full p-2 border border-gray-300 rounded mt-1'
            />
            {errors.name && (
              <p className='text-red-500 text-sm'>{errors.name.message}</p>
            )}
          </div>

          <Input
            type='password'
            value={password.current_password}
            label='Current Password'
            placeholder='current password here'
            onChange={(e) =>
              setPassword((prev) => ({
                ...prev,
                current_password: e.target.value.trim(),
              }))
            }
          />

          <Input
            type='password'
            value={password.new_password}
            label='New Password'
            placeholder='New password here'
            onChange={(e) =>
              setPassword((prev) => ({
                ...prev,
                new_password: e.target.value.trim(),
              }))
            }
          />

          <Input
            type='password'
            value={password.confirmpassword}
            label='Confirm Password'
            placeholder='Confirm your password'
            onChange={(e) =>
              setPassword((prev) => ({
                ...prev,
                confirmpassword: e.target.value.trim(),
              }))
            }
          />

          <button
            type='submit'
            className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
          >
            Update
          </button>
        </form>

        <button
          type='button'
          className='mt-2 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600'
          onClick={() => setConfirmDelete(true)}
        >
          Delete
        </button>
      </div>

      {confirmDelete && (
        <ConfirmModal
          heading='Are you sure?'
          text='All Data Will be Deleted!!'
          cancelText='Cancel'
          doneText='Confirm'
          cancel={() => setConfirmDelete(false)}
          done={deleteCollege}
          danger
        />
      )}

      {confirmUpdateSem && (
        <ConfirmModal
          heading='Are you sure?'
          text='Semester(+) will be updated!!'
          cancelText='Cancel'
          doneText='Confirm'
          cancel={() => setConfirmUpdateSem(false)}
          done={updateSemesters}
        />
      )}
    </div>
  );
};

export default Profile;
