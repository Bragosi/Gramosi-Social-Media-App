import { useState, useEffect } from "react";
import logo from "../../public/logo.png";
import { Loader } from "lucide-react";
import { UseAuthStore } from "../store/UseAuthStore";
import { useNavigate } from "react-router-dom";

const VerifyAccountPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ otp: "" });
  const { isVerifyingAccount, ResendOTP, verifyAccount } = UseAuthStore();

  const [counter, setCounter] = useState(30); // 30-sec countdown

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!formData.otp.trim()) return;
    const result = await verifyAccount(formData);
    if (result) {
      navigate("/");
    }
  };

  const handleResend = () => {
    if (counter > 0) return;
    ResendOTP();
    setCounter(30); // Reset countdown
  };

  // Countdown effect
  useEffect(() => {
    if (counter === 0) return;
    const timer = setTimeout(() => setCounter(counter - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter]);

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
            Verify Your Account
          </h1>
          <p className="text-gray-500 text-sm text-center">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleVerification} className="space-y-5">
          {/* OTP Input */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              OTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={(e) =>
                setFormData({ ...formData, otp: e.target.value })
              }
              className="w-full h-12 pl-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-800 focus:outline-none tracking-widest text-center text-lg"
            />
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="w-full h-11 bg-gray-800 text-white rounded-xl font-semibold hover:bg-black transition flex justify-center items-center"
          >
            {isVerifyingAccount ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin size-5" />
                Verifying...
              </div>
            ) : (
              "Verify Account"
            )}
          </button>
        </form>

        {/* Resend OTP section */}
        <div className="text-center mt-5 text-sm text-gray-600">
          Didn’t receive the code?
          <button
            onClick={handleResend}
            disabled={counter > 0}
            className={`ml-2 font-semibold hover:underline 
              ${
                counter > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-800"
              }
            `}
          >
            {counter > 0 ? `Resend in ${counter}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountPage;
