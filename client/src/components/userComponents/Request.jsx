import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { setSuccess, setError } from "../../store/slices/userSlice"
import { userService } from "../../api/userService";

const Request = () => {
  // Using react-hook-form
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues:{
        requestType:'Add user',
    }
  });
  const user=useSelector((state)=>state.user.user);
  const watchRole=watch("role");
  const dispatch=useDispatch();

  const mutationTocreateRequest = useMutation({
    mutationFn: userService.updateUser,
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


  // Submit handler
  const onSubmit = (newData) => {
    if(watchRole===user?.role){
        return;
    }
    console.log("Form Data: ", newData);
    mutationTocreateRequest.mutate({
        ...user,
        role:newData?.role,
        college: newData?.college || user?.college,
        department: newData?.department || user?.department,
        requestType: newData?.requestType,
    });
  };

  return (
    <div className=" flex items-center justify-center flex-1 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Request Here
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Designation Input */}
          <div className="flex flex-col">
            <label htmlFor="CollegeId" className="text-sm font-medium text-gray-600">
              College Id:
            </label>
            <input
              id="college"
              {...register("college", { required: "College Id is required" })}
              type="text"
              className={`mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.designation ? "border-red-500" : "border-gray-300"} focus:ring-blue-500`}
            />
            {errors.college && (
              <p className="text-xs text-red-500 mt-1">{errors.college.message}</p>
            )}
          </div>
            {/* role */}
          <div className="flex flex-col">
            <label htmlFor="role" className="text-sm font-medium text-gray-600">
              Select Role
            </label>
            <select
              id="role"
              {...register("role", { required: "Role selection is required!" })}
              className={`cursor-pointer mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.role ? "border-red-500" : "border-gray-300"} focus:ring-blue-500`}
            >
              <option value={user?.role}>Select a role...</option>
              {user && user?.role==="User" && <>
              <option value="Student">Student</option>
              <option value="faculty">Faculty</option>
              </>}
              {user && user?.role==="faculty" &&<option value="HOD">HOD</option>}
            </select>
            {errors.role && (
              <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* for HOD  */}
          {user && user?.role==="faculty" && <div className="flex flex-col">
            <label htmlFor="DepartmentId" className="text-sm font-medium text-gray-600">
              Department Id:
            </label>
            <input
              id="department"
              {...register("department", { required:{ 
                value: watchRole==="HOD",
                message:"Department Id is required"
            } })}
              type="text"
              className={`mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.designation ? "border-red-500" : "border-gray-300"} focus:ring-blue-500`}
            />
            {errors.department && (
              <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>
            )}
          </div>}

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
