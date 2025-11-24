import React, { useEffect, useState } from "react";
import { UsePostStore } from "../store/UsePostStore";
import { UseAuthStore } from "../store/UseAuthStore";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";


const UserPosts = () => {
  const {id} =useParams()
  console.log("User ID from params:", id);

  const {authUser } =UseAuthStore()
  const { userPosts, isGettingUsersPosts, getUserPosts, addComment, saveOrUnsavePost, likeAndDislikePost } = UsePostStore();
  const [openbar, setopenbar] = useState(null);
  const [activePost, setActivePost] = useState(null);
    const [commentText, setCommentText] = useState("");


const handleLike = async (postId) => {
  if (!authUser) return toast.error("You must be logged in");

  const updated = userPosts.map((post) =>
    post._id === postId
      ? {
          ...post,
          likes: post.likes.includes(authUser._id)
            ? post.likes.filter((id) => id !== authUser._id)
            : [...post.likes, authUser._id],
        }
      : post
  );

  // Update local UI
  UsePostStore.setState({ userPosts: updated });

  // Update backend
  await likeAndDislikePost(postId);
};

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    await addComment(postId, commentText);
    setCommentText("");
    setActivePost(null);
  };

  const handleSave = async (postId) => {
    await saveOrUnsavePost(postId);
  };

useEffect(() => {
  if (id) getUserPosts(id);
}, [id]);


  return (
    <div className="min-h-screen  flex">
      <div className="hidden md:block">
        <SideBar />
      </div>
      <main className="flex-1 px-4 pt-20 max-w-xl mx-auto">
        {/* LOADING SKELETON */}
        {isGettingUsersPosts && (
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
        {/* NO POSTS */}
        {!isGettingUsersPosts && userPosts?.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No posts yet
          </p>
        )}

     {/* POSTS */}
        <div className="flex flex-col gap-7 pb-10">
          {userPosts.map((posts) => (
            <div
              key={posts._id}
              className="bg-gray-200 rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* TOP SECTION */}
              <div className="flex w-full justify-between">
                <Link
                  to={`/otherUsersProfile/${posts.user._id}`}
                  className="flex items-center gap-3 p-4 cursor-pointer"
                >
                  <img
                    src={posts.user.profilePicture || "/avatar.png"}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">
                      {posts.user.userName}
                    </p>
                  </div>
                </Link>
                <button
                  className="p-4"
                  onClick={() => {
                    setopenbar(posts);
                  }}
                >
                  <EllipsisVertical className="size-5" />
                </button>
              </div>
              {/* CAPTION */}
              {posts.caption && (
                <p className="px-4 pb-2 text-md font-serif font-medium text-gray-700">
                  {posts.caption}
                </p>
              )}

              {/* MEDIA */}
              {posts.media?.type === "image" && (
                <img
                  src={posts.media.url}
                  className="w-full aspect-[4/5] object-cover bg-gray-200"
                  loading="lazy"
                />
              )}

              {posts.media?.type === "video" && (
                <video
                  src={posts.media.url}
                  controls
                  className="w-full aspect-[4/5] object-cover bg-gray-200"
                />
              )}

              {/* ACTION BAR */}
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <button
                  onClick={() => handleLike(posts._id)}
                  className="flex items-center gap-1 hover:scale-110 transition-transform"
                >
                  <Heart
                    size={22}
                    className={
                      posts.likes.includes(authUser._id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-600"
                    }
                  />
                  <span className="text-sm">{posts.likes.length}</span>
                </button>

                <button
                  onClick={() =>
                    setActivePost(activePost === posts._id ? null : posts._id)
                  }
                  className="flex items-center gap-1 text-blue-500 hover:scale-110 transition-transform"
                >
                  <MessageCircle size={22} />
                  <span className="text-sm">{posts.comments.length}</span>
                </button>

                <button
                  onClick={() => handleSave(posts._id)}
                  className={`hover:scale-110 transition-transform ${
                    authUser?.savedPosts?.includes(posts._id)
                      ? "text-blue-600 fill-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  <Bookmark size={22} />
                </button>
              </div>

              {/* COMMENT SECTION */}
              {activePost === posts._id && (
                <div className="px-4 pb-4">
                  {/* EXISTING COMMENTS */}
                  <div className="mt-3 space-y-3">
                    {posts.comments.map((c) => (
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
                      onClick={() => handleAddComment(posts._id)}
                      className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700"
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

export default UserPosts;
