import React from 'react'
import { courses } from '../../data/courses'
import { CourseCard } from '../Utils/index.js'

function Courses() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 ">Student Courses</h1>
      <div className='sm:grid sm:grid-cols-2'>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default Courses