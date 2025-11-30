import { useState } from "react";
import logo from "../../public/logo.png";
import { Lock, Mail, User, Eye, EyeOff, Loader } from "lucide-react";
import { UseAuthStore } from "../store/UseAuthStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const SignUp = () => {
  const navigate = useNavigate();
  const { register, isSigningUp } = UseAuthStore();
  const [showPassword, setshowPassword] = useState(false);
  
  const [formData, setformData] = useState({
    userName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const validateForm = () => {
    if (!formData.userName.trim()) return toast.error("Username is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 Characters");
    if (formData.password !== formData.passwordConfirm)
      return toast.error("Passwords do not match");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (!success) return;
    const result = await register(formData);
    if (result) {
      navigate("/verifyAccount");
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
            Create an Account
          </h1>
          <p className="text-gray-500 text-sm">Join Gramosi in seconds</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="text"
                placeholder="Enter your username"
                value={formData.userName}
                onChange={(e) =>
                  setformData({ ...formData, userName: e.target.value })
                }
                className="w-full h-11 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setformData({ ...formData, email: e.target.value })
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

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={formData.passwordConfirm}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    passwordConfirm: e.target.value,
                  })
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

          {/* Button */}
          <button
            type="submit"
            className="w-full h-11 bg-gray-800 text-white rounded-xl font-semibold hover:bg-black transition flex justify-center items-center"
          >
            {isSigningUp ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin size-5" />
                Signing Up...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gray-800 font-semibold cursor-pointer hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
