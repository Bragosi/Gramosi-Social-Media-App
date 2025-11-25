import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UseUserStore } from "../store/UseUserStore";
import SideBar from "../components/SideBar";
import { GridSkeleton, HeaderSkeleton } from "../components/Skeletons";
import { Bookmark, Grid } from "lucide-react";
import { PostGrid } from "../constants/PostCard";
import { UseAuthStore } from "../store/UseAuthStore";
import Avatar from "../../public/avatar.png";

const OtherUserProfiles = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("posts");
  const { getProfile, userProfile, isGettingUserProfile } = UseUserStore();

  const { authUser, followAndUnfollow } = UseAuthStore();
  const isOwner = userProfile?._id === authUser?._id;

  const handleFollowUser = async () => {
    // Optimistic UI: toggle followers array locally
    const isFollowing = userProfile.followers.includes(authUser._id);

    // Update userProfile locally
    UseUserStore.setState((state) => ({
      userProfile: {
        ...state.userProfile,
        followers: isFollowing
          ? state.userProfile.followers.filter((id) => id !== authUser._id)
          : [...state.userProfile.followers, authUser._id],
      },
    }));

    await followAndUnfollow(userProfile._id);
  };

  useEffect(() => {
    getProfile(id);
  }, [id, getProfile]);

  return (
    <div className="min-h-screen  flex">
      <div className="hidden md:block">
        <SideBar />
      </div>

      <main className="flex-1 px-4 pt-20 max-w-xl mx-auto">
        {isGettingUserProfile ? (
          <>
            <HeaderSkeleton />
            <div className="border-b my-6" />
            <GridSkeleton />
          </>
        ) : (
          <div>
            {userProfile && (
              <div className=" rounded-2xl shadow-sm p-6">
                {/* --- PROFILE HEADER --- */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <img
                    src={userProfile.profilePicture || Avatar}
                    className="w-24 h-24 rounded-full object-cover border"
                    alt="user avatar"
                  />

                  <div className="text-center sm:text-left flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {userProfile.userName}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1 max-w-xs">
                      {userProfile.bio}
                    </p>
                    {!isOwner && (
                      <button
                        onClick={handleFollowUser}
                        className={`mt-3 px-4 py-2 rounded-lg font-semibold transition-colors ${
                          userProfile.followers.includes(authUser._id)
                            ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {userProfile.followers.includes(authUser._id)
                          ? "Unfollow"
                          : "Follow"}
                      </button>
                    )}
                  </div>
                </div>

                {/* --- STATS --- */}
                <div className="flex justify-center sm:justify-start gap-8 mt-5 text-center">
                  <div>
                    <p className="font-semibold text-lg">
                      {userProfile?.posts?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Posts</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {userProfile?.followers?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {userProfile?.following?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Following</p>
                  </div>
                </div>
                {/* Divider */}
                <div className="border-b mt-8" />
                {/* TAB SWITCH */}
                <div className="flex justify-center gap-10 mt-6 font-medium text-gray-600">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`flex items-center gap-2 pb-1 ${
                      activeTab === "posts"
                        ? "border-b-2 border-black text-black"
                        : "hover:text-black"
                    }`}
                  >
                    <Grid size={16} /> Posts
                  </button>

                  <button
                    onClick={() => setActiveTab("saved")}
                    className={`flex items-center gap-2 pb-1 ${
                      activeTab === "saved"
                        ? "border-b-2 border-black text-black"
                        : "hover:text-black"
                    }`}
                  >
                    <Bookmark size={16} /> Saved
                  </button>
                </div>

                {/* TAB CONTENT */}

                <div className="mt-8">
                  {activeTab === "posts" &&
                    (userProfile?.posts?.length > 0 ? (
                      <PostGrid posts={userProfile.posts} />
                    ) : (
                      <div className="py-20 text-center text-gray-500">
                        No posts yet.
                      </div>
                    ))}

                  {activeTab === "saved" && (
                    <PostGrid posts={userProfile.savedPosts} />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default OtherUserProfiles;
