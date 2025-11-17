import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import { UseAuthStore } from "./store/UseAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import VerifyAccountPage from "./pages/VerifyAccountPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = UseAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen w-full">
      {isCheckingAuth && !authUser ? (
        <div className="relative w-full h-screen">
          <div className="flex flex-col justify-center h-screen items-center">
            <img
              src="/logo.png"
              alt="gramosi logo"
              width={50}
              height={50}
              className="animate-ping"
            />
            <div className="absolute bottom-0 mb-7 flex flex-col items-center justify-center gap-9">
              <h1 className="font-serif text-gray-700 text-2xl">Gramosi</h1>
              <h1 className="font-serif text-xl text-gray-700">
                Created by <span className="text-blue-700 ">Automadev</span>
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verifyAccount" element={<VerifyAccountPage />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
          <Route path="/changePassword" element={<ChangePasswordPage />} />
        </Routes>
      )}
      <Toaster />
    </div>
  );
}
