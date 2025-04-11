import React from "react";

function Roles() {
  return (
    <section
      id="roles"
      className="py-16 px-4 mx-2 my-6 rounded-2xl shadow-inner bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700"
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-12 text-textPrimary dark:text-white">
          Who Can Use <span className="text-primary">CampusTrack?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Role: Students */}
          <div className="bg-surface dark:bg-gray-900 p-8 rounded-xl border border-borderColor dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-200">
            <h3 className="text-2xl font-semibold text-textPrimary dark:text-white mb-3">🎓 Students</h3>
            <p className="text-textSecondary dark:text-gray-400">
              Keep track of assignments, deadlines, and grades in one seamless interface.
            </p>
          </div>

          {/* Role: Faculty */}
          <div className="bg-surface dark:bg-gray-900 p-8 rounded-xl border border-borderColor dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-200">
            <h3 className="text-2xl font-semibold text-textPrimary dark:text-white mb-3">📘 Faculty</h3>
            <p className="text-textSecondary dark:text-gray-400">
              Create and manage assignments, release announcements, and monitor student progress.
            </p>
          </div>

          {/* Role: Admins */}
          <div className="bg-surface dark:bg-gray-900 p-8 rounded-xl border border-borderColor dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-200">
          <h3 className="text-2xl font-semibold text-textPrimary dark:text-white mb-3">🛡️ Admins</h3>
            <p className="text-textSecondary dark:text-gray-400">
              Oversee platform usage, manage users, and ensure seamless operations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Roles;
