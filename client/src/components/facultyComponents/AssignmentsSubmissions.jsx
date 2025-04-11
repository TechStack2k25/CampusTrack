import React, { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { useCourses } from '../../data/courses.js';
import { useCoursesAssignments } from '../../data/courseAssignments.js';

const AssignmentsSubmission = () => {
  const [course, setCourse] = useState('');
  const { data: courses } = useCourses();
  const { data: coursesAssignments } = useCoursesAssignments(course);
  const assignments = coursesAssignments?.alltasks;

  return (
    <div className='flex-1 p-6 min-h-screen'>
      <h1 className='text-2xl text-center font-bold mb-8 dark:text-white'>
        📚 Assignment Submissions
      </h1>

      {/* Course Selection */}
      <div className='bg-white dark:bg-gray-900 border dark:border-gray-700 p-6 shadow rounded mb-8 max-w-md mx-auto'>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          Select Course:
        </label>
        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-200 dark:text-gray-700'
        >
          <option value=''>-- Choose a Course --</option>
          {courses?.map((item) => (
            <option key={item?._id} value={item?._id}>
              {item?.name}
            </option>
          ))}
        </select>
      </div>

      {/* Assignment List */}
      {assignments && assignments.length > 0 ? (
        <div className='space-y-6'>
          {assignments.map((data) => {
            const assignment = data?.task;
            const students = data?.task_users?.filter(Boolean) || [];

            return (
              <div
                key={assignment?._id}
                className='bg-white dark:bg-gray-900 border dark:border-gray-800 p-6 shadow rounded-lg'
              >
                <div className='mb-4'>
                  <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
                    📝 {assignment?.title}
                  </h2>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    <span className='font-medium'>Deadline:</span>{' '}
                    {new Date(assignment?.deadline).toLocaleDateString()}
                  </p>
                </div>

                <hr className='border-gray-300 dark:border-gray-700 mb-4' />

                {students.length > 0 ? (
                  <div className='space-y-4'>
                    {students.map((student) => (
                      <div
                        key={student?._id + assignment?._id}
                        className='flex flex-col sm:flex-row sm:items-center sm:justify-between border dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-black/20'
                      >
                        <p className='font-semibold text-gray-800 dark:text-gray-200'>
                          {student?.name || student?.email?.split('@')[0]}
                        </p>

                        {student?.file && (
                          <a
                            href={student.file}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='mt-2 sm:mt-0 flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition'
                          >
                            <FaFilePdf className='text-red-500' />
                            View
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-center text-gray-600 dark:text-gray-400 font-medium'>
                    No submissions yet!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : course ? (
        <p className='text-center mt-8 text-gray-600 dark:text-gray-400 font-medium'>
          No assignments found for this course.
        </p>
      ) : null}
    </div>
  );
};

export default AssignmentsSubmission;
