import React from "react";

function Roles() {
  return (
    <section id="roles" className="py-10 border dark:border-gray-700 border-gray-200 mx-2 px-2 my-4 rounded-md shadow-inner">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10 text-black dark:text-white">Who Can Use CampusTrack?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-700 border rounded shadow-md">
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Students</h3>
            <p className='font-normal text-gray-700 dark:text-gray-400'>Keep track of assignments, deadlines, and grades in one seamless interface.</p>
          </div>
          <div className="bg-white border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-700 border rounded shadow-md">
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Faculty</h3>
            <p className='font-normal text-gray-700 dark:text-gray-400'>Create and manage assignments, release announcements, and monitor student progress.</p>
          </div>
          <div className="bg-white border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-700 border rounded shadow-md">
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Admins</h3>
            <p className='font-normal text-gray-700 dark:text-gray-400'>Oversee platform usage, manage users, and ensure seamless operations.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Roles;
