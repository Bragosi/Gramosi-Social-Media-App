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
import CreatePost from "./pages/CreatePost";
import MobileNavigation from "./components/MobileNavigation";
import SettingsPage from "./pages/SettingsPage";
import SearchPage from "./pages/SearchPage";
import Profilepage from "./pages/Profilepage";
import Header from "./components/Header";
import OtherUserProfiles from "./pages/OtherUserProfiles";
import EditProfilePage from "./pages/EditProfilePage";
import UserPosts from "./pages/UserPosts";
import SinglePost from "./pages/SinglePost";

export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = UseAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading screen while checking auth
  if (isCheckingAuth) {
    return (
      <div className="relative w-full h-screen bg-white">
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
              Created by <span className="text-blue-700">Automadev</span>
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* Only show layout when NOT on auth pages */}
      {authUser ? (
        <>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<Profilepage />} />
            <Route path="/otherUsersProfile/:id" element={<OtherUserProfiles />} />
            <Route path="/editProfile" element={<EditProfilePage />} />
            <Route path="/userPosts/:id" element={<UserPosts />} />
            <Route path="/post/:id" element={<SinglePost />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <MobileNavigation />
        </>
      ) : (
        // NOT LOGGED IN → Show only public/auth routes
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Public feed */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verifyAccount" element={<VerifyAccountPage />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
          <Route path="/otherUsersProfile/:id" element={<OtherUserProfiles />} />
          <Route path="/userPosts/:id" element={<UserPosts />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}

      <Toaster />
    </div>
  );
}