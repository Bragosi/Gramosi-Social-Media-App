import { useEffect } from "react";
import SideBar from "../components/SideBar";
import { Link } from "react-router-dom";
import { UseUserStore } from "../store/UseUserStore";

const SkeletonUser = () => (
  <div className="flex items-center gap-3 p-3 border-b animate-pulse">
    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

const SearchPage = () => {
  const { isGettingSuggestedUsers, suggestedUsers, getSuggestedUsers } = UseUserStore();

  useEffect(() => {
    getSuggestedUsers();
  }, []);

  return (
    <div className="min-h-[calc(100vh-120px)] md:flex">
      {/* SIDEBAR — visible only on large screens */}
      <div className="hidden md:block">
        <SideBar />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-4 pt-20 max-w-xl mx-auto">
        <div>
          <h1 className="text-2xl font-semibold mb-4">Suggested Users</h1>

          <div className="bg-white shadow rounded-md overflow-hidden">
            {/* Loading Skeleton */}
            {isGettingSuggestedUsers && Array.from({ length: 10 }).map((_, i) => <SkeletonUser key={i} />)}

            {/* Users List */}
            {suggestedUsers?.map(user => (
              <Link
                to={`/otherUsersProfile/${user._id}`}
                key={user._id}
                className="flex items-center gap-3 p-3 border-b hover:bg-gray-50 transition-colors"
              >
                <img
                  src={user.profilePicture || "/default-avatar.png"}
                  alt={user.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">{user.userName}</p>
                  <p className="text-sm text-gray-500 truncate w-64">{user.bio}</p>
                </div>
              </Link>
            ))}

            {/* Empty state */}
            {!isGettingSuggestedUsers && !suggestedUsers?.length && (
              <p className="p-3 text-gray-500">No suggestions available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
