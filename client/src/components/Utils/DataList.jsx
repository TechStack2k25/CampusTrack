import React, { useEffect, useState } from 'react';
import Pagination from './Pagination';
import { nanoid } from '@reduxjs/toolkit';
import { FaTrashAlt } from 'react-icons/fa';

const DataList = ({
  title,
  data,
  filters,
  itemsPerPage = 5,
  options,
  query,
  setQuery,
  handleRemove,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // console.log(query);

  // console.log(options);

  // console.log(filters);

  // console.log(data);

  // Pagination logic
  // const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // const handlePageChange = (page) => {
  //   if (page >= 1 && page <= totalPages) {
  //     setCurrentPage(page);
  //   }
  // };

  return (
    <div className='flex-1 p-6 flex flex-col items-center min-h-screen'>
      <div className='mb-6'>
        <h1 className='text-2xl text-center font-bold text-gray-700 dark:text-white'>
          {title}
        </h1>
      </div>

      {/* Filters Section */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-6 w-full max-w-4xl">
  {filters &&
    filters.map(
      (filter) =>
        filter?.enable && (
          <div key={filter.key} className="flex flex-col space-y-1">
            <label
              htmlFor={filter.key}
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {filter.label}
            </label>

            {options?.[filter.key] ? (
              <select
                id={filter.key}
                value={query?.[filter.key] || ''}
                onChange={(e) =>
                  setQuery((prev) => ({
                    ...prev,
                    [filter.key]: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-md border shadow-sm text-gray-800 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-700"
              >
                <option value="">{filter.placeholder}</option>
                {options[filter.key].map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                id={filter.key}
                placeholder={filter.placeholder}
                value={query?.[filter.key] || ''}
                onChange={(e) =>
                  setQuery((prev) => ({
                    ...prev,
                    [filter.key]: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-md border shadow-sm text-gray-800 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-700"
              />
            )}
          </div>
        )
    )}
</div>


      {/* Listing Section */}
      {data && data.length > 0 ? (
        <div className='overflow-x-auto'>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight text-center my-6'>
            {title}
          </h1>
          <div className='bg-white space-y-1 dark:bg-black dark:bg-opacity-25 rounded-lg shadow-lg'>
            <div className='grid grid-cols-4 gap-4 p-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-sm rounded-t-lg'>
              {/* Table Headers */}
              <div>Name</div>
              <div>Email</div>
              <div>Department</div>
              <div>Actions</div>
            </div>

            {data.map((item) => (
              <div
                key={item._id}
                className='bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200'
              >
                <div className='grid grid-cols-4 gap-4 p-4'>
                  <div className='truncate'>{item?.name || item?.email}</div>
                  <div className='truncate'>{item?.email}</div>
                  <div className='truncate'>
                    {item?.department?.name ? (
                      <span className='text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md'>
                        {item?.department?.name}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className='flex items-center justify-center text-white bg-red-500 hover:bg-red-600 py-2 px-4 rounded-md shadow-md hover:shadow-lg transition duration-200'
                    >
                      <FaTrashAlt className='mr-2' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className='text-center text-gray-600 dark:text-gray-400 font-semibold mt-12 text-lg'>
          No results found!
        </p>
      )}

      {/* Pagination Component
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )} */}
    </div>
  );
};

export default DataList;
