import { Camera, X, Loader } from "lucide-react";
import { UseAuthStore } from "../store/UseAuthStore";
import { useState } from "react";
import Avatar from "../../public/avatar.png";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const navigate = useNavigate()
  const { editProfile, isEditingProfile, authUser } = UseAuthStore();

  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    bio: authUser?.bio || "",
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append("profilePicture", file);

    await editProfile(fd, true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("bio", formData.bio);

    await editProfile(fd, false);
    navigate("/profile")
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden p-6 relative">

        {/* Close Button */}
        <button
          onClick={()=>navigate("/profile")}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
        >
          <X size={26} />
        </button>

        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="relative group">
            <img
              src={selectedImage || authUser.profilePicture || Avatar}
              alt="profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-200 shadow-md transition group-hover:blur-[2px]"
            />

            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-2 right-2 bg-gray-900 text-white p-3 rounded-full cursor-pointer transition transform hover:scale-110 shadow-lg 
                ${isEditingProfile ? "animate-pulse pointer-events-none" : ""}`}
            >
              <Camera size={18} />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isEditingProfile}
              />
            </label>
          </div>

          <p className="text-sm text-gray-500 flex items-center gap-2">
            {isEditingProfile ? (
              <>
                <Loader size={16} className="animate-spin" /> Uploading...
              </>
            ) : (
              "Change your profile picture"
            )}
          </p>
        </div>

        {/* Bio Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-gray-700">Bio</label>

          <textarea
            value={formData.bio}
            placeholder="Tell people about yourself..."
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full min-h-28 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:outline-none bg-gray-50"
          ></textarea>

          <button
            type="submit"
            className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition font-semibold shadow"
          >
            {isEditingProfile ? (
              <span className="flex items-center justify-center gap-2">
                <Loader size={18} className="animate-spin" /> Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
