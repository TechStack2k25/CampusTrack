import React from 'react'
import { Sidebar } from '../components'
import { Outlet } from 'react-router-dom'
import { scholarMenu } from '../data/scholarMenu.js'

function Dashboard() {
  return (
    <div className="relative flex flex-1 min-h-screen bg-gray-100">
        <Sidebar menuItems={scholarMenu} />
        <Outlet />
    </div>
  )
}

export default Dashboard