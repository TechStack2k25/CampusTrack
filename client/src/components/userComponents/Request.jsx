import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { setSuccess, setError } from "../../store/slices/userSlice"
import { userService } from "../../api/userService";
import { collegeService } from "../../api/collegeService";
import { useDepartments } from "../../data/departments";
import { useAllCourses } from "../../data/allcourses";
import { courseService } from "../../api/courseService";

const Request = () => {
  // Using react-hook-form
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      requestType: 'Add user',
    }
  });
  const user = useSelector((state) => state.user.user);
  const watchRole = watch("role");
  const watchCollege = watch("college");
  const [debouncedCollege, setDebouncedCollege] = useState(watchCollege);
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCollege(watchCollege);
    }, 500); // Adjust debounce delay (e.g., 500ms)

    return () => clearTimeout(handler); // Cleanup function
  }, [watchCollege]);

  const mutationTocreateRequest = useMutation({
    mutationFn: ["Student","faculty"].includes(user?.role)? courseService.requestCourse : userService.updateUser,
    onSuccess: (data) => {
      console.log('Request created successfully:', data);
      dispatch(setSuccess('Sent Request!'));
      reset(); // Reset the form after submission
    },
    onError: (error) => {
      dispatch(setError(error?.response?.data?.message))
      console.error('Error creating course:', error);
    }
  });

  const { data: departments } = useDepartments(debouncedCollege);
  const { data: allCourses } = useAllCourses({_id:user?.department});



  // Submit handler
  const onSubmit = (newData) => {
    if (watchRole === user?.role) {
      return;
    }
    console.log("Form Data: ", newData);
    mutationTocreateRequest.mutate({
      ...user,
      role: newData?.role,
      college: newData?.college || user?.college,
      department: newData?.department || user?.department,
      requestType: newData?.requestType,
      dep_id: newData?.dep_id,
      course_id:newData?.course_id,
    });
  };

  return (
    <div className=" flex items-center justify-center flex-1 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Request Here
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


          {user && user?.role === "User" &&
            <>
              {/* Designation Input */}
              <div className="flex flex-col">
                <label htmlFor="CollegeId" className="text-sm font-medium text-gray-600">
                  College Id:
                </label>
                <input
                  id="college"
                  {...register("college", {
                    required: {
                      value: watchRole === "User",
                      message: "College Id is required!"
                    }
                  })}
                  type="text"
                  className={`mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.designation ? "border-red-500" : "border-gray-300"} focus:ring-blue-500`}
                />
                {errors.college && (
                  <p className="text-xs text-red-500 mt-1">{errors.college.message}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="department" className="text-sm font-medium text-gray-600">
                  Department:
                </label>
                <select
                  id="dep_id"
                  {...register("dep_id", {
                    required: {
                      value: watchRole === "User",
                      message: "Department selection is required!"
                    }
                  })}
                  className={`cursor-pointer mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.dep_id ? "border-red-500" : "border-gray-300"} focus:ring-blue-500`}
                >
                  <option value="">Select a department...</option>
                  {
                    departments?.length > 0 && departments.map((item) => <option className="cursor-pointer" key={item?._id} value={item?._id}>{item?.name}</option>)
                  }
                </select>
                {errors.dep_id && (
                  <p className="text-xs text-red-500 mt-1">{errors.dep_id.message}</p>
                )}
              </div>

            {/* role */}
            <div className="flex flex-col">
              <label htmlFor="role" className="text-sm font-medium text-gray-600">
                Select Role:
              </label>
              <select
                id="role"
                {...register("role", { required: "Role selection is required!" })}
                className={`cursor-pointer mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.role ? "border-red-500" : "border-gray-300"} focus:ring-blue-500`}
              >
                <option value={user?.role}>Select a role...</option>
                {user && user?.role === "User" && <>
                  <option value="Student" className="cursor-pointer" >Student</option>
                  <option value="faculty" className="cursor-pointer" >Faculty</option>
                </>}
                {user && user?.role === "faculty" && <option value="HOD" className="cursor-pointer" >HOD</option>}
              </select>
              {errors.role && (
                <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
              )}
            </div>
            </>}

            {user && ["Student","faculty"].includes(user?.role) && <div className="flex flex-col">
              <label htmlFor="course" className="text-sm font-medium text-gray-600">
                Course:
              </label>
              <select
                id="course"
                {...register("course_id", { required: {
                  value:["Student","faculty"].includes(user?.role),
                  message:"Course selection is required!" 
                }})}
                className={`cursor-pointer mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.course_id ? "border-red-500" : "border-gray-300"} focus:ring-blue-500`}
              >
                <option value="">Select a Course...</option>
                {allCourses && allCourses?.map((course)=><option key={course?._id} value={course?._id}>{`${course?.name} (${course?.coursecode?.toUpperCase()})`}</option>)}
                
              </select>
              {errors.course_id && (
                <p className="text-xs text-red-500 mt-1">{errors.course_id.message}</p>
              )}
            </div>
              }


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default Request;
