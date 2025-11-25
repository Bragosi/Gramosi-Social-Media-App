import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { UseUserStore } from "../store/UseUserStore";
import Avatar from "../../public/avatar.png";
import { Edit, Bookmark, Grid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeaderSkeleton, GridSkeleton } from "../components/Skeletons";
import { PostGrid } from "../constants/PostCard";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { myProfile, isGettingMyProfile, profile } = UseUserStore();
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    myProfile();
  }, [myProfile]);

  return (
    <div className="min-h-screen flex ">
      <div className="hidden md:block">
        <SideBar />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:px-12 pt-20 w-full max-w-3xl mx-auto overflow-y-auto">
        {isGettingMyProfile ? (
          <>
            <HeaderSkeleton />
            <div className="border-b my-6" />
            <GridSkeleton />
          </>
        ) : (
          <div className=" rounded-2xl shadow-sm p-6">
            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={profile?.profilePicture || Avatar}
                alt={profile?.userName}
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-200 shadow-md"
              />

              <div className="flex-1 w-full">
                {/* Username + Edit */}
                <div className="flex flex-col sm:flex-row items-center sm:justify-between w-full gap-3">
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile?.userName}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1 max-w-xs">
                      {profile?.bio}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/editProfile")}
                    className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 transition"
                  >
                    <Edit size={16} /> Edit Profile
                  </button>
                </div>

                {/* Stats */}
                <div className="flex justify-center sm:justify-start gap-8 mt-5 text-center">
                  <div>
                    <p className="font-semibold text-lg">
                      {profile?.posts?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Posts</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {profile?.followers?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {profile?.following?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Following</p>
                  </div>
                </div>
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
                (profile?.posts?.length > 0 ? (
                  <PostGrid posts={profile.posts} />
                ) : (
                  <div className="py-20 text-center text-gray-500">
                    No posts yet.
                  </div>
                ))}

              {activeTab === "saved" && <PostGrid posts={profile.savedPosts} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
