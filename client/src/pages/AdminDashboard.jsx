import React from 'react'
import { Sidebar } from '../components'
import { Outlet } from 'react-router-dom'
import { adminMenu } from '../data/scholarMenu.js'

function AdminDashboard() {
  return (
    <div className="relative flex flex-1 min-h-scree">
        <Sidebar menuItems={adminMenu} />
        <Outlet />
    </div>
  )
}

export default AdminDashboard