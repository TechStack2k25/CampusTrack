const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4 dark:text-white">{title}</h2>
        <div>{children}</div>
        <button
          onClick={onClose}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );

  export default Modal;
  