import React, { useState } from 'react'
import { AssignmentCard } from '../Utils/index.js';
import { useAssignments } from '../../data/assignments.js'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setError, setSuccess } from '../../store/slices/userSlice.js';
import { useQueryClient } from '@tanstack/react-query';

function Assignments() {
  const [filter, setFilter] = useState("upcoming");
  const queryClient = useQueryClient();
  const { courseId } = useParams();
  const { data: courses } = useAssignments(courseId || "all");
  console.log(courses);
  const dispatch = useDispatch();

  const currentDate = new Date();

  const handleSubmission = async () => {
    try {
      //api call
      dispatch(setSuccess("Assignment Submitted!"));
      queryClient.invalidateQueries("allassignments");
    } catch (error) {
      dispatch(setError(error?.response?.data?.message));
    }
  }


  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">All Assignments</h1>
      <div className="flex justify-center mb-6 space-x-4 flex-wrap">
        <button
          className={`px-4 py-2 rounded ${filter === "upcoming"
              ? "bg-green-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
            }`}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === "past"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
            }`}
          onClick={() => setFilter("past")}
        >
          Past
        </button>
      </div>
      {
        courses && courses?.length > 0 ?
          courses?.map((course) =>
            course?.task && course.task?.length > 0 && course.task.map((assignment) => {
              const assignmentDate = new Date(assignment?.deadline);
              return (filter === "upcoming"
                ? assignmentDate >= currentDate && <AssignmentCard key={assignment?._id} assignment={{ ...assignment, coursename: course?.name }} onSubmit={handleSubmission} />
                : assignmentDate < currentDate && <AssignmentCard key={assignment?._id} assignment={{ ...assignment, coursename: course?.name }} onSubmit={handleSubmission} />)
            }
            )
          )
          :
          <p className="text-center text-gray-600 mt-12 text-lg">No assignments to display.</p>
      }
    </div>
  );
}

export default Assignments