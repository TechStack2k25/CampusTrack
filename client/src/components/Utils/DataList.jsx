import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";

const DataList = ({ title, data, filters, itemsPerPage = 5 }) => {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // filtering
  useEffect(() => {
    //initialize filtering
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Filter logic
  const filteredData = data.filter((item) => {
    //later
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex-1 p-6 flex flex-col items-center bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl text-center font-bold text-gray-700">{title}</h1>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search Box */}
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Dynamic Filters */}
        {filters.map((filter) => (
          <select
            key={filter.key}
            className="px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedFilters[filter.key] || ""}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          >
            <option value="">{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Listing Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-700">{item.name}</h2>
              <p className="text-sm text-gray-500">{item.role}</p>
              <p className="text-sm text-gray-500">
                Department: {item.department}
              </p>
              {item.semester && (
                <p className="text-sm text-gray-500">Semester: {item.semester}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No results found.</p>
        )}
      </div>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default DataList;
