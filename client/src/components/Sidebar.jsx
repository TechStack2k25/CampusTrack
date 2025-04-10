import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { userService } from '../api/userService';
import { useMutation } from '@tanstack/react-query';
import { setError, setSuccess } from '../store/slices/userSlice';
import { useApprovals } from "../data/approvals.js";

const Sidebar = ({ menuItems }) => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef(null);

  const hideMenu = (event) => {
    if (window.innerWidth < 768 && ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', hideMenu);
    return () => window.removeEventListener('mousedown', hideMenu);
  }, []);

  const mutationToHODRequest = useMutation({
    mutationFn: userService.updateUser,
    onSuccess: (data) => {
      console.log('Request created successfully:', data);
      dispatch(setSuccess('Sent Request!'));
    },
    onError: (error) => {
      dispatch(setError(error?.response?.data?.message));
      console.error('Error creating course:', error);
    }
  });

  const makeHOD = () => mutationToHODRequest.mutate({ ...user, role: "HOD" });

  const enabled = user?.role && !['Student', 'User'].includes(user.role);
  const approvals = useApprovals(enabled);

  const quantities = {
    Approvals: approvals?.data?.length || 0,
  };

  return (
    <>
      <aside className={`absolute z-20 sm:static top-16 left-0 sm:top-0 text-black dark:text-white ${open ? 'block' : 'hidden'} sm:block transition-all`}>
        <div
          ref={ref}
          className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 sm:w-60 w-64 shadow-lg mx-2 p-4 rounded-xl border border-gray-200 sm:mt-2 dark:border-gray-700 transition-all"
        >
          <div className="flex items-center space-x-4 mb-6 px-2">
            <div
              onClick={() => navigate('/dashboard')}
              className="cursor-pointer h-10 w-10 sm:h-12 sm:w-12 text-xl bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-md hover:scale-105 transition"
            >
              {user?.name?.toUpperCase()[0] || user?.email.toUpperCase()[0]}
            </div>
            <span className="text-lg font-semibold truncate dark:text-white text-gray-900">
              {user?.name || user?.email.split('@')[0]}
            </span>
          </div>

          <ul className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name + item.link}
                to={item.link}
                className={({ isActive }) =>
                  `transition duration-300 rounded-full px-4 py-2 font-medium flex justify-between items-center ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`
                }
              >
                <span>{item.name}</span>
                {quantities?.[item.name] > 0 && (
                  <span className="relative inline-flex w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                )}
              </NavLink>
            ))}

            {user?.role === "faculty" && (
              <li
                onClick={makeHOD}
                className="cursor-pointer px-4 py-2 rounded-full font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900 text-yellow-700 dark:text-yellow-300 transition"
              >
                Request for HOD
              </li>
            )}
          </ul>
        </div>
      </aside>

      {/* Toggle Button */}
      <div
        onClick={() => setOpen(!open)}
        className="text-black dark:text-white fixed sm:top-24 top-20 left-4 sm:hidden text-3xl cursor-pointer z-30"
      >
        {open ? <IoCloseSharp /> : <MdOutlineMenu />}
      </div>
    </>
  );
};

export default Sidebar;
