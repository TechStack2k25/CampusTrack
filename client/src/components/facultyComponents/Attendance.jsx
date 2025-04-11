import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCourses } from '../../data/courses';
import { useDispatch, useSelector } from 'react-redux';
import { userService } from '../../api/userService';
import { attendanceService } from '../../api/attendanceService';
import { setError, setSuccess } from '../../store/slices/userSlice';
import { useQueryClient } from '@tanstack/react-query';
import { FaSpinner, FaTrash, FaUserMinus } from 'react-icons/fa';
import { courseService } from '../../api/courseService';
import { ConfirmModal } from '../Utils';

const Attendance = () => {
  const { register, handleSubmit, reset } = useForm();
  const [courseDetails, setCourseDetails] = useState(null);
  const [marked, setMarked] = useState([]);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [removeStudents, setRemoveStudents] = useState(false);
  const [studentsData, setStudentsData] = useState([]);

  const dispatch = useDispatch();
  const { college, department } = useSelector((state) => state.user?.user);
  const { data: allCourses } = useCourses();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setStudentsData([]);
      const selectedCourse = allCourses.find(
        (item) => item._id === data.course
      );
      setCourseDetails(selectedCourse);

      const reqData = {
        college,
        department,
        role: 'Student',
        course: data?.course,
      };

      const studentsList = await userService.getUsers(reqData);
      setStudentsData(studentsList);

      // Auto-scroll to list
      setTimeout(() => {
        document
          .getElementById('student-list')
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (error) {
      dispatch(setError('Failed to load students.'));
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (id) => {
    setMarked((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const submitAttendance = async () => {
    if (marked.length === 0) {
      dispatch(setError('No students selected!'));
      return;
    }

    try {
      setMarking(true);
      const response = await attendanceService.markAttendance({
        courseId: courseDetails?._id,
        presentStudentIds: marked,
      });

      if (response) {
        dispatch(setSuccess('Attendance Marked!'));
        setMarked([]);
        setStudentsData([]);
        queryClient.invalidateQueries(['allcourses']);
        reset();
        setCourseDetails(null);
      } else {
        dispatch(setError('Try Again!'));
      }
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || 'Error marking attendance'));
    } finally {
      setMarking(false);
    }
  };

  const removeStudent = async (student, message) => {
    try {
      const res = await courseService.removeStudent_s({
        _id: courseDetails._id,
        student_id: student._id,
        message,
      });
      if (res) {
        onSubmit({ course: courseDetails._id });
      }
    } catch (error) {
      dispatch(setError('Failed to remove student.'));
    }
  };

  return (
    <div className='flex-1 p-6 min-h-screen'>
      <h1 className='text-2xl font-bold text-center mb-6 dark:text-white'>
        Attendance
      </h1>

      {/* Course Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white dark:bg-gray-900 border dark:border-gray-700 p-6 shadow rounded mb-6 max-w-md mx-auto'
      >
        <div className='mb-4'>
          <label className='block font-medium mb-1 dark:text-gray-400'>
            Course:
          </label>
          <select
            {...register('course', { required: 'Course is required' })}
            className='w-full px-3 py-2 border rounded dark:bg-gray-200 dark:text-gray-700'
          >
            <option value=''>Select a course</option>
            {allCourses?.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type='submit'
          className='w-full flex justify-center bg-blue-500 hover:bg-blue-700 transition text-white px-4 py-2 rounded'
        >
          {loading ? (
            <span className='animate-spin'>
              <FaSpinner />
            </span>
          ) : (
            'Load Students'
          )}
        </button>
      </form>

      {/* Attendance Section */}
      {studentsData.length > 0 && (
        <div
          id='student-list'
          className='bg-white dark:bg-gray-900 dark:border-gray-800 border p-6 shadow rounded'
        >
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-bold dark:text-gray-400'>
              Course: {courseDetails?.name}
            </h2>

            <div className='flex items-center gap-4'>
              <h4 className='text-md font-semibold dark:text-gray-400'>
                Total Classes: {courseDetails?.total_classes}
              </h4>
              <button
                onClick={() => setRemoveStudents(true)}
                className='text-red-500 hover:text-red-700 transition'
                title='Remove all students'
              >
                <FaUserMinus className='w-5 h-5' />
              </button>
            </div>
          </div>

          <p className='text-sm mb-4 dark:text-gray-300'>
            Students marked present:{' '}
            <span className='font-semibold'>{marked.length}</span>
          </p>

          {studentsData.map((student) => {
            const attendanceRate = student?.attendance
              ? Math.round(
                  (student.attendance / courseDetails.total_classes) * 100
                )
              : 0;

                return (
                  <div
                    key={student._id}
                    className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-md border dark:border-gray-700 mb-4 bg-gray-100 dark:bg-black dark:bg-opacity-10'
                  >
                    {/* Student Name */}
                    <p className='text-sm sm:text-base font-medium dark:text-white truncate'>
                      {student?.name || student?.email?.split('@')[0]}
                    </p>
                  
                    {/* Present Checkbox */}
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        disabled={marking}
                        checked={marked.includes(student._id)}
                        onChange={() => handleAttendanceChange(student._id)}
                        className='hidden'
                      />
                      <div
                        className={`w-6 h-6 flex items-center justify-center border-2 rounded transition-all ${
                          marked.includes(student._id)
                            ? 'bg-green-500 border-green-600'
                            : 'bg-white border-gray-400 dark:bg-gray-800'
                        }`}
                      >
                        {marked.includes(student._id) && (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='w-4 h-4 text-white'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path
                              fillRule='evenodd'
                              d='M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-md ${
                          marked.includes(student._id)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-800'
                        }`}
                      >
                        Present
                      </span>
                    </label>
                  
                    {/* Attendance Count */}
                    <p
                      className={`text-xs sm:text-sm font-medium ${
                        attendanceRate >= 75 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      Attended: {student?.attendance || 0}
                    </p>
                  
                    {/* Remove Button */}
                    <button
                      onClick={() => removeStudent(student, 'Individual')}
                      className='text-red-600 hover:text-red-800 transition'
                      title='Remove student'
                    >
                      <FaTrash className='w-4 h-4 sm:w-5 sm:h-5' />
                    </button>
                  </div>
                  )
          })}

          <button
            type='button'
            className={`w-full flex justify-center bg-blue-500 text-white px-4 py-2 rounded transition ${
              marking ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            onClick={!marking && submitAttendance}
            disabled={marking}
          >
            {marking ? (
              <>
                <FaSpinner className='animate-spin mr-2' /> Marking...
              </>
            ) : (
              'Mark Attendance'
            )}
          </button>
        </div>
      )}

      {removeStudents && (
        <ConfirmModal
          heading='Are you sure?'
          text='Want to remove all students?'
          doneText='Confirm'
          cancelText='Cancel'
          danger
          done={() => removeStudent({ _id: 1 }, 'All')}
          cancel={() => setRemoveStudents(false)}
        />
      )}
    </div>
  );
};

export default Attendance;
