import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { nanoid } from "@reduxjs/toolkit";

const DataList = ({ title, data, filters, itemsPerPage = 5, options, query, setQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);



  console.log(query);


  console.log(options);

  console.log(filters);

  console.log(data);





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
    <div className="flex-1 p-6 flex flex-col items-center min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl text-center font-bold text-gray-700 dark:text-white">{title}</h1>
      </div>

      {/* Filters Section */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-6">
        {filters && filters?.map((filter) => (
          filter?.enable && <div key={filter.key}>
            <div className="flex justify-between gap-2 items-center">
              <label
                htmlFor={filter?.label}
                key={filter?.label + filter?.key}
                className="block text-md font-medium text-gray-700 dark:text-gray-300"
              >
                {filter?.label}
              </label>
              {(
                // Dynamic Select Input
                <select
                  key={filter?.key}
                  className="px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-800"
                  value={query?.[filter?.key] || ""}
                  onChange={(e) =>
                    setQuery((prev) => ({
                      ...prev,
                      [filter?.key]: e.target.value,
                    }))}
                >
                  <option value="">{filter?.placeholder}</option>
                  {options?.[filter.key]?.map((option) => (
                    <option key={option?._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Listing Section */}
      {data && data.length > 0 ? (
        <div>
          <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300 tracking-tight text-center my-6">{title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-black dark:bg-opacity-25 shadow-md hover:shadow-lg py-2 transition-shadow rounded-2xl w-80 flex justify-around items-center text-center border border-gray-200 dark:border-gray-800"
              >
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  {item?.name || item?.email}
                </h2>
                {item?.department?.name && (
                  <p className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg">
                    {item?.department?.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400 font-semibold mt-12 text-lg">No results found!</p>
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
