import { Link, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { UseAuthStore } from "../store/UseAuthStore";
import {
  EditIcon,
  Loader,
  LogIn,
  LogOut,
  RefreshCcwDotIcon,
} from "lucide-react";
const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout, isLogingOut, authUser } = UseAuthStore();
  const handleSubmit = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="min-h-[calc(100vh-120px)] md:flex">
      {/* SIDEBAR — visible only on large screens */}
      <div className="hidden md:block">
        <SideBar />
      </div>

      {/* MAIN CONTENT GOES HERE */}
      <main className="flex-1 px-4 pt-20 max-w-xl mx-auto h-screen">
        <div className="flex flex-col">
          <Link
            to="/changePassword"
            className="flex w-full text-gray-600 font-medium items-center gap-4 px-4 py-2 rounded-lg transition-all hover:bg-gray-600 font-serif hover:text-white"
          >
            <EditIcon />
            Change password
          </Link>

          <Link
            to="/forgotPassword"
            className="flex w-full text-gray-600 font-medium items-center gap-4 px-4 py-2 rounded-lg transition-all hover:bg-gray-600 font-serif hover:text-white"
          >
            <RefreshCcwDotIcon />
            Reset Password
          </Link>
          <div>
            {authUser?._id ? (
              <button
                onClick={handleSubmit}
                className="flex text-gray-600 font-medium items-center gap-4 px-4 py-2 rounded-lg transition-all hover:bg-gray-600 font-serif hover:text-white"
              >
                <LogOut />

                {isLogingOut ? (
                  <div className="flex items-center gap-2">
                    <Loader className="size-5 animate-spin" />
                    <span>Logging Out...</span>
                  </div>
                ) : (
                  <span>Log Out</span>
                )}
              </button>
            ) : (
              <Link to="/login">
                <button className="flex w-full text-gray-600 font-medium items-center gap-4 px-4 py-2 rounded-lg transition-all hover:bg-gray-600 font-serif hover:text-white">
                  <LogIn /> <h1>Log In</h1>
                </button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
