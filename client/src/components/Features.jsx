import React from 'react';

function Features() {
  return (
    <section
      id="features"
      className="py-20 px-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-12 text-textPrimary dark:text-white">
          Why Choose <span className="text-primary">CampusTrack?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature Card 1 */}
          <div className="bg-surface dark:bg-gray-900 p-8 rounded-2xl border border-borderColor dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-200 text-left flex flex-col items-center">
            <img
              src="https://cdn3.iconfinder.com/data/icons/illustricon-tech/512/task.board-512.png"
              alt="Assignments"
              className="w-20 h-20 mb-4 object-cover rounded-full border-4 border-primary shadow"
            />
            <h3 className="text-2xl font-semibold text-textPrimary dark:text-white mb-2">
              Track Assignments
            </h3>
            <p className="text-textSecondary dark:text-gray-400 text-center">
              Never miss a deadline with our automated reminders and calendar views.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-surface dark:bg-gray-900 p-8 rounded-2xl border border-borderColor dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-200 text-left flex flex-col items-center">
            <img
              src="https://th.bing.com/th/id/OIP.Uhjkr0e7N2hXO7ywj_V96AHaHa?rs=1&pid=ImgDetMain"
              alt="Courses"
              className="w-20 h-20 mb-4 object-cover rounded-full border-4 border-accent shadow"
            />
            <h3 className="text-2xl font-semibold text-textPrimary dark:text-white mb-2">
              Manage Courses
            </h3>
            <p className="text-textSecondary dark:text-gray-400 text-center">
              Access all course materials, announcements, and updates in one place.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-surface dark:bg-gray-900 p-8 rounded-2xl border border-borderColor dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-200 text-left flex flex-col items-center">
            <img
              src="https://th.bing.com/th/id/OIP.RJfwuD-rv-v4wHG8phDDZwHaHa?w=195&h=195&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt="Events"
              className="w-20 h-20 mb-4 object-cover rounded-full border-4 border-indigo-400 shadow"
            />
            <h3 className="text-2xl font-semibold text-textPrimary dark:text-white mb-2">
              Plan Events
            </h3>
            <p className="text-textSecondary dark:text-gray-400 text-center">
              Stay informed about upcoming academic events, workshops, and deadlines.
              Sync your calendars for better time management.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
