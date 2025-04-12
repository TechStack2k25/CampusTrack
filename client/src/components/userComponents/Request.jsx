import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { setSuccess, setError } from "../../store/slices/userSlice";
import { userService } from "../../api/userService";
import { collegeService } from "../../api/collegeService";
import { useDepartments } from "../../data/departments";
import { useAllCourses } from "../../data/allcourses";
import { courseService } from "../../api/courseService";
import { degreeService } from "../../api/degreeService";

const Request = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: { requestType: "Add user" }
  });

  const user = useSelector((state) => state.user.user);
  const watchRole = watch('role');
  const watchCollege = watch('college');
  const [debouncedCollege, setDebouncedCollege] = useState(watchCollege);
  const [degrees, setDegrees] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (watchCollege?.trim()?.length < 4) return;
    const handler = setTimeout(() => setDebouncedCollege(watchCollege?.trim()), 500);
    return () => clearTimeout(handler);
  }, [watchCollege]);

  const mutation = useMutation({
    mutationFn: ["Student", "faculty"].includes(user?.role)
      ? courseService.requestCourse
      : userService.updateUser,
    onSuccess: (data) => {
      dispatch(setSuccess("Sent Request!"));
      reset();
    },
    onError: (error) => {
      dispatch(setError(error?.response?.data?.message));
      // console.error("Error creating request:", error);
    },
  });

  const { data: departments } = useDepartments(debouncedCollege);
  const { data: allCourses } = useAllCourses({ _id: user?.department });

  const fetchDegrees = async () => {
    try {
      const res = await degreeService.getAll({ _id: departments[0]?.college });
      if (res) setDegrees(res);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (departments?.length > 0) fetchDegrees();
  }, [departments]);

  const onSubmit = (newData) => {
    if (watchRole === user?.role) return;
    mutation.mutate({
      ...user,
      role: newData?.role,
      college: newData?.college || user?.college,
      department: newData?.department || user?.department,
      requestType: newData?.requestType,
      dep_id: newData?.dep_id,
      course_id: newData?.course_id,
      degree: newData?.degree_id,
    });
  };

  return (
    <div className="flex items-center justify-center flex-1 p-6">
      <div className="bg-white dark:bg-black dark:bg-opacity-20 border dark:border-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6"> Request</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {user?.role === "User" && (
            <>

              <div className="flex flex-col">
                <label htmlFor="college" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  College ID
                </label>
                <input
                  id="college"
                  {...register("college", {
                    required: watchRole === "User" && "College Id is required!",
                  })}
                  type="text"
                  className={`transition duration-200 mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.college ? "border-red-500" : "border-gray-300"
                  } focus:ring-blue-600 dark:focus:ring-blue-900`}
                />
                {errors.college && <p className="text-xs text-red-500 mt-1">{errors.college.message}</p>}
              </div>

              <div className="flex flex-col">
                <label htmlFor="dep_id" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Department
                </label>
                <select
                  id="dep_id"
                  {...register("dep_id", {
                    required: watchRole === "User" && "Department selection is required!",
                  })}
                  className={`transition duration-200 cursor-pointer mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.dep_id ? "border-red-500" : "border-gray-300"
                  } focus:ring-blue-500`}
                >
                  <option value="">Select a department...</option>
                  {departments?.map((item) => (
                    <option key={item?._id} value={item?._id}>{item?.name}</option>
                  ))}
                </select>
                {errors.dep_id && <p className="text-xs text-red-500 mt-1">{errors.dep_id.message}</p>}
              </div>

              <div className="flex flex-col">
                <label htmlFor="role" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Select Role
                </label>
                <select
                  id="role"
                  {...register("role", { required: "Role selection is required!" })}
                  className={`transition duration-200 cursor-pointer mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.role ? "border-red-500" : "border-gray-300"
                  } focus:ring-blue-500`}
                >
                  <option value={user?.role}>Select a role...</option>
                  {user?.role === "User" && (
                    <>
                      <option value="Student">Student</option>
                      <option value="faculty">Faculty</option>
                    </>
                  )}
                  {user?.role === "faculty" && <option value="HOD">HOD</option>}
                </select>
                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
              </div>
            </>
          )}
          {["Student", "faculty"].includes(user?.role) && (
            <div className="flex flex-col">
              <label htmlFor="course_id" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Course
              </label>
              <select
                id="course_id"
                {...register("course_id", {
                  required: "Course selection is required!",
                })}
                className={`transition duration-200 cursor-pointer mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.course_id ? "border-red-500" : "border-gray-300"
                } focus:ring-blue-500 text-black`}
              >
                <option value="">Select a course...</option>
                {allCourses?.map((course) => (
                  <option key={course?._id} value={course?._id}>
                    {course?.name} ({course?.coursecode?.toUpperCase()})
                  </option>
                ))}
              </select>
              {errors.course_id && <p className="text-xs text-red-500 mt-1">{errors.course_id.message}</p>}
            </div>
          )}

          {user?.role === "User" && watchRole === "Student" && (
            <div className="flex flex-col">
              <label htmlFor="degree_id" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Degree
              </label>
              <select
                id="degree_id"
                {...register("degree_id", {
                  required: "Degree selection is required!",
                })}
                className={`transition duration-200 cursor-pointer mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.degree_id ? "border-red-500" : "border-gray-300"
                } focus:ring-blue-500`}
              >
                <option value="">Select a degree...</option>
                {degrees?.map((item) => (
                  <option key={item?._id} value={item?._id}>{item?.name}</option>
                ))}
              </select>
              {errors.degree_id && <p className="text-xs text-red-500 mt-1">{errors.degree_id.message}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.isLoading}
            className={`w-full font-semibold py-3 rounded-lg transition duration-300 ${
              mutation.isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {mutation.isLoading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Request;
