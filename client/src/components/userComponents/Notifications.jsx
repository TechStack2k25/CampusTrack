import React, { useEffect, useState } from 'react';
import { FiBell, FiX } from 'react-icons/fi';
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
    if (data) {
      setSendersData(
        data.reduce(
          (acc, obj) => {
            acc.unseen += obj?.unseen || 0;
            acc.data[obj?._id] = obj.unseen;
            return acc;
          },
          { data: {}, unseen: 0 }
        )
      );
    }
  };

  const fetchData = async () => {
    try {
      const res = await userService.currentUserData();
      setData({
        users: [res?.college, res?.department],
        courses: res?.course,
      });

      const senders = await messageService.getAllSenders();
      if (senders) {
        setSendersData(
          senders.reduce(
            (acc, obj) => {
              acc.unseen += obj?.unseen || 0;
              acc.data[obj?._id] = obj.unseen;
              return acc;
            },
            { data: {}, unseen: 0 }
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const canSend = () => {
    return (
      (user?.role === 'HOD' && currentUser?._id === user?.department) ||
      (user?.role === 'Admin' && currentUser?._id === user?.college) ||
      (user?.role === 'faculty' && currentUser?.teacher === user?._id)
    );
  };

  useEffect(() => {
    socketService.onGetDashboard(handleNewMessage);
    fetchData();

    return () => {
      socketService?.socket?.off('getdashboard', handleNewMessage);
    };
  }, []);

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:ring-4 hover:ring-blue-300 dark:hover:ring-blue-800 transition-all duration-300"
        >
          <FiBell className="w-6 h-6" />
          {sendersData?.unseen > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800 animate-pulse">
              {sendersData?.unseen}
            </span>
          )}
        </button>
      ) : (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
          {currentUser ? (
            <ChatBox
              user={currentUser}
              fetchUnseen={fetchData}
              setUser={setCurrentUser}
              sendEnable={canSend()}
            />
          ) : (
            <div className="w-[20rem] sm:w-[22rem] h-[24rem] bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-2xl p-4 flex flex-col rounded-xl transition-all duration-300">
              <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-2 mb-2">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                >
                  <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <UserList
                unseenData={sendersData?.data}
                fetchData={fetchData}
                userData={data}
                setCurrentUser={setCurrentUser}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
