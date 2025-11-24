import { Link } from "react-router-dom";

export const PostCard = ({ post }) => {
  return (
    <Link
      className="relative group cursor-pointer overflow-hidden rounded-lg bg-black"
      to={`/post/${post._id}`}
    >
      {post.media.type === "image" ? (
        <img
          src={post.media.url}
          alt={post.caption || "post"}
          className="h-48 w-full object-cover transform group-hover:scale-105 transition-all duration-300"
        />
      ) : (
        <video
          src={post.media.url}
          muted
          className="h-48 w-full object-cover transform group-hover:scale-105 transition-all duration-300"
        />
      )}

      {/* HOVER OVERLAY */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-6 text-white text-sm font-semibold transition-opacity">
        <span>❤️ {post.likes?.length || 0}</span>
        <span>💬 {post.comments?.length || 0}</span>
      </div>
    </Link>
  );
};

export const PostGrid = ({ posts }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6">
    {posts.map((p) => (
      <PostCard key={p._id} post={p} />
    ))}
  </div>
);
