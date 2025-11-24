import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { UseUserStore } from "../store/UseUserStore";
import { UseAuthStore } from "../store/UseAuthStore";

/* -------------------- Skeleton Components -------------------- */

const HeaderSkeleton = () => (
  <div className="animate-pulse flex items-center gap-6">
    <div className="w-32 h-32 rounded-full bg-gray-200" />
    <div className="flex-1">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="flex gap-6 mt-4">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    </div>
  </div>
);

const GridSkeleton = () => (
  <div className="grid grid-cols-3 gap-3">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="h-48 bg-gray-200 rounded-lg" />
    ))}
  </div>
);

/* -------------------- Edit Profile Modal -------------------- */

const EditProfileModal = ({ open, onClose, profile, onSaved }) => {
  const editProfile = UseAuthStore((s) => s.editProfile);
  const isEditingProfile = UseAuthStore((s) => s.isEditingProfile);

  const [form, setForm] = useState({
    userName: "",
    bio: "",
    profilePic: null,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        userName: profile.userName || "",
        bio: profile.bio || "",
        profilePic: null,
      });
    }
  }, [profile]);

  const handleFile = (e) =>
    setForm((p) => ({ ...p, profilePic: e.target.files[0] }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("userName", form.userName);
    fd.append("bio", form.bio);
    if (form.profilePic) fd.append("profilePic", form.profilePic);

    const ok = await editProfile(fd);
    if (ok) {
      onSaved?.();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Edit profile</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm block mb-1">Username</label>
            <input
              value={form.userName}
              onChange={(e) =>
                setForm((p) => ({ ...p, userName: e.target.value }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) =>
                setForm((p) => ({ ...p, bio: e.target.value }))
              }
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Profile picture</label>
            <input type="file" accept="image/*" onChange={handleFile} />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isEditingProfile}
              className="px-4 py-2 rounded-lg bg-black text-white"
            >
              {isEditingProfile ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------- Follow Button -------------------- */

const FollowButton = ({ targetUserId, onFollowed }) => {
  const authUser = UseAuthStore((s) => s.authUser);
  const followAndUnfollow = UseAuthStore((s) => s.followAndUnfollow);
  const isFollowing = UseAuthStore((s) => s.isFollowing);

  const handle = async () => {
    const ok = await followAndUnfollow(targetUserId);
    if (ok) onFollowed?.();
  };

  const alreadyFollowing = authUser?.following?.some(
    (f) => f === targetUserId || f?._id === targetUserId
  );

  return (
    <button
      onClick={handle}
      disabled={isFollowing}
      className={`px-4 py-2 rounded-lg font-medium ${
        alreadyFollowing ? "border" : "bg-black text-white"
      }`}
    >
      {isFollowing ? "..." : alreadyFollowing ? "Following" : "Follow"}
    </button>
  );
};

/* -------------------- Posts Grid -------------------- */

const PostGrid = ({ posts }) => (
  <div className="grid grid-cols-3 gap-3">
    {posts.map((post) => (
      <div
        key={post._id}
        className="relative group cursor-pointer overflow-hidden rounded-lg"
      >
        <img
          src={post.image}
          alt={post.caption || "post"}
          className="h-48 w-full object-cover transform group-hover:scale-105 transition"
        />

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-6 text-white font-semibold transition-opacity">
          <span>❤️ {post.likes?.length || 0}</span>
          <span>💬 {post.comments?.length || 0}</span>
        </div>
      </div>
    ))}
  </div>
);

/* -------------------- MAIN PROFILE PAGE -------------------- */

export default function ProfilePage() {
  // FIXED Zustand selectors (no more getSnapshot warning)
  const myProfile = UseUserStore((s) => s.myProfile);
  const profile = UseUserStore((s) => s.profile);
  const isGettingMyProfile = UseUserStore((s) => s.isGettingMyProfile);

  const authUser = UseAuthStore((s) => s.authUser);
  const checkAuth = UseAuthStore((s) => s.checkAuth);

  const [openEdit, setOpenEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    checkAuth?.();
    myProfile();
  }, []);

  const isMine = authUser && profile && authUser._id === profile._id;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideBar />

      <main className="flex-1 px-6 py-6 mt-16">
        {isGettingMyProfile ? (
          <div className="max-w-4xl mx-auto">
            <HeaderSkeleton />
            <div className="border-b my-6" />
            <GridSkeleton />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <img
                src={profile?.profilePic || "/avatar.png"}
                className="w-32 h-32 rounded-full object-cover border shadow-sm"
              />

              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-semibold">
                    {profile?.userName}
                  </h1>

                  <div className="ml-4">
                    {isMine ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => setOpenEdit(true)}
                          className="px-4 py-2 rounded-lg border"
                        >
                          Edit Profile
                        </button>
                        <button className="px-4 py-2 rounded-lg border">
                          Share
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <FollowButton
                          targetUserId={profile?._id}
                          onFollowed={() => myProfile()}
                        />
                        <button className="px-4 py-2 rounded-lg border">
                          Message
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 mt-2">
                  {profile?.bio || "No bio yet..."}
                </p>

                <div className="flex gap-6 mt-4">
                  <p>
                    <span className="font-bold">
                      {profile?.posts?.length || 0}
                    </span>{" "}
                    Posts
                  </p>
                  <p>
                    <span className="font-bold">
                      {profile?.followers?.length || 0}
                    </span>{" "}
                    Followers
                  </p>
                  <p>
                    <span className="font-bold">
                      {profile?.following?.length || 0}
                    </span>{" "}
                    Following
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b mt-10" />

            {/* Tabs */}
            <div className="flex justify-center gap-10 mt-6 font-medium text-gray-600">
              <button
                onClick={() => setActiveTab("posts")}
                className={`pb-1 ${
                  activeTab === "posts"
                    ? "border-b-2 border-black text-black"
                    : "hover:text-black"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`${
                  activeTab === "saved" ? "text-black" : "hover:text-black"
                }`}
              >
                Saved
              </button>
              <button
                onClick={() => setActiveTab("tagged")}
                className={`${
                  activeTab === "tagged" ? "text-black" : "hover:text-black"
                }`}
              >
                Tagged
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === "posts" &&
                (profile?.posts?.length > 0 ? (
                  <PostGrid posts={profile.posts} />
                ) : (
                  <p className="text-center text-gray-500 mt-20 text-lg">
                    No posts yet.
                  </p>
                ))}

              {activeTab === "saved" && (
                <p className="text-center text-gray-500 mt-20 text-lg">
                  No saved posts.
                </p>
              )}

              {activeTab === "tagged" && (
                <p className="text-center text-gray-500 mt-20 text-lg">
                  No tagged posts.
                </p>
              )}
            </div>

            <EditProfileModal
              open={openEdit}
              onClose={() => setOpenEdit(false)}
              profile={profile}
              onSaved={() => myProfile()}
            />
          </div>
        )}
      </main>
    </div>
  );
}
