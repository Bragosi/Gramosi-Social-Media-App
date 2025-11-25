import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { UseAuthStore } from "./UseAuthStore";
export const UsePostStore = create((set, get) => ({
  posts: [],
  userPosts: [],
  savedPosts: [],
  singlePosts: [],
  isCreatingPost: false,
  isGettingPosts: false,
  hasMore: true,
  cursor: null,
  isGettingUsersPosts: false,
  isDeletingPost: false,
  isSavingPost: false,
  isLikingPost: false,
  isCommenting: false,
  isGettingSinglePosts: false,

  createPost: async (caption, file) => {
    set({ isCreatingPost: true });

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("media", file);

      const res = await axiosInstance.post("/posts/createPost", formData);

      toast.success(res.data.message || "Post Created!");

      // Add post to top of feed
      set((state) => ({
        posts: [res.data.data.post, ...state.posts],
      }));
      return res.data.data.post;
    } catch (error) {
      toast.error(error.response?.data?.message || "Post failed");
      return null;
    } finally {
      set({ isCreatingPost: false });
    }
  },

 getAllPost: async (isLoadMore = false) => {
    if (!get().hasMore && isLoadMore) return;

    set({ isGettingPosts: true });

    try {
      const params = { limit: 10 };
      if (isLoadMore && get().cursor) {
        params.cursor = get().cursor;
      }

      const res = await axiosInstance.get("/posts/all", { params });

      const newPosts = res.data.data.posts;
      const nextCursor = res.data.data.nextCursor;
      const hasMore = res.data.data.hasMore;

      set((state) => ({
        posts: isLoadMore ? [...state.posts, ...newPosts] : newPosts,
        cursor: nextCursor,
        hasMore,
      }));

      return newPosts;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load posts");
    } finally {
      set({ isGettingPosts: false });
    }
  },

  // Reset for refresh/pull-to-refresh
  resetPosts: () => {
    set({ posts: [], cursor: null, hasMore: true });
  },

  getUserPosts: async (id) => {
    set({ isGettingUsersPosts: true });

    try {
      const res = await axiosInstance.get(`/posts/userPost/${id}`);
      set({ userPosts: res.data.data.posts });
      return res.data.data.posts;
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
      return null;
    } finally {
      set({ isGettingUsersPosts: false });
    }
  },

  saveOrUnsavePost: async (postId) => {
    set({ isSavingPost: true });

    try {
      const res = await axiosInstance.post(
        `/posts/saveAndUnsavePosts/${postId}`
      );

      toast.success(res.data.message);

      // Update post store
      set({ savedPosts: res.data.data.savedPosts });

      // Update auth user to trigger UI rerender
      UseAuthStore.setState((state) => ({
        authUser: {
          ...state.authUser,
          savedPosts: res.data.data.savedPosts,
        },
      }));

      return res.data.data.savedPosts;
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
      return null;
    } finally {
      set({ isSavingPost: false });
    }
  },

  deletePosts: async (id) => {
    set({ isDeletingPost: true });

    try {
      const res = await axiosInstance.delete(`/posts/deletePost/${id}`);

      toast.success(res.data.message);

      // Remove deleted post from feed
      set((state) => ({
        posts: state.posts.filter((p) => p._id !== id),
      }));

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
      return false;
    } finally {
      set({ isDeletingPost: false });
    }
  },

  likeAndDislikePost: async (postId) => {
    set({ isLikingPost: true });

    try {
      const res = await axiosInstance.post(
        `/posts/likeAndDislikePost/${postId}`
      );
      toast.success(res.data.message);
      return res.data.message;
    } catch (error) {
      toast.error("You're not logged in");
      console.log("you are not logged in", error);
      return null;
    } finally {
      set({ isLikingPost: false });
    }
  },

  addComment: async (postId, text) => {
    set({ isCommenting: true });

    try {
      const res = await axiosInstance.post(`/posts/comment/${postId}`, {
        text,
      });

      toast.success(res.data.message);

      const newComment = res.data.data.comment;

      // Insert new comment into the correct post
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        ),
      }));

      return newComment;
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
      return null;
    } finally {
      set({ isCommenting: false });
    }
  },

  getSinglePosts: async (postId) => {
    set({ isGettingSinglePosts: true });
    try {
      const res = await axiosInstance.get(`/posts/singlePosts/${postId}`);
     set({ singlePosts: res.data.data.post });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
      return false;
    } finally {
      set({ isGettingSinglePosts: false });
    }
  },
}));
