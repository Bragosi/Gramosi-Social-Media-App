import { Loader, X } from "lucide-react";
import { UsePostStore } from "../store/UsePostStore";
import { UseAuthStore } from "../store/UseAuthStore";
import { useNavigate } from "react-router-dom";

const PostBar = ({ close, post }) => {
  const navigate = useNavigate()
  const { isDeletingPost, deletePosts } = UsePostStore();
  const { authUser, followAndUnfollow } = UseAuthStore();

  const isOwner = post?.user?._id === authUser?._id;
  const userProfile = post?.user; // full user object

  const handleFollowUser = async () => {
    const isFollowing = (userProfile.followers || []).includes(authUser._id);

    // Optimistic UI: update the post's user followers locally
    UsePostStore.setState((state) => ({
      posts: state.posts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              user: {
                ...p.user,
                followers: isFollowing
                  ? p.user.followers.filter((id) => id !== authUser._id)
                  : [...(p.user.followers || []), authUser._id],
              },
            }
          : p
      ),
    }));

    await followAndUnfollow(userProfile._id);
    close();
  };

  const handleDeletePost = async () => {
    await deletePosts(post._id);
    navigate("/")
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
        >
          <X size={26} />
        </button>
<div className="flex justify-center items-center">
          {isOwner && (
          <button
            onClick={handleDeletePost}
            className="text-red-600 font-semibold"
          >
            {isDeletingPost ? (
              <div className="flex items-center gap-2">
                <Loader className="size-5 animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              "Delete Post"
            )}
          </button>
        )}
        {!isOwner && (
          <button
            onClick={handleFollowUser}
            className={`mt-3 px-4 py-2 rounded-lg font-semibold transition-colors ${
              (userProfile.followers || []).includes(authUser._id)
                ? " bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            {(userProfile.followers || []).includes(authUser._id)
              ? "Follow"
              : "UnFollow"}
          </button>
        )}
</div>
      </div>
    </div>
  );
};

export default PostBar;
