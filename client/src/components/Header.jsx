import React from 'react'
import {useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import UserMenu from './UserMenu';

function Header() {
  const location=useLocation();
  const navigate= useNavigate();
  const {user,status}=useSelector((state)=>state.user);
  // console.log(user,status);
  const scroll = (label) => {
    const Element = document.querySelector(label);
    if (Element) {
      Element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  

  return (
    <header className="sticky top-0 z-50 dark:bg-black bg-white border-b dark:border-gray-700 border-gray-200 dark:text-white text-black rounded-b-md ">
      <div className="container mx-auto flex justify-between items-center md:px-10 p-5">
        <h1 className="text-2xl font-bold">CampusTrack</h1>
        {!status && location.pathname==='/' && <nav className='hidden sm:block'>
          <ul className="flex space-x-6">
            <li onClick={()=>scroll('#home')} className="hover:text-indigo-500 cursor-pointer">Home</li>
            <li onClick={()=>scroll('#features')}  className="hover:text-indigo-500 cursor-pointer">Features</li>
            <li onClick={()=>scroll('#roles')}  className="hover:text-indigo-500 cursor-pointer">Roles</li>
          </ul>
        </nav>}
        {status? 
        (<UserMenu />):
        (location.pathname==='/' ? 
        <button onClick={()=>navigate('/login')}  className="bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600">Login</button>
        :
        <button onClick={()=>navigate('/')}  className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-500">Home</button>
        )}
      </div>
    </header>
  );
}

export default Header;
