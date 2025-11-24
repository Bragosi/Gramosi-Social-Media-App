import SideBar from "../components/SideBar";
import { useState } from "react";
import { UsePostStore } from "../store/UsePostStore";
import { ImagePlus, Loader, Video } from "lucide-react";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const { createPost, isCreatingPost } = UsePostStore();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image or video.");

    await createPost(caption, file);
    setCaption("");
    setFile(null);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <SideBar />

      {/* MAIN CONTENT */}
      <main className="flex-1 mt-24 px-4 flex justify-center">
        <div className="w-full max-w-xl p-6 rounded-2xl shadow-lg border border-gray-200">
          {/* Header */}
          <h1 className="text-xl font-semibold font-serif text-gray-700 mb-4">
            Create New Post
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Caption */}
            <textarea
              className="border border-gray-300 p-3 rounded-xl resize-none focus:ring-2 focus:ring-gray-600 outline-none"
              rows="3"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

          <div>
            <input
              id="fileInput"
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Preview */}
            {file && (
              <div className="w-20 mt-2 flex justify-center">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="rounded-xl w-full max-h-80 object-cover shadow-md"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="rounded-xl w-full max-h-80 shadow-md"
                  />
                )}
              </div>
            )}
</div>
 {/* Upload Box */}
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center w-fit cursor-pointer hover:bg-gray-100 transition"
            >
              {file ? (
                <span className="text-gray-600 font-medium py-2 px-2 rounded-lg bg-gray-300 hover:text-white hover:bg-gray-600 transition-all">
                  Change media
                </span>
              ) : (
                <div className="">
                  <ImagePlus className="size-7 text-gray-500 mb-2" />
                </div>
              )}
            </label>
            {/* Submit */}
            <button
              type="submit"
              disabled={isCreatingPost}
              className="bg-gray-800 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition"
            >
              {isCreatingPost ? (
                <>
                  <Loader className="animate-spin size-5" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;
