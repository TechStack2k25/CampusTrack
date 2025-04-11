import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setError, clearError, setSuccess } from '../store/slices/userSlice';
import { authService } from '../api/authService';
import { userService } from '../api/userService';
import { Notifications } from './userComponents';
import { ConfirmModal } from './Utils';
import { FaSpinner, FaUser, FaSignOutAlt, FaEnvelopeOpenText, FaUniversity, FaUserShield } from 'react-icons/fa';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [setUpCollege, setSetUpCollege] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const logoutUser = () => {
    dispatch(clearError());
    try {
      if (authService.userLogout()) {
        dispatch(logout());
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const sendVerificationMail = async () => {
    try {
      setIsVerifying(true);
      const res = await userService.callToVerify();
      if (res) dispatch(setSuccess('Verification mail sent to your email!'));
    } catch (error) {
      dispatch(setError(error?.response?.data?.message));
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative' ref={menuRef}>
      <div className='flex items-center space-x-2 sm:space-x-4'>
        {!['User', 'Owner'].includes(user?.role) && <Notifications />}
        <button onClick={toggleMenu} className='transition-transform duration-200 hover:scale-105 focus:outline-none'>
          <div className='cursor-pointer h-10 aspect-square bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold'>
            {user?.name?.toUpperCase()[0] || user?.email.toUpperCase()[0]}
          </div>
        </button>
      </div>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-52 bg-white dark:bg-gray-950 dark:border-gray-800 border border-gray-200 rounded-lg shadow-xl transition-all duration-200 ease-in-out z-50 px-1'>
          <ul className='py-1'>
            <li>
              <Link to='/dashboard'>
                <div className='flex px-3 py-2 space-x-2 items-center hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md'>
                  <div className='h-8 aspect-square bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold'>
                    {user?.name?.toUpperCase()[0] || user?.email.toUpperCase()[0]}
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

                    `flex items-center gap-2 w-full text-left px-4 py-2 rounded-md text-sm ${
                      isActive
                        ? 'bg-blue-500 text-white dark:bg-blue-700'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }`
                  }
                >
                  <FaUser />
                  {user?.role === 'Admin' ? 'College' : 'Profile'}
                </NavLink>
              </li>
            )}

            {!user?.active && (
              <li
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md cursor-pointer ${
                  isVerifying
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
                onClick={!isVerifying ? sendVerificationMail : null}
              >
                {isVerifying ? <FaSpinner className='animate-spin w-4 h-4' /> : <FaEnvelopeOpenText />}
                {isVerifying ? 'Requesting...' : 'Verify Email'}
              </li>
            )}

            {!['Admin', 'HOD', 'Owner'].includes(user?.role) && user?.active && (
              <li>
                <NavLink
                  to='/request'
                  className={({ isActive }) =>
                    `flex items-center gap-2 w-full text-left px-4 py-2 rounded-md text-sm ${
                      isActive
                        ? 'bg-blue-500 text-white dark:bg-blue-700'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }`
                  }
                >
                  <FaUserShield />
                  Request
                </NavLink>
              </li>
            )}

            {user?.role === 'User' && user?.active && (
              <li
                className='flex items-center gap-2 cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md'
                onClick={() => setSetUpCollege(true)}
              >
                <FaUniversity />
                SetUp College
              </li>
            )}

            <li>
              <button
                onClick={logoutUser}
                className='flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md'
              >
                <FaSignOutAlt />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}

      {setUpCollege && (
        <ConfirmModal
          heading='College SetUp'
          doneText='Done'
          text={
            <>
              Kindly mail your email credentials to{' '}
              <a href='mailto:11082004harshit@gmail.com' className='text-blue-600 underline'>
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
