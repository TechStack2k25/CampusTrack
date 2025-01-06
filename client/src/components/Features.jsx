import React from 'react'

function Features() {
    return (
      <section id="features" className="bg-gray-100 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10">Why Choose CampusTrack?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded shadow-md">
              <img src="https://cdn3.iconfinder.com/data/icons/illustricon-tech/512/task.board-512.png" alt="Assignments" className="w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Track Assignments</h3>
              <p>Never miss a deadline with our automated reminders and calendar views.</p>
            </div>
            <div className="bg-white p-6 rounded shadow-md">
              <img src="https://th.bing.com/th/id/OIP.Uhjkr0e7N2hXO7ywj_V96AHaHa?rs=1&pid=ImgDetMain" alt="Courses" className="w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Manage Courses</h3>
              <p>Access all course materials, announcements, and updates in one place.</p>
            </div>
            <div className="bg-white p-6 rounded shadow-md">
            <img src="https://th.bing.com/th/id/OIP.RJfwuD-rv-v4wHG8phDDZwHaHa?w=195&h=195&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="Events" className="w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Plan Events</h3>
            <p>Stay informed about upcoming academic events, workshops, and deadlines. Our platform helps you synchronize your personal and academic calendars for better time management.</p>
          </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default Features;
  