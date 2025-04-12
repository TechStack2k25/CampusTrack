import React from 'react'
import { Link } from 'react-router-dom'

function Logo() {
  return (
    <div>
        <Link
        to={'/dashboard'}
        >
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          CampusTrack
        </h1>
        </Link>
    </div>
  )
}

export default Logo