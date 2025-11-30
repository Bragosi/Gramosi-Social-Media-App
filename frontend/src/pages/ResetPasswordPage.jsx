import { useState } from "react";
import toast from "react-hot-toast";
import { UseAuthStore } from "../store/UseAuthStore";
import logo from "../../public/logo.png";
import { User, Lock, Eye, EyeOff, Loader, OptionIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [showPassword, setshowPassword] = useState(false);
  const { resetPassword, isResetingPassword } = UseAuthStore();
  const [formData, setformData] = useState({
    identifier: "",
    otp: "",
    password: "",
    passwordConfirm: "",
  });

  const validateForm = () => {
    if (!formData.identifier.trim())
      return toast.error("Username or Email is required");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password !== formData.passwordConfirm)
      return toast.error("Passwords do not match");
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();
    if (!success) return;
    const result = await resetPassword(formData);
    if (result) {
      navigate("/login");
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
            Reset Password
          </h1>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Identifier */}
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

          {/* OTP */}
          <div>
            <label className="text-sm font-medium text-gray-700">OTP</label>
            <div className="relative">
              <OptionIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={(e) =>
                  setformData({ ...formData, otp: e.target.value })
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
            disabled={isResetingPassword}
            className="w-full h-11 bg-gray-800 text-white rounded-xl font-semibold hover:bg-black transition flex justify-center items-center disabled:opacity-50"
          >
            {isResetingPassword ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin size-5" />
                Resetting Password...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
