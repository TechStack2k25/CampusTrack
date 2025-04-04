import { FcGoogle } from 'react-icons/fc';

export default function GoogleAuthButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className='w-full flex items-center justify-center gap-2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-md px-4 py-2 rounded-lg transition-all'
    >
      <FcGoogle className='text-xl' />
      <span className='font-medium'>Sign in</span>
    </button>
  );
}
