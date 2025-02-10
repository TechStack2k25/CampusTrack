import React from 'react'
import { AssignmentCard } from '../Utils/index.js';
import { useAssignments } from '../../data/assignments.js'
import { useParams } from 'react-router-dom';

function Assignments() {
  const { courseId } = useParams();
  const { data: courses } = useAssignments(courseId || "all");
  console.log(courses);
  

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">All Assignments</h1>
      {
        courses && courses?.length>0 ?
          courses?.map((course)=>
            course?.task && course.task?.length>0 && course.task.map((assignment)=>
              <AssignmentCard key={assignment?._id} assignment={{...assignment,coursename:course?.name}} />
            )
          )
        :
        <p className="text-center text-gray-600 mt-12 text-lg">No assignments to display.</p>
      }
    </div>
  );
}

export default Assignments