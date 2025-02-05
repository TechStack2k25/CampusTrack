import React from "react";

const AssignmentCard = ({ assignment }) => {
  const statusColors = {
    Pending: "bg-red-100 text-red-700",
    Completed: "bg-green-100 text-green-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
  };

  //update and delete functionality to add
  console.log(assignment)
  console.log("hello");
  

  const date=new Date(assignment?.deadline);
  const isPastDeadline = assignment?.deadline && date < new Date();

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-800">{assignment.title}</h2>
        
        {assignment?.status && <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-nowrap ${
            statusColors[assignment.status]
          }`}
        >
          {assignment.status}
        </span>}

      </div>
      <p className="text-gray-600">
        <strong>Subject:</strong> {assignment?.coursename}
      </p>
      {date && assignment?.deadline && <p>
        <strong className="text-gray-600">Due Date:</strong><span  className={`font-semibold ${isPastDeadline ? "text-red-600" : "text-green-600"}`}> {date?.toLocaleDateString()}</span>
      </p>}
    </div>
  );
};

export default AssignmentCard;
