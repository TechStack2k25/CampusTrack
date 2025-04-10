import React from 'react';
import { Link } from 'react-router-dom';

export default function Main() {
  return (
    <section
      id="home"
      className="text-center py-20 mx-4 my-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg border border-borderColor dark:border-gray-700"
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-textPrimary dark:text-white leading-tight">
          Effortlessly Manage Your Courses & Assignments
        </h1>
        <p className="text-lg md:text-xl font-medium mb-10 text-textSecondary dark:text-gray-400 max-w-3xl mx-auto">
          Track assignments, meet deadlines, and communicate with faculty and admins—all in one place.
        </p>
        <Link to={'/login'}>
          <button className="bg-primary text-white hover:bg-indigo-700 dark:bg-white dark:text-primary dark:hover:bg-indigo-600 dark:hover:text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-200">
            Get Started
          </button>
        </Link>
      </div>
    </section>
  );
}
