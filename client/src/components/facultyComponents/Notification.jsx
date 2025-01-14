import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const sendNotification = (data) => {
    const newNotification = {
      id: notifications.length + 1,
      subject: data.subject,
      message: data.message,
    };
    //API call
    setNotifications([...notifications, newNotification]);
    reset(); // Reset the form fields
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-center text-2xl font-bold mb-4">Notification Sender</h1>
      {/* Notification Form */}
      <form
        onSubmit={handleSubmit(sendNotification)}
        className="bg-white p-4 shadow rounded mb-4"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            type="text"
            {...register("subject", { required: "Subject is required" })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Notification Subject"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            {...register("message", { required: "Message is required" })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Write your notification..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send Notification
        </button>
      </form>

      {/* Notification List */}
      <div>
        {notifications.length>0 && notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white p-4 shadow rounded mb-2"
          >
            <h2 className="font-semibold">{notification.Subject}</h2>
            <p className="text-gray-700">{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
