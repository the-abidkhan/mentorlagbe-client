
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/uploadImage";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setPhone(session.user.phone || "");
      setBio(session.user.bio || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setIsUploading(true);

      const imageUrl = await uploadImage(file);

      setImage(imageUrl);

      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image,
        phone: phone.trim(),
        bio: bio.trim(),
      });

      if (error) {
        toast.error(error.message || "Profile update failed.");
        return;
      }

      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading profile...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Please login first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Update Profile
        </h1>

        <p className="text-slate-500 mb-8">
          Update your personal information.
        </p>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Profile Image
            </label>

            {image && (
              <img
                src={image}
                alt="Profile preview"
                className="w-28 h-28 rounded-full object-cover border border-slate-200 mb-4"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading || isLoading}
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />

            <p className="mt-2 text-xs text-slate-500">
              Maximum image size: 5 MB.
            </p>

            {isUploading && (
              <p className="mt-2 text-sm text-indigo-600">
                Uploading profile image...
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={session.user.email}
              disabled
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-slate-100 text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPhone(value);
              }}
              placeholder="Enter your phone number"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
              rows={4}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 rounded-lg transition"
          >
            {isLoading
              ? "Updating..."
              : isUploading
                ? "Uploading..."
                : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
