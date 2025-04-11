import React, { useEffect, useRef, useState } from 'react';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { messageService } from '../../api/messageService';
import { useSelector } from 'react-redux';
import { dateFormat } from '../../utils/dateFormat';
import { socketService } from '../../api/socketService';

export default function ChatBox({
  user,
  setUser,
  fetchUnseen,
  sendEnable = false,
}) {
  const messageRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const me = useSelector((state) => state.user.user._id);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await messageService.getUserMessages({ _id: user?._id });
      if (res) {
        // console.log(res);
        setMessages(res);
        setTimeout(() => {
          scrollToBottom();
        }, 100);
        if (user?.unseen > 0) {
          fetchUnseen();
          setUser((prev) => {
            return { ...prev, unseen: 0 };
          });
        }
      }
    } catch (error) {
      // console.error(error);
    }
  };

  const sendTheMessage = async () => {
    try {
      setIsSending(true);
      const res = await messageService.sendMessage({
        _id: user?._id,
        text: text?.trim(),
      });
      if (res) setText('');
    } catch (error) {
      // console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    if (messageRef && messageRef?.current) {
      messageRef.current.scrollTo({
        top: messageRef.current.scrollHeight,
        behavior: 'smooth', // Enables smooth scrolling
      });
    }
  };

  const handleNewMessage = (message) => {
    // console.log(message);
    setMessages((prev) => [message, ...prev]);
    scrollToBottom();
  };

  useEffect(() => {
    fetchMessages();
    socketService.onMessageReceived(handleNewMessage);
    return () => {
      if (socketService?.socket)
        socketService.socket.off('newMessage', handleNewMessage);
    };
  }, []);
  return (
    <div className='w-80 h-96 border bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col rounded-lg'>
      <div className='flex justify-between items-center border-b pb-2'>
        <h2 className='text-lg font-semibold'>{user?.name || '-'}</h2>
        <button onClick={() => setUser(null)} className='p-2'>
          <FiArrowLeft className='w-6 h-6' />
        </button>
      </div>
      <div
        ref={messageRef}
        className='flex-1 flex flex-col-reverse p-2 overflow-y-auto hide-scrollbar'
      >
        {/* Example messages array */}
        {messages.length === 0 ? (
          <p className='text-gray-500'>Nothing to show...</p>
        ) : (
          <div className='flex flex-col-reverse gap-4'>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.senderId === me ? 'justify-end' : 'justify-start'
                } mb-2`}
              >
                <div
                  className={` flex flex-col max-w-xs p-2 rounded-lg text-white ${
                    message.senderId === me ? 'bg-blue-500' : 'bg-gray-500'
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`${
                      message.senderId !== me ? 'self-start' : 'self-end'
                    } text-[10px] text-gray-300 mt-1`}
                  >
                    {dateFormat(message?.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {sendEnable && (
        <div className='border-t pt-2 mt-2 flex items-center gap-2'>
          <input
            type='text'
            placeholder='Type a message...'
            className='flex-1 p-2 border rounded-lg focus:outline-none focus:ring text-black dark:text-white dark:bg-gray-700'
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendTheMessage()}
          />
          <button
            className='p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
            onClick={sendTheMessage}
            disabled={!text.trim() || isSending}
          >
            {isSending ? (
              <FaSpinner className='animate-spin w-5 h-5' />
            ) : (
              <FiSend className='w-5 h-5' />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
