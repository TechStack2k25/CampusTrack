import React from "react";

function ConfirmModal({
  heading,
  text,
  doneText = "",
  cancelText = "",
  done,
  cancel,
  danger = false,
}) {
  return (
    <div
      id="confirmModal"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-sm">
        <h2
          className={`text-xl font-bold mb-3 ${
            danger ? "text-red-600" : "text-blue-600"
          }`}
        >
          {heading}
        </h2>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">{text}</p>

        <div className="flex justify-end space-x-3">
          {cancelText?.length > 0 && (
            <button
              onClick={cancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {cancelText}
            </button>
          )}
          {doneText?.length > 0 && (
            <button
              onClick={done}
              className={`px-4 py-2 rounded-md text-white transition ${
                danger
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {doneText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
