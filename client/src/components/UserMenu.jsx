import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'


const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const navigate=useNavigate();
  const {user}=useSelector((state)=>state.user);



  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false); // Close the menu when clicking outside
    }
  };

  const logout=()=>{
    console.log('logout user...');
    //call API
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
          {user?.email.toUpperCase()[0]}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg">
          <ul className="py-1">
            <li>
              <div className='flex px-2 py-2 space-x-2 items-center'>
                <div className="h-8 aspect-square bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.email.toUpperCase()[0]}
                 </div>
                 <span className="text-black font-semibold">{user?.email.split('@')[0]}</span>
              </div>
            </li>
            <li>
              <button
                onClick={() => navigate('/profile')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => logout()}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
