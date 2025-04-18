import React, { useState } from 'react';
import { useCourses } from '../../data/courses';
import { CourseCard } from '../Utils/index.js';
import Loading from '../Loading.jsx';
import AddCourse from '../Utils/AddCourse.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { setError, setSuccess } from '../../store/slices/userSlice.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../api/courseService.js';

function Courses() {
  const user = useSelector((state) => state.user.user);
  const [dataToUpdate, setDataToUpdate] = useState(null);
  const dispatch = useDispatch();
  const { data: courses, isLoading } = useCourses(); //may use isLoading and other error status
  const queryClient = useQueryClient();

  // Defined mutation using useMutation hook
  const mutationTocreateCourse = useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: (data) => {
      // console.log('Course created successfully:', data);
      dispatch(setSuccess('Course created successfully!'));
      //invalidate allcourses queries to refetch data
      queryClient.invalidateQueries(['allcourses']);
    },
    onError: (error) => {
      dispatch(setError(error?.response?.data?.message));
      // console.error('Error creating course:', error);
    },
  });

  const mutationToupdateCourse = useMutation({
    mutationFn: courseService.updateCourse,
    onSuccess: (data) => {
      // console.log('Course updated successfully:', data);
      dispatch(setSuccess('Course updated successfully!'));
      //invalidate allcourses queries to refetch data
      queryClient.invalidateQueries(['allcourses']);
    },
    onError: (error) => {
      dispatch(setError(error?.response?.data?.message));
      // console.error('Error updating course:', error);
    },
  });

  const mutationTodeleteCourse = useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: (data) => {
      // console.log('Course deleted successfully:', data);
      dispatch(setSuccess('Course deleted successfully!'));
      //invalidate allcourses queries to refetch data
      queryClient.invalidateQueries(['allcourses']);
    },
    onError: (error) => {
      dispatch(setError(error?.response?.data?.message));
      // console.error('Error creating course:', error);
    },
  });

  const addCourse = async (Course) => {
    Course?._id
      ? mutationToupdateCourse.mutate({
          ...Course,
          coursecode: Course?.coursecode?.toLowerCase(),
          id: user?.department,
        })
      : mutationTocreateCourse.mutate({
          ...Course,
          coursecode: Course?.coursecode?.toLowerCase(),
          id: user?.department,
        });
    setDataToUpdate(null);
  };

  const deleteCourse = async (id) => {
    mutationTodeleteCourse.mutate({ id });
  };

  const updateData = (data) => {
    setDataToUpdate(data);
  };

  if (isLoading) {
    return (
      <div className='container'>
        <Loading />
      </div>
    );
  }

  // console.log(courses)
  return (
    <div className='container mx-auto px-4 py-6'>
      {user && user?.role === 'HOD' && dataToUpdate && (
        <AddCourse
          addCourse={addCourse}
          data={dataToUpdate}
          setData={setDataToUpdate}
        />
      )}
      <h1 className='text-2xl font-bold text-center text-gray-800 dark:text-white tracking-tight mb-6'>
        Courses
      </h1>
      {courses && courses?.length > 0 ? (
        <div className='sm:grid sm:grid-cols-2 gap-2'>
          {courses &&
            courses?.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                deletefn={deleteCourse}
                updatefn={updateData}
              />
            ))}
        </div>
      ) : (
        <p className='text-center text-gray-600 mt-12 text-lg'>
          No Courses to show.
        </p>
      )}
      {user && user?.role === 'HOD' && !dataToUpdate && (
        <div
          onClick={() =>
            setDataToUpdate({ credit: 2, name: '', coursecode: '' })
          }
          className='animate-bounce cursor-pointer fixed bottom-8 right-8 text-white  font-bold text-4xl bg-blue-500 hover:bg-blue-700 h-12 text-center aspect-square rounded-xl'
        >
          +
        </div>
      )}
    </div>
  );
}

export default Courses;
