import React, { useEffect, useState } from 'react'
import { Sidebar } from '../components'
import { Outlet } from 'react-router-dom'
import { facultyMenu } from '../data/scholarMenu.js'
import { useSelector } from 'react-redux';

function DashboardFaculty() {
  const [menu,setMenu]=useState(facultyMenu);
  const userRole=useSelector((state)=>state.user.user?.role)
  useEffect(()=>{ 
    if(userRole==="faculty"){
      setMenu(facultyMenu.filter((item)=>item.roles.includes(userRole)));
    }
    else if(userRole==="HOD"){
      setMenu(facultyMenu.filter((item)=>item.roles.includes(userRole)));
    }
  },[userRole,facultyMenu]);
  return (
    <div className="relative flex flex-1 min-h-screen">
        <Sidebar menuItems={menu} />
        <Outlet />
    </div>
  )
}

export default DashboardFaculty