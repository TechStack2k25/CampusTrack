import React from 'react'

function ListElement({unseenCount=0, user, setUser}) {
  return (
    <li onClick={()=>setUser({...user, unseen:unseenCount})} className="cursor-pointer p-2 border-b last:border-none hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
        
        <span className="font-medium">{user.name}</span>
           { unseenCount>0 && <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center bg-blue-500 text-white`}>
                {unseenCount}
            </span>}
    </li>
  )
}

export default ListElement