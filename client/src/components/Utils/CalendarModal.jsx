import React from "react";

function CalendarModal({ children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-950 dark:border dark:border-gray-700 rounded-lg shadow-lg w-96 p-6 relative">
        <button
          className="text-2xl absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default CalendarModal;
