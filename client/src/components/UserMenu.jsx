import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  logout,
  setError,
  clearError,
  setSuccess,
} from '../store/slices/userSlice';
import { authService } from '../api/authService';
import { Link } from 'react-router-dom';
import { Notifications } from './userComponents';
import { FaSpinner } from 'react-icons/fa';
import { userService } from '../api/userService';
import { ConfirmModal } from './Utils';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isVerifying, setIsVerifying] = useState(false);
  const [setUpCollege, setSetUpCollege] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false); // Close the menu when clicking outside
    }
  };

  const logoutUser = () => {
    // console.log('logout user...');
    dispatch(clearError());
    //call API
    try {
      if (authService.userLogout()) {
        dispatch(logout());
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
    //dispatch user data
  };

  const sendVerificationMail = async () => {
    try {
      setIsVerifying(true);
      const res = await userService.callToVerify();
      if (res) {
        dispatch(setSuccess('Verification mail sent to your email!'));
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.message));
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative' ref={menuRef}>
      <div className='flex items-center space-x-2 sm:space-x-4'>
        {!['User', 'Owner'].includes(user?.role) && <Notifications />}
        {/* User Icon */}
        <button onClick={toggleMenu} className='flex items-center rounded-full'>
          <div className='cursor-pointer h-10 aspect-square bg-blue-500 rounded-full flex items-center justify-center text-white font-bold'>
            {user?.name?.toUpperCase()[0] || user?.email.toUpperCase()[0]}
          </div>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-40 bg-white dark:bg-gray-950 dark:border-gray-800 border border-gray-200 rounded shadow-lg px-1'>
          <ul className='py-1'>
            <li>
              <Link to='/dashboard'>
                <div className='flex px-2 py-2 space-x-2 items-center'>
                  <div className='h-8 aspect-square bg-blue-500 rounded-full flex items-center justify-center text-white font-bold'>
                    {user?.name?.toUpperCase()[0] ||
                      user?.email.toUpperCase()[0]}
                  </div>
                  <span className='text-black dark:text-white font-semibold truncate'>
                    {user?.name || user?.email.split('@')[0]}
                  </span>
                </div>
              </Link>
            </li>
            {user?.role !== 'Owner' && (
              <li>
                <NavLink
                  to='/profile'
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-blue-400 dark:bg-blue-800 text-white  rounded hover:bg-white hover:text-blue-500 dark:hover:text-blue-800 block w-full text-left px-4 py-2 text-bold'
                      : 'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }
                >
                  {user?.role === 'Admin' ? 'College' : 'Profile'}
                </NavLink>
              </li>
            )}
            {!user?.active && (
              <li
                className={
                  isVerifying
                    ? 'cursor-pointer bg-blue-400 dark:bg-blue-800 text-white  rounded hover:bg-white dark:hover:bg-gray-900 hover:text-blue-500 dark:hover:text-blue-800 block w-full text-left px-4 py-2 text-bold'
                    : 'cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                }
                onClick={!isVerifying && sendVerificationMail}
              >
                {isVerifying ? (
                  <FaSpinner className='animate-spin w-6 h-6 text-gray-600 dark:text-white text-left' />
                ) : (
                  'Verify Email'
                )}
              </li>
            )}
            {!['Admin', 'HOD', 'Owner'].includes(user?.role) &&
              user?.active && (
                <li>
                  <NavLink
                    to='/request'
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-blue-400 dark:bg-blue-800 text-white  rounded hover:bg-white hover:text-blue-500 dark:hover:text-blue-800 block w-full text-left px-4 py-2 text-bold'
                        : 'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }
                  >
                    Request
                  </NavLink>
                </li>
              )}
            {user?.role === 'User' && user?.active && (
              <li
                className={`cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900`}
                onClick={() => setSetUpCollege(true)}
              >
                SetUp College
              </li>
            )}
            <li>
              <button
                onClick={() => logoutUser()}
                className='rounded block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
      {setUpCollege && (
        <ConfirmModal
          heading={'College SetUp'}
          doneText='Done'
          text={
            <>
              Kindly mail your email credentials to{' '}
              <a
                href='mailto:11082004harshit@gmail.com'
                className='text-blue-600 underline'
              >
                11082004harshit@gmail.com
              </a>
            </>
          }
          done={() => setSetUpCollege(false)}
        />
      )}
    </div>
  );
};

export default UserMenu;
