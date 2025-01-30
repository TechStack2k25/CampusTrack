import React from 'react'
import { AssignmentCard } from '../Utils/index.js';
import { assignments } from '../../data/assignments.js'

function Assignments() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">My Assignments</h1>
      <div className='sm:grid sm:grid-cols-2'>
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))
        ) : (
          <p className="text-gray-600">No assignments to display.</p>
        )}
      </div>
    </div>
  );
}

export default Assignments