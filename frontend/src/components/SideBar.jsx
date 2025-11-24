import { UseAuthStore } from "../store/UseAuthStore";
import Avatar from "../../public/avatar.png";
import {Loader, LogIn,LogOut,} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../public/logo.png";
import { navItems } from "../constants/navItems";

const SideBar = () => {
  const navigate = useNavigate();
  const { logout, isLogingOut, authUser } = UseAuthStore();

  const handleSubmit = () => {
    logout();
    navigate("/login");
  };


  return (
    <aside className="hidden fixed md:flex w-64 min-h-screen border-r px-6 py-8">
      <div className="flex flex-col h-full w-full">
        {/* LOGO */}
        <div className="pb-5 mb-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="gramosi logo"
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-3xl font-semibold text-gray-600 tracking-wide">
              Gramosi
            </h1>
          </Link>
        </div>

        {/* PROFILE */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <img
              src={authUser?.profilePicture || Avatar}
              alt={authUser?.userName}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-700 shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition"></div>
          </div>

          <h2 className="text-gray-600 font-semibold mt-4 text-lg">
            {authUser?.userName || "User"}
          </h2>

          <p className="text-gray-500 text-sm">
            @{authUser?.email?.split("@")[0]}
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2 text-gray-600 flex-1">
          {navItems.map(({ id, label, link, icon: Icon }) => (
            <NavLink
              key={id}
              to={link}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-600/20 text-gray-600 font-serif"
                    : "hover:bg-gray-600 font-serif hover:text-white"
                }`
              }
            >
              <Icon className="w-6 h-6" />
              <span className="text-md font-serif tracking-wide">{label}</span>
            </NavLink>
          ))}
        </nav>
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
    </aside>
  );
};

export default SideBar;
