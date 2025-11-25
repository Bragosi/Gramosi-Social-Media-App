import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { UsePostStore } from "../store/UsePostStore";
import { Heart, MessageCircle, Bookmark, EllipsisVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { UseAuthStore } from "../store/UseAuthStore";
import PostBar from "../components/PostBar";
import toast from "react-hot-toast";
import Avatar from "../../public/avatar.png";

const HomePage = () => {
  const [openbar, setopenbar] = useState(null);
  const {
    getAllPost,
    posts,
    isGettingPosts,
    likeAndDislikePost,
    saveOrUnsavePost,
    addComment,
  } = UsePostStore();

  const { authUser } = UseAuthStore();

  const [commentText, setCommentText] = useState("");
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    getAllPost();
  }, [getAllPost]);

  const handleLike = async (postId) => {
    if (!authUser) {
      toast.error("You're not Logged In");
      return;
    }

    const updatedPosts = posts.map((post) =>
      post._id === postId
        ? {
            ...post,
            likes: post.likes.includes(authUser._id)
              ? post.likes.filter((id) => id !== authUser._id)
              : [...post.likes, authUser._id],
          }
        : post
    );

    UsePostStore.setState({ posts: updatedPosts });
    await likeAndDislikePost(postId);
  };

  const handleSave = async (postId) => {
    if (!authUser) {
      toast.error("You're not Logged In");
      return;
    }
    await saveOrUnsavePost(postId);
  };

  const handleAddComment = async (postId) => {
    if (!authUser) {
      toast.error("You're not Logged In");
      return;
    }
    if (!commentText.trim()) return;
    await addComment(postId, commentText);
    setCommentText("");
    setActivePost(null);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar only for logged-in users on desktop */}
      <div className="hidden md:block">
        <SideBar />
      </div>

      <main className="flex-1 px-4 pt-20 max-w-xl mx-auto">
        {/* Loading Skeleton */}
        {isGettingPosts && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white p-4 rounded-xl shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="w-24 h-3 bg-gray-200 rounded"></div>
                    <div className="w-16 h-2 mt-1 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        )}

        {/* No Posts */}
        {!isGettingPosts && posts?.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No posts yet
          </p>
        )}

        {/* Posts Feed */}
        <div className="flex flex-col gap-7 pb-10">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-200 rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Author Header */}
              <div className="flex w-full justify-between">
                <Link
                  to={`/otherUsersProfile/${post.user?._id || "unknown"}`}
                  className="flex items-center gap-3 p-4 cursor-pointer transition"
                >
                  <img
                    src={post.user?.profilePicture || Avatar}
                    alt="avatar"
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">
                      {post.user?.userName || "Deleted User"}
                    </p>
                  </div>
                </Link>
                {authUser && (
                  <button className="p-4" onClick={() => setopenbar(post)}>
                    <EllipsisVertical className="size-5" />
                  </button>
                )}
              </div>

              {/* Caption */}
              {post.caption && (
                <p className="px-4 pb-2 text-md font-serif font-medium text-gray-800">
                  {post.caption}
                </p>
              )}

              {/* Media */}
              {post.media?.type === "image" && (
                <img
                  src={post.media.url}
                  alt="post"
                  className="w-full aspect-[4/5] object-cover"
                  loading="lazy"
                />
              )}
              {post.media?.type === "video" && (
                <video
                  src={post.media.url}
                  controls
                  className="w-full aspect-[4/5] object-cover bg-black"
                />
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-1 hover:scale-110 transition-transform"
                >
                  <Heart
                    size={22}
                    className={
                      authUser && post.likes.includes(authUser._id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-600"
                    }
                  />
                  <span className="text-sm">{post.likes.length}</span>
                </button>

                <button
                  onClick={() =>
                    setActivePost(activePost === post._id ? null : post._id)
                  }
                  className="flex items-center gap-1 text-blue-500 hover:scale-110 transition-transform"
                >
                  <MessageCircle size={22} />
                  <span className="text-sm">{post.comments.length}</span>
                </button>

                <button
                  onClick={() => handleSave(post._id)}
                  className={`hover:scale-110 transition-transform ${
                    authUser?.savedPosts?.includes(post._id)
                      ? "text-blue-600 fill-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  <Bookmark size={22} />
                </button>
              </div>

              {/* Comment Section */}
              {activePost === post._id && (
                <div className="px-4 pb-4">
                  <div className="mt-3 space-y-3">
                    {post.comments.map((c) => (
                      <div key={c._id} className="flex gap-2 items-start">
                        <img
                          src={c.user?.profilePicture || "/avatar.png"}
                          alt="avatar"
                          className="w-7 h-7 rounded-full"
                        />
                        <p className="text-sm bg-gray-100 px-3 py-2 rounded-xl">
                          <span className="font-semibold mr-1">
                            {c.user?.userName || "Unknown"}
                          </span>
                          {c.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 text-sm rounded-full border bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {openbar && <PostBar post={openbar} close={() => setopenbar(null)} />}
      </main>
    </div>
  );
};

export default HomePage;
