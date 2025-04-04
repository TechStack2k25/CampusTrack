import { FaSpinner } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <FaSpinner
        className="text-blue-500 animate-spin text-4xl"
        aria-label="Loading"
      />
    </div>
  );
};

export default Loader;
