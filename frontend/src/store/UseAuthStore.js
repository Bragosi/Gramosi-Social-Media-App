import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const UseAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isVerifyingAccount: false,
  isVerifyingOTP: false,
  isLogingIn: false,
  isLogingOut: false,
  isSendingOtp: false,
  isResetingPassword: false,
  isChangingPassword: false,
  isEditingProfile: false,
  isFollowing: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/checkAuth");
      set({ authUser: res.data.data.user });
    } catch (error) {
      set({ authUser: null });
      console.log(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  register: async (formData) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/users/signUp", formData);
      set({ authUser: res.data.data.user });
      toast.success("Your account has been created!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyAccount: async (formData) => {
    set({ isVerifyingAccount: true });
    try {
      const res = await axiosInstance.post("/users/verify", formData);
      set({ authUser: res.data.data.user });
      toast.success("Your identity has been verified!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      set({ isVerifyingAccount: false });
    }
  },

  ResendOTP: async () => {
    try {
      const res = await axiosInstance.post("/users/resendOtp");
      toast.success(res.data.message || "OTP sent to your email!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    }
  },

  login: async (formData) => {
    set({ isLogingIn: true });

    try {
      const res = await axiosInstance.post("/users/login", formData);
      set({ authUser: res.data.data.user });
      toast.success("Login successful!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Incorrect login details");
      return false;
    } finally {
      set({ isLogingIn: false });
    }
  },

  logout: async () => {
    set({ isLogingOut: true });

    try {
      const res = await axiosInstance.post("/users/logout");
      set({ authUser: null });
      toast.success(res.data.message || "Logout successful!");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
      return false;
    } finally {
      set({ isLogingOut: false });
    }
  },

  forgotPassword: async (formData) => {
    set({ isSendingOtp: true });

    try {
      const res = await axiosInstance.post("/users/forgotPassword", formData);
      toast.success(res.data.message || "OTP sent to your email!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP");
      return false;
    } finally {
      set({ isSendingOtp: false });
    }
  },

  resetPassword: async (formData) => {
    set({ isResetingPassword: true });

    try {
      const res = await axiosInstance.post("/users/resetPassword", formData);
      set({ authUser: res.data.data.user });
      toast.success("Your password has been reset!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
      return false;
    } finally {
      set({ isResetingPassword: false });
    }
  },

  changePassword: async (formData) => {
    set({ isChangingPassword: true });

    try {
      const res = await axiosInstance.post("/users/changePassword", formData);
      set({ authUser: res.data.data.user });
      toast.success("Your password has been changed!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Change password failed");
      return false;
    } finally {
      set({ isChangingPassword: false });
    }
  },

  editProfile: async (formData) => {
    set({ isEditingProfile: true });
    try {
      const res = await axiosInstance.post("/users/editProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ authUser: res.data.data.user });
      toast.success("Profile updated");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isEditingProfile: false });
    }
  },

followAndUnfollow: async (userId) => {
  set({ isFollowing: true });
  try {
    const res = await axiosInstance.post(`/users/followAndUnfollow/${userId}`);
    set({ authUser: res.data.data.user }); // update authUser globally
    toast.success(res.data.message);
    return res.data.data.user; // return updated user
  } catch (error) {
    toast.error(error.response?.data?.message || "Action failed");
  } finally {
    set({ isFollowing: false });
  }
},

}));
