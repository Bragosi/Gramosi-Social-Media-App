import { useParams, Link } from "react-router-dom";
import { UsePostStore } from "../store/UsePostStore";
import { useEffect, useState } from "react";
import PostBar from "../components/PostBar";
import SideBar from "../components/SideBar";
import { UseAuthStore } from "../store/UseAuthStore";
import { Heart, MessageCircle, Bookmark, EllipsisVertical } from "lucide-react";
const SinglePost = () => {
  const { id } = useParams();
  const [openbar, setOpenbar] = useState(null);
  const { authUser } = UseAuthStore();
  const {
    singlePosts,
    isGettingSinglePosts,
    getSinglePosts,
    saveOrUnsavePost,
    addComment,
    likeAndDislikePost,
  } = UsePostStore();
  const [activePost, setActivePost] = useState(null);
  const [commentText, setCommentText] = useState("");
  useEffect(() => {
    getSinglePosts(id);
  }, [id]);
  const handleSave = async (postId) => {
    await saveOrUnsavePost(postId);
  };
  const handleLike = async (postId) => {
    // 1. Optimistic UI: update singlePosts locally
    const updatedSinglePosts = Array.isArray(singlePosts)
      ? singlePosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(authUser._id)
                  ? post.likes.filter((id) => id !== authUser._id)
                  : [...post.likes, authUser._id],
              }
            : post
        )
      : singlePosts._id === postId
      ? {
          ...singlePosts,
          likes: singlePosts.likes.includes(authUser._id)
            ? singlePosts.likes.filter((id) => id !== authUser._id)
            : [...singlePosts.likes, authUser._id],
        }
      : singlePosts;

    UsePostStore.setState({ singlePosts: updatedSinglePosts });

    // 2. Sync with backend
    if (likeAndDislikePost && typeof likeAndDislikePost === "function") {
      await likeAndDislikePost(postId);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    await addComment(postId, commentText);
    setCommentText("");
    setActivePost(null);
  };
  // -----------------------------------------------------
  // 1. Ensure singlePosts is always an array for mapping
  // -----------------------------------------------------
  const postsArray = Array.isArray(singlePosts)
    ? singlePosts
    : singlePosts
    ? [singlePosts]
    : [];

  // -----------------------------------------------------
  // 2. Skeleton Loader Component
  // -----------------------------------------------------
  const Skeleton = () => (
    <div className="space-y-6 mt-5">
      {[1].map((i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 p-4 rounded-2xl shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
            <div>
              <div className="w-28 h-3 bg-gray-300 rounded mb-2" />
              <div className="w-20 h-2 bg-gray-300 rounded" />
            </div>
          </div>

          <div className="w-full h-72 bg-gray-300 rounded-xl" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <SideBar />
      </div>

      <main className="flex-1 px-4 pt-20 max-w-xl mx-auto">
        {isGettingSinglePosts ? (
          <Skeleton />
        ) : (
          <div className="flex flex-col gap-7 pb-10">
            {postsArray.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">Post not found.</p>
            ) : (
              postsArray.map((post) => (
                <div
                  key={post._id}
                  className="bg-gray-200 rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* TOP SECTION */}
                  <div className="flex w-full justify-between">
                    <Link
                      to={`/otherUsersProfile/${post?.user?._id || ""}`}
                      className="flex items-center gap-3 p-4"
                    >
                      <img
                        src={post?.user?.profilePicture || "/avatar.png"}
                        className="w-11 h-11 rounded-full object-cover"
                        alt="User Avatar"
                      />

                      <div>
                        <p className="font-semibold text-sm">
                          {post?.user?.userName || "Unknown User"}
                        </p>
                      </div>
                    </Link>

                    <button className="p-4" onClick={() => setOpenbar(post)}>
                      <EllipsisVertical className="size-5" />
                    </button>
                  </div>
                  {/* CAPTION */}
                  <div className="p-4">
                    <p className="px-4 pb-2 text-md font-serif font-medium text-gray-700">
                      {post.caption}
                    </p>
                  </div>
                  {/* MEDIA */}
                  {post.media?.type === "image" && (
                    <img
                      src={post.media.url}
                      className="w-full aspect-[4/5] object-cover bg-gray-200"
                      loading="lazy"
                    />
                  )}

                  {post.media?.type === "video" && (
                    <video
                      src={post.media.url}
                      controls
                      className="w-full aspect-[4/5] object-cover bg-gray-200"
                    />
                  )}
                  {/* ACTION BAR */}
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <button
                      onClick={() => handleLike(post._id)}
                      className="flex items-center gap-1 hover:scale-110 transition-transform"
                    >
                      <Heart
                        size={22}
                        className={
                          post.likes.includes(authUser._id)
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
                  {activePost === post._id && (
                    <div className="px-4 pb-4">
                      {/* EXISTING COMMENTS */}
                      <div className="mt-3 space-y-3">
                        {post.comments.map((c) => (
                          <div key={c._id} className="flex gap-2 items-start">
                            <img
                              src={c.user.profilePicture || "/avatar.png"}
                              className="w-7 h-7 rounded-full"
                            />
                            <p className="text-sm bg-gray-100 px-3 py-2 rounded-xl">
                              <span className="font-semibold mr-1">
                                {c.user.userName}
                              </span>
                              {c.text}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* ADD COMMENT INPUT */}
                      <div className="flex gap-2 mt-3">
                        <input
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 px-4 py-2 text-sm rounded-full border bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <button
                          onClick={() => handleAddComment(post._id)}
                          className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {openbar && <PostBar post={openbar} close={() => setOpenbar(null)} />}
      </main>
    </div>
  );
};

export default SinglePost;
