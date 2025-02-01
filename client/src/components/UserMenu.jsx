import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setError, clearError } from '../store/slices/userSlice';
import { authService } from '../api/authService';
import { Link } from 'react-router-dom';


const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const navigate=useNavigate();
  const {user}=useSelector((state)=>state.user);
  const dispatch=useDispatch();



  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false); // Close the menu when clicking outside
    }
  };

  const logoutUser=()=>{
    console.log('logout user...');
    dispatch(clearError());
    //call API
    try {
      if(authService.userLogout()){
        dispatch(logout());
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
    //dispatch user data

  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* User Icon */}
      <button
        onClick={toggleMenu}
        className="flex items-center rounded-full"
      >
        <div className="cursor-pointer h-10 aspect-square bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {user?.name?.toUpperCase()[0] || user?.email.toUpperCase()[0]}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg px-1">
          <ul className="py-1">
            <li>
                <Link to="/dashboard">
                    <div className='flex px-2 py-2 space-x-2 items-center'>
                      <div className="h-8 aspect-square bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.toUpperCase()[0] || user?.email.toUpperCase()[0]}
                      </div>
                      <span className="text-black font-semibold truncate">{user?.name || user?.email.split('@')[0]}</span>
                    </div>
                </Link>
            </li>
            <li>
            <NavLink 
                to="/profile" 
                  className={({ isActive }) => 
                    isActive
                      ? 'bg-blue-400 text-white  rounded hover:bg-white hover:text-blue-500 block w-full text-left px-4 py-2 text-bold'
                      : 'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  }
                >
                Profile
              </NavLink>
            </li>
            {!["Admin","HOD"].includes(user?.role) && <li>
            <NavLink 
                to="/request" 
                  className={({ isActive }) => 
                    isActive
                      ? 'bg-blue-400 text-white  rounded hover:bg-white hover:text-blue-500 block w-full text-left px-4 py-2 text-bold'
                      : 'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  }
                >
                Request
              </NavLink>
            </li>}
            <li>
              <button
                onClick={() => logoutUser()}
                className="rounded block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
