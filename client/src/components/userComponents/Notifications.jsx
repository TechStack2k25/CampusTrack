import React, { useEffect } from 'react'
import { useState } from "react";
import { FiBell, FiX } from "react-icons/fi";
import { ChatBox, UserList } from '../Utils';
import { socketService } from '../../api/socketService';
import { userService } from '../../api/userService';
import { messageService } from '../../api/messageService';

function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentUser,setCurrentUser]=useState(null);
    const [data,setData]=useState(null);
    const [sendersData,setSendersData]=useState({});
    
    
  const handleNewMessage=(data)=>{
    console.log(data);
  }

  const fetchData=async()=>{
    try {
      const res=await userService.currentUserData();
      console.log(res);
      setData({users:[res?.college,res?.department],courses:res?.course});
      const senders=await messageService.getAllSenders();
      console.log(senders);
      if(senders){
        setSendersData(senders?.reduce(
          (acc, { key, value }) => {
            // If the value is a number, add it to the sum
              acc.sum += (value || 0);
            // Add the key-value pair to the object
            acc.obj[key] = value;
            return acc;
          },
          { data: {}, unseen: 0 } // Initial accumulator with object and sum
        ));
      }
      
    } catch (error) {
      console.error(error);
      
    }
  }
  
  useEffect(()=>{
    socketService.onGetDashboard(handleNewMessage);
    fetchData();
    return () => {
      socketService.socket.off('getdashboard', handleNewMessage);
    };
  },[]);


    return (
      <div>
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
          >
            <FiBell className="w-6 h-6 text-gray-600 dark:text-white" />
          </button>
        ) :
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            { currentUser ?
              <ChatBox user={currentUser} setUser={setCurrentUser} />
          :
          <div className="w-80 h-96 bg-white dark:bg-gray-800 border shadow-lg p-4 flex flex-col rounded-lg">
            <div className="flex justify-between rounded items-center border-b pb-2">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <button onClick={() => setIsOpen(false)} className="p-2">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <UserList unseenData={sendersData?.data} userData={data} setCurrentUser={setCurrentUser} />
          </div>}
          </div>
        }
      </div>
    );
}

export default Notifications
