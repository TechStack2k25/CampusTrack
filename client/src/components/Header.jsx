import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserMenu from './UserMenu';
import { toast } from 'react-toastify';
import Logo from './Logo';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, status } = useSelector((state) => state.user);

  const scroll = (label) => {
    const Element = document.querySelector(label);
    if (Element) {
      Element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    setTimeout(()=>{
      if (status && !user?.active) {
      toast.info('Verify your email!');
    }},3000);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b dark:border-gray-700 border-gray-200 shadow-sm dark:text-white text-black rounded-b-md transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center p-4 sm:px-8 md:px-12">
        <Logo />

        {!status && location.pathname === '/' && (
          <nav className="hidden sm:block">
            <ul className="flex space-x-6 font-medium">
              <li
                onClick={() => scroll('#home')}
                className="hover:text-indigo-500 transition cursor-pointer"
              >
                Home
              </li>
              <li
                onClick={() => scroll('#features')}
                className="hover:text-indigo-500 transition cursor-pointer"
              >
                Features
              </li>
              <li
                onClick={() => scroll('#roles')}
                className="hover:text-indigo-500 transition cursor-pointer"
              >
                Roles
              </li>
            </ul>
          </nav>
        )}

        {status ? (
          <UserMenu />
        ) : location.pathname === '/' ? (
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white dark:text-black px-5 py-2 rounded-lg font-semibold shadow-sm ring-1 ring-indigo-500/10"
          >
            Login
          </button>
        ) : (
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white dark:text-black px-5 py-2 rounded-lg font-semibold shadow-sm ring-1 ring-indigo-500/10"
          >
            Home
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
