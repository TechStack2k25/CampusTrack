import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";

const Sidebar = ({menuItems}) => {
    const [open,setOpen]=useState(false);

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

    
  return (
    <>
        <aside className={`absolute z-20 sm:rounded-none rounded top-16 left-0 sm:static  text-white ${open ? 'block' : 'hidden'} sm:block`}>
            <div ref={ref} className='bg-gray-800  sm:w-56 mx-1 sm:pl-4 px-2 sm:py-4 py-1 sm:my-1 rounded-md'>
                <div className='flex my-2 px-2 space-x-4 items-center'>
                            <div onClick={()=>navigate('/dashboard')} className="cursor-pointer h-8 sm:h-12 text-xl aspect-square bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                U
                            </div>
                            <span className="text-white text-xl font-semibold">Username</span>
                    </div>
                <ul>
                    {menuItems.map((item) => (
                        <NavLink key={item.name+item.link} to={item.link} className={({ isActive }) =>
                            isActive
                            ? ' text-blue-400'
                            : ' hover:text-blue-400'
                        } >
                            <li key={item.name} className="py-2 px-4 rounded-full hover:bg-gray-700">
                                    <span>
                                        <span>{item.name}</span>
                                    </span>
                            </li>
                        </NavLink>
                    ))}
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
