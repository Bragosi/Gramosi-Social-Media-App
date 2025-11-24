import { useState } from "react";
import { UseAuthStore } from "../store/UseAuthStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logo from "../../public/logo.png";
import { Loader } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, isSendingOtp } = UseAuthStore();
  const [formData, setformData] = useState({ identifier: "" });
  const validateForm = () => {
    if (!formData.identifier.trim())
      return toast.error("Username or Email is required");

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (!success) return;
    const result = await forgotPassword(formData);
    if (result) {
      navigate("/resetPassword");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl w-full max-w-md p-8">
        {/** Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Gramosi Logo"
            className="w-14 h-14 rounded-full shadow-md"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Forgot Password ?
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email or Username
            </label>
            <input
              type="text"
              value={formData.identifier}
              onChange={(e) =>
                setformData({ ...formData, identifier: e.target.value })
              }
              placeholder="Enter your Email or Username"
              className="w-full h-11 pl-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSendingOtp}
            className="w-full h-11 bg-gray-800 text-white rounded-xl font-semibold hover:bg-black transition flex justify-center items-center disabled:opacity-50"
          >
            {isSendingOtp ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin size-5" />
                Sending OTP...
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
