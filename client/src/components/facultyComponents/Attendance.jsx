import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Attendance = () => {
  const { register, handleSubmit, reset } = useForm();
  const [courseDetails, setCourseDetails] = useState(null);
  const [attendance, setAttendance] = useState({});

  // Example students database for simplicity
  const studentsData = {
    "IT-Sem1": [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
    ],
    "IT-Sem2": [
      { id: 3, name: "Alice Brown" },
      { id: 4, name: "Bob Johnson" },
    ],
  };

// Example courseDetails for simplicity
//   { 
//      others: xyz,
//     students:[
//     {
//         id: 123,
//         name: 'Ramesh'
//     },
//     {
//         id: 13,
//         name: 'Ramesh'
//     },
//     {
//         id: 23,
//         name: 'Ramesh'
//     },
//   ]}

  // Fetch students based on course details
  const onSubmit = (data) => {
    const key = `${data.course}-${data.semester}`;
    setCourseDetails({ ...data, students: studentsData[key] || [] });
    reset();
  };

  const handleAttendanceChange = (id, status) => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Attendance</h1>

      {/* Course Input Form */}
      {!courseDetails && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 shadow rounded mb-6 max-w-md mx-auto"
        >
          <div className="mb-4">
            <label className="block font-medium mb-1">Course</label>
            <select
              {...register("course", { required: "Course is required" })}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select a course</option>
              {/* require array of courses  of faculty */}
              <option value="IT">IT</option>
              <option value="CSE">CSE</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Semester</label>
            <select
              {...register("semester", { required: "Semester is required" })}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select semester</option>
              <option value="Sem1">Semester 1</option>
              <option value="Sem2">Semester 2</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Date</label>
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded"
          >
            Load Students
          </button>
        </form>
      )}

      {/* Attendance Marking */}
      {courseDetails && (
        <div className="bg-white p-6 shadow rounded">
            <div>
                <h2 className="text-xl font-bold mb-4">Course: {courseDetails.course}</h2>
                <div className="grid grid-cols-2 space-x-2">
                    <h3 className="text-lg mb-4">Semester: {courseDetails.semester}</h3>
                    <h4 className="text-md mb-6">Date: {courseDetails.date}</h4>
                </div>
            </div>

          {courseDetails.students.length > 0 ? (
            courseDetails.students.map((student) => (
              <div
                key={student.id}
                className="grid grid-cols-2 space-x-2 mb-4"
              >
                <p className="font-medium">{student.name}</p>
                <div className="space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={attendance[student.id] === "present"}
                      onChange={() => handleAttendanceChange(student.id, "present")}
                    />
                    <span>Present</span>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p>No students found for this course and semester.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;
