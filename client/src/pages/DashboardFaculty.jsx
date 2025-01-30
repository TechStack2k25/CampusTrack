import React from 'react'
import { Sidebar } from '../components'
import { Outlet } from 'react-router-dom'
import { facultyMenu } from '../data/scholarMenu.js'

function DashboardFaculty() {
  return (
    <div className="relative flex flex-1 min-h-screen bg-gray-100">
        <Sidebar menuItems={facultyMenu} />
        <Outlet />
    </div>
  )
}

export default DashboardFaculty