"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { createTuition } from "@/services/tuitionService";
import { TuitionFormData } from "@/types/tuition";
import { toast } from "react-toastify";
import { uploadImage } from "@/lib/uploadImage";

export default function PostTuitionPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [formData, setFormData] = useState<TuitionFormData>({
    title: "",
    subject: "",
    classLevel: "",
    mode: "Offline",
    location: "",
    monthlyFee: 0,
    daysPerWeek: 3,
    bannerImage: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle normal form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        name === "monthlyFee" || name === "daysPerWeek"
          ? Number(value)
          : value,
    });
  };

  // Upload banner image to ImgBB
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setIsUploading(true);

      setFormData((prev) => ({
        ...prev,
        bannerImage: "",
      }));

      const imageUrl = await uploadImage(file);

      setFormData((prev) => ({
        ...prev,
        bannerImage: imageUrl,
      }));

      toast.success("Banner image uploaded successfully!");
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

  // Submit tuition form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user || session.user.role !== "tutor") {
      toast.error("Only tutors can post tuition.");
      return;
    }

    if (!formData.bannerImage) {
      toast.error("Please upload a banner image first.");
      return;
    }

    if (formData.monthlyFee < 1) {
      toast.error("Monthly fee must be at least 1 BDT.");
      return;
    }

    if (formData.daysPerWeek < 1 || formData.daysPerWeek > 7) {
      toast.error("Days per week must be between 1 and 7.");
      return;
    }

    try {
      setIsLoading(true);

      const data = await authClient.token();

      if (!data?.data?.token) {
        toast.error("Authentication token not found.");
        return;
      }

      await createTuition(formData, data.data.token);

      toast.success("Tuition posted successfully!");
      router.push("/my-tuitions");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to post tuition."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return <p className="p-8 text-center">Loading...</p>;
  }

  if (!session?.user || session.user.role !== "tutor") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">
          Only logged-in tutors can access this page.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            Tutor Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Post a New Tuition
          </h1>

          <p className="mt-3 text-slate-500">
            Provide the details of your tuition opportunity.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tuition Title
            </label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: HSC Physics Tutor Needed"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Subject
              </label>

              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Physics"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Class Level
              </label>

              <input
                name="classLevel"
                value={formData.classLevel}
                onChange={handleChange}
                placeholder="Class 11-12"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tuition Mode
              </label>

              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Location
              </label>

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Dhanmondi, Dhaka"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Monthly Fee (BDT)
              </label>

              <input
                type="number"
                name="monthlyFee"
                value={formData.monthlyFee || ""}
                onChange={handleChange}
                min="1"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Days Per Week
              </label>

              <input
                type="number"
                name="daysPerWeek"
                value={formData.daysPerWeek}
                onChange={handleChange}
                min="1"
                max="7"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Banner Image Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tuition Banner Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading || isLoading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              Select an image. Maximum file size: 5 MB.
            </p>

            {isUploading && (
              <p className="mt-3 text-sm font-medium text-indigo-600">
                Uploading image to ImgBB...
              </p>
            )}

            {formData.bannerImage && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-emerald-600">
                  Image uploaded successfully
                </p>

                <img
                  src={formData.bannerImage}
                  alt="Tuition banner preview"
                  className="h-48 w-full rounded-lg border border-slate-200 object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the tuition details..."
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isUploading || !formData.bannerImage}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {isUploading
              ? "Uploading Image..."
              : isLoading
                ? "Posting..."
                : "Post Tuition"}
          </button>
        </form>
      </div>
    </main>
  );
}