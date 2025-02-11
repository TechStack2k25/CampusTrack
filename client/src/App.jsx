import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { clearError, clearSuccess } from "./store/slices/userSlice";

function App() {
  const dispatch = useDispatch();
  const success = useSelector((state) => state.user.success);
  const error = useSelector((state) => state.user.error);
  const loading  = useSelector((state) => state.user.loading );
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  

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
    <div className="dark:bg-gradient-to-b dark:from-gray-800 dark:via-gray-900 dark:to-black bg-white">
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
