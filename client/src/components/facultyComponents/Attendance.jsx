import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCourses } from "../../data/courses";
import { useDispatch, useSelector } from "react-redux";
import { userService } from "../../api/userService";
import { attendanceService } from "../../api/attendance";
import { setError, setSuccess } from "../../store/slices/userSlice";

const Attendance = () => {
  const { register, handleSubmit, reset } = useForm();
  const [courseDetails, setCourseDetails] = useState(null);
  const [marked,setMarked] =useState([]);
  const today=new Date().toLocaleDateString();

  const dispatch=useDispatch();

  // Example students database for simplicity
  const [studentsData,setStudentsData] = useState([]);

  const { college, department }=useSelector((state)=>state.user?.user);

  
    const { data: allCourses } = useCourses();

  // Fetch students based on course details
  const onSubmit = async(data) => {
    console.log(data);
    
    const reqData={
      college,
      department,
      role: "Student",
      course: data?.course,
    };

    const studentsList=await userService.getUsers(reqData);// fetching students
    setStudentsData(studentsList);
    reset();
  };
  console.log(courseDetails);
  

  const handleAttendanceChange = (id) => {
    setMarked((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const submitAttendance= async ()=>{
    console.log(marked);
    console.log(courseDetails);
    
    try {
      const response =await attendanceService.markAttendance({courseId:courseDetails?._id, presentStudentIds:marked});
      if(response){
        dispatch(setSuccess(response));
      }
      else{
        dispatch(setError("Try Again!"));
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.message));
    }
  }

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Attendance</h1>

      {/* Course Input Form */}
      
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 shadow rounded mb-6 max-w-md mx-auto"
        >
          <div className="mb-4">
            <label className="block font-medium mb-1">Course:</label>
            <select
              {...register("course", { required: "Course is required" })}
              className="w-full px-3 py-2 border rounded"
              onChange={(e) => {
                const selectedCourse = allCourses.find(
                  (item) => item._id === e.target.value
                );
                setCourseDetails(selectedCourse);
              }}
            >
              <option value="">Select a course</option>
              {/* array of courses  of faculty */}
              {allCourses && allCourses?.length>0 && allCourses.map((item)=> 
              <option  key={item?._id || item?.name || item?.email} value={item?._id}>{item?.name}</option>)}
            </select>
          </div>
          {/* <div className="mb-4">
            <label className="block font-medium mb-1">Semester</label>
            <select
              {...register("semester", { required: "Semester is required" })}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select semester</option>
              <option value="Sem1">Semester 1</option>
              <option value="Sem2">Semester 2</option>
            </select>
          </div> */}
          {/* <div className="mb-4">
            <label className="block font-medium mb-1">Date</label>
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className="w-full px-3 py-2 border rounded"
            />
          </div> */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded"
          >
            Load Students
          </button>
        </form>

      {/* Attendance Marking */}
      {studentsData.length>0 && (
        <div className="bg-white p-6 shadow rounded">
            <div>
                <h2 className="text-xl font-bold mb-4">Course: {courseDetails?.name}</h2>
                <div className="grid grid-cols-2 space-x-2">
                    {/* <h3 className="text-lg mb-4">Semester: {courseDetails.semester}</h3> */}
                    <h4 className="text-md mb-6">Date: {today}</h4>
                </div>
            </div>

          {studentsData.length > 0 ? 
            <div>
              {studentsData.map((student) => (
              <div
                key={student._id}
                className="grid grid-cols-2 space-x-2 mb-4"
              >
                <p className="font-medium">{student?.name || student?.email?.split('@')[0]}</p>
                <div className="space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={marked?.includes(student?._id)}
                      onChange={() => handleAttendanceChange(student._id)}
                    />
                    <span className={`${marked?.includes(student?._id) ? "bg-green-500":""}`}>Present</span>
                  </label>
                </div>
              </div>))}
              <button
                type="button"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded"
                onClick={submitAttendance}
              >
                Marked!
              </button>
              </div> : (
            <p>No students found for this course and semester.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;
