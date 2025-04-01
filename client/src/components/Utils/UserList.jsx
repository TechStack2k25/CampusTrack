import React, { useEffect, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi';
import ListElement from './ListElement';
import { socketService } from '../../api/socketService';


function UserList({unseenData, userData, setCurrentUser}) {
  const [showCourses, setShowCourses] = useState(false);

  return (
    <div className="flex-1 p-2 overflow-y-auto hide-scrollbar">
        <ul>
        {userData?.users.map((user) => 
            user && <li key={user._id} onClick={()=>setCurrentUser(user)} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <span className="font-medium">{user.name}</span>
            {unseenData?.[user?._id] && <span className={`text-sm text-white bg-blue-500`}>{unseenData?.[user?._id]}</span>}
            </li>
        )}
        </ul>
        { userData?.courses?.length>0 && <div className="p-2">
          <button 
            onClick={() => setShowCourses(!showCourses)} 
            className="w-full flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <span className="font-medium">Courses</span>
            <FiChevronDown className={`w-5 h-5 transition-transform duration-300 ${showCourses ? 'rotate-180' : 'rotate-0'}`} />
          </button>
          {showCourses && (
            <ul className="mt-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
              {userData?.courses?.map((course) => course && <ListElement key={course._id} unseenCount={unseenData?.[course?._id] || 0} user={course} setUser={setCurrentUser} />)}
            </ul>
          )}
        </div>}
    </div>
  )
}

export default UserList