import { useState } from "react";
import toast from "react-hot-toast";
import { UseAuthStore } from "../store/UseAuthStore";
import { Lock, Eye, EyeOff, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../public/logo.png";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [showPassword, setshowPassword] = useState(false);
  const { changePassword, isChangingPassword } = UseAuthStore();

  const [formData, setformData] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  const validateForm = () => {
    if (!formData.currentPassword.trim())
      return toast.error("Current Password is required");
    if (!formData.newPassword) return toast.error("New Password is required");
    if (formData.newPassword.length < 6)
      return toast.error("Password must be at least 6 Characters");
    if (formData.newPassword !== formData.newPasswordConfirm)
      return toast.error("Passwords do not match");

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();
    if (!success) return;

    const result = await changePassword(formData);
    if (result) {
      navigate("/login");
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
          Change Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/*Current Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Current password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setformData({ ...formData, currentPassword: e.target.value })
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

          {/*newPassword */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) =>
                  setformData({ ...formData, newPassword: e.target.value })
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

          {/*Cofirm new Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={formData.newPasswordConfirm}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    newPasswordConfirm: e.target.value,
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
          <button
            type="submit"
            className="w-full h-11 bg-gray-800 text-white rounded-xl font-semibold hover:bg-black transition flex justify-center items-center"
          >
            {isChangingPassword ? (
              <div className="flex justify-center items-center gap-2">
                <Loader className="size-5 animate-spin" /> Changing Password..
              </div>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
