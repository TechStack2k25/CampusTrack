import React from 'react'
import { Link } from 'react-router-dom';

export default function Main() {
    return (
      <section id='home' className=" dark:text-white text-center py-20 border-2 dark:border-gray-700 border-gray-200 mx-2 my-4 rounded-md shadow">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold mb-5 dark:text-white">Effortlessly Manage Your Courses & Assignments</h1>
          <p className="text-lg font-semibold mb-10 dark:dark:text-gray-400">Track assignments, meet deadlines, and communicate with faculty and admins—all in one place.</p>
          <Link to={'login'}> <button className="dark:bg-white text-white hover:bg-indigo-700 bg-indigo-600 dark:text-indigo-600 dark:hover:text-white dark:hover:bg-indigo-600 px-6 py-3 rounded font-medium transition-all duration-150">Get Started</button></Link>
        </div>
      </section>
    );
}
  