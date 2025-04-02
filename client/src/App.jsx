import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { clearError, clearSuccess, loginSuccess } from "./store/slices/userSlice";
import { userService } from './api/userService.js';
import { socketService } from "./api/socketService.js";

function App() {
  const dispatch = useDispatch();
  const success = useSelector((state) => state.user.success);
  const error = useSelector((state) => state.user.error);
  const loading  = useSelector((state) => state.user.loading );
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const { status:userStatus, user }=useSelector((state)=>state.user);

  const currentUser=async()=>{
    const res=await userService.currentUser();
    if(res){
      dispatch(loginSuccess(res));
    }
  }

  useEffect(()=>{
    if(userStatus) {
      currentUser();
      if(user?.role!=='User'){
        socketService.connect();
        const rooms=[...user?.course];
        rooms.push(user?.college);
        rooms.push(user?.department);
        socketService.joinRooms(rooms);
      }
    }
    return () => {
      socketService.disconnect();
    };
  },[]);
  
  

  useEffect(() => {
    if (success) {
      toast.success(success, {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode?"dark":"light", // changing the theme dynamically
        onClose: () => dispatch(clearSuccess()),
        // Reset message after toast
      });
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode?"dark":"light", // changing the theme dynamically
        onClose: () => dispatch(clearError()),
        // Reset message after toast
      });
    }
  }, [error, dispatch]);

  return (
    <div className="dark:bg-gradient-to-b dark:from-gray-800 dark:via-gray-900 dark:to-black bg-gray-50">
      <ToastContainer />
      <Header />
        <main className="min-h-screen">
          <Outlet />
        </main>
      <Footer />
    </div>
  );
}

export default App;
