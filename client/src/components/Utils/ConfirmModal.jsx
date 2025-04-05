import React from 'react'

function ConfirmModal({ heading, text, doneText="", cancelText="", done, cancel, danger=false}) {
  return (
    <div
        id="deleteModal"
        className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
        >
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg max-w-sm w-full">
            <h2 className={`text-xl font-semibold ${danger?"text-red-600":"text-green-600"} mb-4`}>{heading}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            {text}
            </p>
            <div className="flex justify-end space-x-4">
            {cancelText?.length>0 && <button
                onClick={cancel} // Cancel delete
                className="text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md border border-gray-300 dark:border-gray-700"
            >
                {cancelText}
            </button>}
            {doneText?.length>0 && <button
                onClick={done} // Confirm delete
                className={`text-white ${danger?"bg-red-600 hover:bg-red-700":"bg-green-600 hover:bg-green-700"} py-2 px-4 rounded-md transition duration-300`}
            >
                {doneText}
            </button>}
            </div>
        </div>
        </div>
  )
}

export default ConfirmModal