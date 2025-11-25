import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import VerifyAccountPage from "./pages/VerifyAccountPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import CreatePost from "./pages/CreatePost";
import SettingsPage from "./pages/SettingsPage";
import SearchPage from "./pages/SearchPage";
import Profilepage from "./pages/Profilepage";
import OtherUserProfiles from "./pages/OtherUserProfiles";
import EditProfilePage from "./pages/EditProfilePage";
import UserPosts from "./pages/UserPosts";
import SinglePost from "./pages/SinglePost";

import MobileNavigation from "./components/MobileNavigation";
import Header from "./components/Header";

import { UseAuthStore } from "./store/UseAuthStore";

export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = UseAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
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
              Created by <span className="text-blue-700 ">Bragosi</span>
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verifyAccount" element={<VerifyAccountPage />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPasswordPage />} />
        <Route path="/changePassword" element={<ChangePasswordPage />} />

        <Route
          path="/createPost"
          element={authUser ? <CreatePost /> : <Navigate to="/login" />}
        />

        <Route path="/settings" element={<SettingsPage />} />

        <Route
          path="/search"
          element={authUser ? <SearchPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={authUser ? <Profilepage /> : <Navigate to="/login" />}
        />

        <Route
          path="/otherUsersProfile/:id"
          element={authUser ? <OtherUserProfiles /> : <Navigate to="/login" />}
        />

        <Route
          path="/editProfile"
          element={authUser ? <EditProfilePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/userPosts/:id"
          element={authUser ? <UserPosts /> : <Navigate to="/login" />}
        />

        <Route
          path="/post/:id"
          element={authUser ? <SinglePost /> : <Navigate to="/login" />}
        />
      </Routes>

      <MobileNavigation />
      <Toaster />
    </div>
  );
}
