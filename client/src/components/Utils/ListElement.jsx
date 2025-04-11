import React from 'react';

function ListElement({ unseenCount = 0, user, setUser }) {
  return (
    <li
      onClick={() => setUser({ ...user, unseen: unseenCount })}
      className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <span className="font-medium text-gray-800 dark:text-white">
        {user.name}
      </span>
      {unseenCount > 0 && (
        <span className="text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
          {unseenCount}
        </span>
      )}
    </li>
  );
}

export default ListElement;
