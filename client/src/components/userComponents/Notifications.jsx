import React, { useEffect } from 'react'
import { useState } from "react";
import { FiBell, FiX } from "react-icons/fi";
import { ChatBox, UserList } from '../Utils';
import { socketService } from '../../api/socketService';
import { userService } from '../../api/userService';
import { messageService } from '../../api/messageService';
import { useSelector } from 'react-redux';

function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState(null);
  const [sendersData, setSendersData] = useState({});
  const user = useSelector((state) => state.user.user);


  const handleNewMessage = (data) => {
    console.log(data);
    if (data) {
      setSendersData(data?.reduce(
        (acc, obj) => {
          // If the value is a number, add it to the sum
          acc.unseen += (obj?.unseen || 0);
          // Add the key-value pair to the object
          acc.data[obj?._id] = obj.unseen;
          return acc;
        },
        { data: {}, unseen: 0 } // Initial accumulator with object and sum
      ));
    }
  }

  const canSend = () => {
    return (user?.role === 'HOD' && currentUser?._id === user?.department)
      ||
      (user?.role === 'Admin' && currentUser?._id === user?.college)
      ||
      (user?.role === 'faculty' && currentUser?.teacher === user?._id);
  }

  const fetchData = async () => {
    try {
      const res = await userService.currentUserData();
      console.log(res);
      setData({ users: [res?.college, res?.department], courses: res?.course });
      const senders = await messageService.getAllSenders();
      console.log(senders);
      if (senders) {
        setSendersData(senders?.reduce(
          (acc, obj) => {
            // If the value is a number, add it to the sum
            acc.unseen += (obj?.unseen || 0);
            // Add the key-value pair to the object
            acc.data[obj?._id] = obj.unseen;
            return acc;
          },
          { data: {}, unseen: 0 } // Initial accumulator with object and sum
        ));
      }

    } catch (error) {
      console.error(error);

    }
  }

  console.log(sendersData);


  useEffect(() => {
    socketService.onGetDashboard(handleNewMessage);
    fetchData();
    return () => {
      if (socketService?.socket) {
        socketService.socket.off('getdashboard', handleNewMessage);
      }
    };
  }, []);


  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
        >
          <FiBell className="w-6 h-6 text-gray-600 dark:text-white" />
          {sendersData?.unseen>0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800">
            {sendersData?.unseen}
          </span>}
        </button>
      ) :
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
          {currentUser ?
            <ChatBox user={currentUser} fetchUnseen={fetchData} setUser={setCurrentUser} sendEnable={canSend()} />
            :
            <div className="w-80 h-96 bg-white dark:bg-gray-800 border shadow-lg p-4 flex flex-col rounded-lg">
              <div className="flex justify-between rounded items-center border-b pb-2">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <button onClick={() => setIsOpen(false)} className="p-2">
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <UserList unseenData={sendersData?.data} fetchData={fetchData} userData={data} setCurrentUser={setCurrentUser} />
            </div>}
        </div>
      }
    </div>
  );
}

export default Notifications
