import React, { useEffect, useState } from 'react'
import { Sidebar } from '../components'
import { Outlet } from 'react-router-dom'
import { scholarMenu } from '../data/scholarMenu.js'
import { useSelector } from 'react-redux'
import { use } from 'react'

function Dashboard() {
  const [menu,setMenu]=useState(scholarMenu);
  const userRole=useSelector((state)=>state.user.user?.role)
  useEffect(()=>{ 
    if(userRole==="User"){
      setMenu(scholarMenu.filter((item)=>item.roles.includes(userRole)));
    }
  },[userRole,scholarMenu]);
  
  return (
    <div className="relative flex flex-1 min-h-scree">
        <Sidebar menuItems={menu} />
        <Outlet />
    </div>
  )
}

export default Dashboard