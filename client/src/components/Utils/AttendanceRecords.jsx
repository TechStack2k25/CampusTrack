import React from "react";

const attendanceRecords = [
  { course: "Mathematics", date: "2025-01-10", status: "Present" },
  { course: "Physics", date: "2025-01-09", status: "Absent" },
  { course: "Chemistry", date: "2025-01-08", status: "Present" },
  { course: "Biology", date: "2025-01-07", status: "Absent" },
];

const AttendanceRecords = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 p-4">Course</th>
            <th className="border-b-2 p-4">Date</th>
            <th className="border-b-2 p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map((record, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="p-4">{record.course}</td>
              <td className="p-4">{record.date}</td>
              <td
                className={`p-4 ${
                  record.status === "Present"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {record.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceRecords;
