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
import ConfirmModal from '../Utils/ConfirmModal';

const Attendance = () => {
  const { register, handleSubmit, reset } = useForm();
  const [courseDetails, setCourseDetails] = useState(null);
  const [marked, setMarked] = useState([]);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [removeStudents, setRemoveStudents] = useState(false);

  const dispatch = useDispatch();

  // Example students database for simplicity
  const [studentsData, setStudentsData] = useState([]);

  const { college, department } = useSelector((state) => state.user?.user);

  const { data: allCourses } = useCourses();

  // Fetch students based on course details
  const onSubmit = async (data) => {
    // console.log(data);
    try {
      setStudentsData([]);
      setLoading(true);

      const reqData = {
        college,
        department,
        role: 'Student',
        course: data?.course,
      };

      const studentsList = await userService.getUsers(reqData); // fetching students
      setStudentsData(studentsList);
    } catch (error) {
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // console.log(courseDetails);

  const handleAttendanceChange = (id) => {
    setMarked((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const submitAttendance = async () => {
    // console.log(marked);
    // console.log(courseDetails);

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
      dispatch(setError(error?.response?.data?.message));
    } finally {
      setMarking(false);
    }
  };

  const removeStudent = async (student, message) => {
    try {
      // console.log({ ...student, message: 'Individual' });

      const res = await courseService.removeStudent_s({
        _id: courseDetails._id,
        student_id: student._id,
        message,
      });
      if (res) {
        onSubmit(courseDetails);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className='flex-1 p-6 min-h-screen'>
      <h1 className='text-2xl font-bold text-center mb-6 dark:text-white'>
        Attendance
      </h1>

      {/* Course Input Form */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white dark:bg-gray-900 border dark:border-gray-700 p-6 shadow rounded mb-6 max-w-md mx-auto'
      >
        <div className='mb-4'>
          <label className='block font-medium mb-1 dark:text-gray-400 tracking-tight'>
            Course:
          </label>
          <select
            {...register('course', { required: 'Course is required' })}
            className='w-full px-3 py-2 border rounded dark:bg-gray-200 dark:text-gray-700'
            onChange={(e) => {
              const selectedCourse = allCourses.find(
                (item) => item._id === e.target.value
              );
              setCourseDetails(selectedCourse);
            }}
          >
            <option value=''>Select a course</option>
            {/* array of courses  of faculty */}
            {allCourses &&
              allCourses?.length > 0 &&
              allCourses.map((item) => (
                <option
                  key={item?._id || item?.name || item?.email}
                  value={item?._id}
                >
                  {item?.name}
                </option>
              ))}
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
          type='submit'
          className='w-full flex justify-center bg-blue-500 hover:bg-blue-700 transition text-white px-4 py-2 rounded'
        >
          {loading ? (
            <span className='animate-spin '>
              <FaSpinner />
            </span>
          ) : (
            'Load Students'
          )}
        </button>
      </form>

      {/* Attendance Marking */}
      {studentsData.length > 0 && (
        <div className='bg-white dark:bg-gray-900 dark:border-gray-800 border p-6 shadow rounded'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-bold dark:text-gray-400'>
              Course: {courseDetails?.name}
            </h2>

            <div className='flex items-center gap-4'>
              <h4 className='text-md font-semibold dark:text-gray-400'>
                Total Classes: {courseDetails?.total_classes}
              </h4>
              <button
                // your handler function
                className='text-red-500 hover:text-red-700 transition relative group'
                title='Remove all students'
                onClick={() => setRemoveStudents(true)}
              >
                <FaUserMinus className='w-5 h-5' />
              </button>
            </div>
          </div>

          {studentsData.length > 0 ? (
            <div>
              {studentsData.map((student) => {
                const attendanceRate = student?.attendance
                  ? Math.round(
                      (student?.attendance / courseDetails?.total_classes) * 100
                    )
                  : 0;
                return (
                  <div
                    key={student._id}
                    className='grid grid-cols-4 space-x-2 mb-4'
                  >
                    <p className='font-medium dark:text-white'>
                      {student?.name || student?.email?.split('@')[0]}
                    </p>
                    <div className='flex items-center space-x-4'>
                      <label className='flex items-center cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={marked?.includes(student?._id)}
                          onChange={() => handleAttendanceChange(student._id)}
                          className='hidden'
                        />
                        <div
                          className={`w-6 h-6 flex items-center justify-center border-2 rounded-lg transition-all 
        ${
          marked?.includes(student?._id)
            ? 'bg-green-500 border-green-600'
            : 'bg-gray-200 border-gray-400'
        } 
        hover:bg-green-400 hover:border-green-500 active:scale-95`}
                        >
                          {marked?.includes(student?._id) && (
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
                          className={`hidden sm:block ml-2 px-3 py-1 text-sm font-medium rounded-md transition-all 
                      ${
                        marked?.includes(student?._id)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      } 
                      hover:bg-green-400 hover:text-white`}
                        >
                          Present
                        </span>
                      </label>
                    </div>
                    <p
                      className={`font-medium flex items-center justify-center gap-2  ${
                        attendanceRate >= 75
                          ? 'text-green-500 font-semibold'
                          : 'text-red-500 font-bold'
                      }`}
                    >
                      <span className='truncate'> Attended:</span>{' '}
                      {student?.attendance || 0}
                    </p>
                    <button
                      className='text-red-600 flex items-center justify-center hover:text-red-800 transition'
                      title='Remove student'
                      onClick={() => removeStudent(student, 'Individual')}
                    >
                      <FaTrash className='w-5 h-5' />
                    </button>
                  </div>
                );
              })}
              <button
                type='button'
                className='w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
                onClick={!marking && submitAttendance}
              >
                {marking ? 'Marking' : 'Marked Attendance!'}
              </button>
            </div>
          ) : (
            <p>No students found for this course and semester.</p>
          )}
        </div>
      )}
      {removeStudents && (
        <ConfirmModal
          heading={'Are you sure?'}
          cancelText={'Cancel'}
          doneText={'Confirm'}
          text={'Want to remove all students?'}
          done={() => removeStudent({ _id: 1 }, 'All')}
          cancel={() => setRemoveStudents(false)}
          danger={true}
        />
      )}
    </div>
  );
};

export default Attendance;
