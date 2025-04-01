import React, { forwardRef } from "react";

const Input=forwardRef(({ label = "Input", placeholder = "Enter your Input",type="text",...props },ref)=> {
  return (
    <div className="mb-4">
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700 dark:text-gray-500"
      >
        {label}:
      </label>
      <input
        id={label}
        ref={ref}
        placeholder={placeholder}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-700"
        {...props}
        type={type}
      />
    </div>
  );
})

export default Input;