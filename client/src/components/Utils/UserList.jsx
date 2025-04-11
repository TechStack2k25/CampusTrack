import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import ListElement from './ListElement';

function UserList({ unseenData, userData, setCurrentUser }) {
  const [showCourses, setShowCourses] = useState(false);

  const handleSelect = (user) => {
    setCurrentUser({
      ...user,
      unseen: unseenData?.[user?._id] || 0,
    });
  };

  return (
    <div className="flex-1 p-2 overflow-y-auto hide-scrollbar">
      <ul className="space-y-1">
        {userData?.users?.map(
          (user) =>
            user && (
              <li
                key={user._id}
                onClick={() => handleSelect(user)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <span className="font-medium text-gray-800 dark:text-white">
                  {user.name}
                </span>
                {unseenData?.[user._id] > 0 && (
                  <span className="text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full text-white bg-blue-500 shadow-sm">
                    {unseenData[user._id]}
                  </span>
                )}
              </li>
            )
        )}
      </ul>

      {userData?.courses?.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowCourses(!showCourses)}
            className="w-full flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <span className="font-medium text-gray-800 dark:text-white">Courses</span>
            <FiChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                showCourses ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showCourses ? 'max-h-96 mt-2' : 'max-h-0'
            }`}
          >
            <ul className="space-y-1 mt-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
              {userData?.courses.map(
                (course) =>
                  course && (
                    <ListElement
                      key={course._id}
                      unseenCount={unseenData?.[course._id] || 0}
                      user={course}
                      setUser={setCurrentUser}
                    />
                  )
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
