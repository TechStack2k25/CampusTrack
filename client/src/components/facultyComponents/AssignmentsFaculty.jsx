import React, { useState } from 'react';
import { taskService } from '../../api/taskService';
import { setError, setSuccess } from '../../store/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AssignmentCard from '../Utils/AssignmentCard.jsx';
import AddAssignment from '../Utils/AddAssignments.jsx';
import { useAssignments } from '../../data/assignments.js';
import { useCourses } from '../../data/courses.js';

const AssignmentsFaculty = () => {
  const [filter, setFilter] = useState('upcoming');
  const [openForm, setOpenForm] = useState(false);
  const [course, setCourse] = useState('');

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const currentDate = new Date();

  const { data: courses } = useCourses();
  const { data: coursesHavingAssignments = [] } = useAssignments(course);

  const mutationTocreateAssignment = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: (data) => {
      dispatch(setSuccess('Assignment created successfully!'));
      queryClient.invalidateQueries(['allcourses']);
      setOpenForm(false); // Close form after success
    },
    onError: (error) => {
      dispatch(setError(error?.response?.data?.message));
    },
  });

  const addAssignment = (data) => {
    mutationTocreateAssignment.mutate(data);
  };

  const filteredAssignments = coursesHavingAssignments
    ? coursesHavingAssignments.filter((assignment) => {
        const assignmentDate = new Date(assignment?.deadline);
        return filter === 'upcoming'
          ? assignmentDate >= currentDate
          : assignmentDate < currentDate;
      })
    : [];

  return (
    <div className='flex-1 p-6 min-h-screen'>
      <h1 className='text-2xl dark:text-white text-center font-bold mb-4'>
        Assignments
      </h1>

      {openForm ? (
        <AddAssignment
          addTask={addAssignment}
          openForm={openForm}
          setOpenForm={setOpenForm}
        />
      ) : (
        <div>
          <div
            onClick={() => setOpenForm(true)}
            title='Add Assignment'
            aria-label='Add Assignment'
            className='animate-bounce cursor-pointer fixed bottom-8 right-8 text-white font-bold text-4xl bg-blue-500 hover:bg-indigo-700 transition-all duration-250 h-12 text-center aspect-square rounded-full'
          >
            +
          </div>

          <div className='p-6 shadow-lg rounded mb-6 max-w-md mx-auto border dark:border-gray-700'>
            <label htmlFor='course' className='block font-medium mb-1 dark:text-gray-400'>
              Course:
            </label>
            <select
              className='w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-700 dark:bg-gray-200 dark:text-gray-600'
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value=''>Select a course...</option>
              {courses &&
                courses.map((option) => (
                  <option key={option?._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
            </select>
          </div>

          {!course && (
            <p className='text-center text-gray-500 mb-6'>
              Please select a course to view assignments.
            </p>
          )}

          {coursesHavingAssignments?.length > 0 && (
            <>
              <h1 className='text-2xl font-bold text-center mb-6 dark:text-gray-400 tracking-tight'>
                All Assignments
              </h1>
              <div className='flex justify-center mb-6 space-x-4 flex-wrap'>
                <button
                  className={`px-4 py-2 rounded ${
                    filter === 'upcoming'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => setFilter('upcoming')}
                >
                  Upcoming
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    filter === 'past'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => setFilter('past')}
                >
                  Past
                </button>
              </div>
            </>
          )}

          <div className='grid gap-2 grid-cols-2'>
            {filteredAssignments.map((assignment) => (
              <AssignmentCard key={assignment?._id} assignment={{ ...assignment }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsFaculty;
