import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Table = ({ columns, data, title, colorScheme, link }) => {
    const navigate=useNavigate();
    return (
        <div className="">
            {title && <h2 onClick={() => link && navigate(link)} className={`text-xl font-bold ${link && "cursor-pointer hover:text-blue-400 hover:underline"} text-gray-700 dark:text-gray-400 tracking-tight mb-4`}>{title}</h2>}
            <div className="bg-white dark:bg-black dark:bg-opacity-30 dark:border dark:border-gray-700 shadow rounded-lg">
                <table className="min-w-full text-left">
                    {/* Table Headings */}
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col?.name+col?.id}
                                    className="px-4 py-3 border-b border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                                >
                                    {col.name}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr
                                key={`${row?._id || rowIndex}-${"unknown"}`}
                                    className={`${rowIndex % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"
                                        }`}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={`${row?._id || rowIndex}-${col?.id || "unknown"+col?.id}`}
                                            className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${colorScheme?.[col?.id]?.[row[col?.id]] || "text-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            {col?.type==='date'?new Date(row[col?.id])?.toLocaleDateString():row[col?.id] || "-"}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4">
                                    No Data Available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
