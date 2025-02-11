import React from 'react'

function Features() {
    return (
      <section id="features" className="py-20 px-2">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10 text-black dark:text-white">Why Choose CampusTrack?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white border-gray-200 p-6 dark:bg-gray-900 flex flex-col justify-center items-center dark:border-gray-700 border rounded shadow-md">
              <img src="https://cdn3.iconfinder.com/data/icons/illustricon-tech/512/task.board-512.png" alt="Assignments" className="w-16 mx-auto mb-4 object-cover rounded-full border" />
              <div>
              <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Track Assignments</h3>
              <p className='font-normal text-gray-700 dark:text-gray-400'>Never miss a deadline with our automated reminders and calendar views.</p>
              </div>
            </div>
            <div className="bg-white border-gray-200 p-6 dark:bg-gray-900 flex flex-col justify-center items-center dark:border-gray-700 border rounded shadow-md">
              <img src="https://th.bing.com/th/id/OIP.Uhjkr0e7N2hXO7ywj_V96AHaHa?rs=1&pid=ImgDetMain" alt="Courses" className="w-16 mx-auto mb-4 object-cover rounded-full border"/>
              <div>
              <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Manage Courses</h3>
              <p className='font-normal text-gray-700 dark:text-gray-400'>Access all course materials, announcements, and updates in one place.</p>
              </div>
            </div>
            <div className="bg-white border-gray-200 p-6 dark:bg-gray-900 flex flex-col justify-center items-center dark:border-gray-700 border rounded shadow-md">
            <img src="https://th.bing.com/th/id/OIP.RJfwuD-rv-v4wHG8phDDZwHaHa?w=195&h=195&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="Events" className="w-16 mx-auto mb-4 object-cover rounded-full border"/>
            <div>
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Plan Events</h3>
            <p className='font-normal text-gray-700 dark:text-gray-400'>Stay informed about upcoming academic events, workshops, and deadlines. Our platform helps you synchronize your personal and academic calendars for better time management.</p>
            </div>
          </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default Features;
  