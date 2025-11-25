import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const UseUserStore = create((set) => ({
  userProfile: null,
  suggestedUsers: null,
  profile: null,
  isGettingUserProfile: false,
  isGettingSuggestedUsers: false,
  isGettingMyProfile: false,
  // ✅ GET ANOTHER USER PROFILE
  getProfile: async (id) => {
    set({ isGettingUserProfile: true });
    try {
      const res = await axiosInstance.get(`/users/profile/${id}`);
      set({ userProfile: res.data.data.user });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not fetch profile");
    } finally {
      set({ isGettingUserProfile: false });
    }
  },

  // ✅ SUGGESTED USERS
  getSuggestedUsers: async () => {
    set({ isGettingSuggestedUsers: true });
    try {
      const res = await axiosInstance.get("/users/suggestedUsers");
      set({ suggestedUsers: res.data.data.users }); // backend returns "users"
         console.log('suggested', res.data.data.users )
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load users");
    } finally {
      set({ isGettingSuggestedUsers: false });
    }
  },

  // ✅ GET MY PROFILE
  myProfile: async () => {
    set({ isGettingMyProfile: true });
    try {
      const res = await axiosInstance.post("/users/myProfile");
      console.log("my profile", res.data.data.user);
      set({ profile: res.data.data.user });
      console.log("profile", res.data.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load profile");
    } finally {
      set({ isGettingMyProfile: false });
    }
  },

}));
