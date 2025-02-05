import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { taskService } from "../../api/taskService";
import { setError, setSuccess } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCourses } from "../../data/courses.js";
import { useAssignments } from "../../data/assignments.js";
import AssignmentCard from "../Utils/AssignmentCard.jsx";

const AssignmentsFaculty = () => {
  const dispatch=useDispatch();
  const { register, handleSubmit, reset, formState:{ errors } } = useForm();
  const queryClient= useQueryClient();
  
    const { data: allCourses } = useCourses();

    const { data: coursesHavingAssignments } = useAssignments();

  // Defined mutation using useMutation hook
  const mutationTocreateAssignment = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: (data) => {
      console.log('Assignment created successfully:', data);
      dispatch(setSuccess('Assignment created successfully!'));
      //invalidate allcourses queries to refetch data
      queryClient.invalidateQueries(['allcourses']); 
    },
    onError: (error) => {
      dispatch(setError(error?.response?.data?.message))
      console.error('Error creating course:', error);
    }
  });

  // Function to add a new assignment
  const addAssignment = (data) => {
    mutationTocreateAssignment.mutate(data);
    reset(); // Reset the form fields
  };


  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl text-center font-bold mb-4">Assignments</h1>

      {/* Assignment Form */}
      <form
        onSubmit={handleSubmit(addAssignment)}
        className="bg-white p-4 shadow rounded mb-4"
      >
        <div className="mb-2">
          <label className="block font-medium mb-1">Title:</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors?.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="block font-medium mb-1">Deadline</label>
          <input
            type="date"
            {...register("deadline", { required: "Deadline is required!" })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors?.deadline && (
            <p className="text-red-500 text-sm">{errors.deadline.message}</p>
          )}
        </div>

        <div className="flex flex-col">
              <label htmlFor="course" className="text-sm font-medium text-gray-600">
                Course:
              </label>
              <select
                id="course"
                {...register("id", { required: "Course selection is required!"})}
                className={`cursor-pointer mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.course_id ? "border-red-500" : "border-gray-300"} focus:ring-blue-500`}
              >
                <option value="">Select a Course...</option>
                {allCourses && allCourses?.map((course)=><option key={course?._id} value={course?._id}>{`${course?.name} (${course?.coursecode?.toUpperCase()})`}</option>)}
                
              </select>
              {errors.id && (
                <p className="text-xs text-red-500 mt-1">{errors.id.message}</p>
              )}
            </div>
        
        <div className="mb-2">
          <label className="block font-medium mb-1">Sem:</label>
          <input
            type="number"
            {...register("sem")}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description:</label>
          <textarea
            {...register("description")}
            className="w-full px-3 py-2 border rounded"
            placeholder="Write your notification..."
          ></textarea>
        </div>

        <div className="mb-2">
          <label className="block font-medium mb-1">Reward Points:</label>
          <input
            type="number"
            {...register("reward_point",{required:"Rewards required!"})}
            className="w-full px-3 py-2 border rounded"
          />
          {errors?.reward_point && (
            <p className="text-red-500 text-sm">{errors.reward_point.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="mx-auto block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Assignment
        </button>
      </form>

      {/* Assignment List */}
        {coursesHavingAssignments && coursesHavingAssignments?.length>0 && coursesHavingAssignments[0]?.task.length>0 && 
      <h1 className="text-2xl font-bold text-center mb-6">All Assignments</h1>}
      <div className="grid gap-2 grid-cols-2">
        {coursesHavingAssignments && coursesHavingAssignments?.length>0 && coursesHavingAssignments.map((course) => (
          // <div
          //   key={assignment._id}
          //   className="bg-white p-4 shadow rounded mb-2 flex justify-between items-center"
          // >
          //   <p>
          //     <strong>{assignment.title}</strong> - Due by {assignment.deadline} 
          //     <br />
          //     <span className="text-sm">Course: {assignment.course}, Semester: {assignment.semester}</span>
          //   </p>
          //   <button
          //     onClick={() => removeAssignment(assignment._id)}
          //     className="bg-red-500 text-white px-4 py-2 rounded"
          //   >
          //     Remove
          //   </button>
          // </div>
          course && course?.task &&  course?.task?.map((assignment)=><AssignmentCard key={assignment._id} assignment={{...assignment,coursename:course?.name}}/>)
        ))}
      </div>
    </div>
  );
};

export default AssignmentsFaculty;
