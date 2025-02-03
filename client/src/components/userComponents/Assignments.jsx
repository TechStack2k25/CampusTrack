import React from 'react'
import { AssignmentCard } from '../Utils/index.js';
import { useAssignments } from '../../data/assignments.js'
import { useParams } from 'react-router-dom';

function Assignments() {
  const { courseId } = useParams();
  const { data: assignments } = useAssignments(courseId || "all");
  console.log(assignments);
  

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">All Assignments</h1>
      {assignments && assignments?.task && assignments.task?.length > 0 ? (

        <div className='sm:grid sm:grid-cols-2 gap-2'>
          {assignments.task.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={{...assignment,coursename:assignments?.name}} />
          ))}

        </div>
      ) : (
        <p className="text-center text-gray-600 mt-12 text-lg">No assignments to display.</p>
      )}
    </div>
  );
}

export default Assignments