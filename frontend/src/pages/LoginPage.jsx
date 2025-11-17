import { useState } from "react";
import logo from "../../public/logo.png";
import { Lock, Mail, User, Eye, EyeOff, Loader } from "lucide-react";
import { UseAuthStore } from "../store/UseAuthStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLogingIn } = UseAuthStore();
  const [showPassword, setshowPassword] = useState(false);
  const [formData, setformData] = useState({
    identifier: "",
    password: "",
  });
  const validateForm = () => {
    if (!formData.identifier.trim())
      return toast.error("Username or Email is required");
    if (!formData.password) return toast.error("Password is required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (!success) return;
    const result = await login(formData);
    if (result) {
      navigate("/");
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Gramosi Logo"
            className="w-14 h-14 rounded-full shadow-md"
          />
          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm">
            Continue to Engage in the Community
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* identifier */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Username or Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="text"
                placeholder="Enter your Email or Username"
                value={formData.identifier}
                onChange={(e) =>
                  setformData({ ...formData, identifier: e.target.value })
                }
                className="w-full h-11 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:outline-none"
              />
            </div>
          </div>
          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setformData({ ...formData, password: e.target.value })
                }
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setshowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgotPassword"
              className="text-md text-gray-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full h-11 bg-gray-800 text-white rounded-xl font-semibold hover:bg-black transition flex justify-center items-center"
          >
            {isLogingIn ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin size-5" />
                Logging In...
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-5">
          You do not have an account?{" "}
          <Link
            to="/signup"
            className="text-gray-800 font-semibold cursor-pointer hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
