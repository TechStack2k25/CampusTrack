import React from 'react'
import { Link } from 'react-router-dom';

export default function Main() {
    return (
      <section id='home' className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-20">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold mb-5">Effortlessly Manage Your Courses & Assignments</h1>
          <p className="text-lg mb-10">Track assignments, meet deadlines, and communicate with faculty and admins—all in one place.</p>
          <Link to={'login'}> <button className="bg-white text-indigo-600 px-6 py-3 rounded font-medium hover:bg-gray-100">Get Started</button></Link>
        </div>
      </section>
    );
}
  