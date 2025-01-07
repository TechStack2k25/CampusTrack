import React from 'react'
import {useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const location=useLocation();
  const navigate= useNavigate();

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto flex justify-between items-center p-5">
        <h1 className="text-2xl font-bold">CampusTrack</h1>
        {location.pathname==='/' && <nav>
          <ul className="flex space-x-6">
            <li><a href="#home" className="hover:text-indigo-500">Home</a></li>
            <li><a href="#features" className="hover:text-indigo-500">Features</a></li>
            <li><a href="#roles" className="hover:text-indigo-500">Roles</a></li>
          </ul>
        </nav>}
        {location.pathname==='/' ? 
        <button onClick={()=>navigate('/login')}  className="bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600">Login</button>
        :
        <button onClick={()=>navigate(-1)}  className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-500">Back</button>
        }
      </div>
    </header>
  );
}

export default Header;
