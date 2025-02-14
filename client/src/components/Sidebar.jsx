import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from 'react-redux'
import { userService } from '../api/userService';
import { useMutation } from '@tanstack/react-query';
import { setError, setSuccess } from '../store/slices/userSlice';
import { useDispatch } from 'react-redux';

const Sidebar = ({menuItems}) => {
    const [open,setOpen]=useState(false);

    const dispatch=useDispatch();

    const {user}=useSelector((state)=>state.user);

    const navigate=useNavigate();

    const ref=useRef(null);

    const hideMenu = (event) => {
      if(window.innerWidth<768 && ref && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    
    useEffect(() => {
        window.addEventListener('mousedown', hideMenu); // Listen for window mousedown
    
        return () => window.removeEventListener('mousedown', hideMenu); // Cleanup
    }, []);

    const mutationToHODRequest = useMutation({
        mutationFn: userService.updateUser,
        onSuccess: (data) => {
          console.log('Request created successfully:', data);
          dispatch(setSuccess('Sent Request!'));
          reset(); // Reset the form after submission
        },
        onError: (error) => {
          dispatch(setError(error?.response?.data?.message))
          console.error('Error creating course:', error);
        }
      });

    const makeHOD=()=>mutationToHODRequest.mutate({...user,role:"HOD"});
    

    
  return (
    <>
        <aside className={`absolute z-20 sm:rounded-none rounded top-16 left-0 sm:static  text-white ${open ? 'block' : 'hidden'} sm:block`}>
            <div ref={ref} className='bg-gray-800  sm:w-56 mx-1 sm:pl-4 px-2 sm:py-4 py-1 sm:my-1 rounded-md border-2 dark:border-gray-700 border-gray-200'>
                <div className='flex my-2 px-2 space-x-4 items-center'>
                            <div onClick={()=>navigate('/dashboard')} className="cursor-pointer h-8 sm:h-12 text-xl aspect-square bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                {user?.name?.toUpperCase()[0] || user?.email.toUpperCase()[0]}
                            </div>
                            <span className="text-white text-xl font-semibold truncate">{user?.name || user?.email.split('@')[0]}</span>
                    </div>
                <ul>
                    {menuItems.map((item) => (
                        <NavLink key={item.name+item.link} to={item.link} className={({ isActive }) =>
                            isActive
                            ? ' text-blue-400 dark:text-blue-600'
                            : ' hover:text-blue-400 dark:hover:text-blue-600'
                        } >
                            <li key={item.name} className="py-2 px-4 rounded-full hover:bg-gray-700">
                                    <span>
                                        <span>{item.name}</span>
                                    </span>
                            </li>
                        </NavLink>
                    ))}
                    {user?.role==="faculty" && <li onClick={makeHOD} className="cursor-pointer py-2 px-4 rounded-full hover:bg-gray-700">
                                    <span>
                                        <span>Request for HOD</span>
                                    </span>
                            </li>}
                </ul>
        </div>
        </aside>

        <div
        onClick={() => setOpen(!open)}
        className="text-black absolute top-7 left-4 sm:hidden text-2xl cursor-pointer"
        >
        {open ? <IoCloseSharp /> : <MdOutlineMenu />}
        </div>

    </>
  );
};

export default Sidebar;
