
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { createTuition } from "@/services/tuitionService";
import { TuitionFormData } from "@/types/tuition";
import { toast } from "react-toastify";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user || session.user.role !== "tutor") {
      toast.error("Only tutors can post tuition.");
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

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Banner Image URL
            </label>
            <input
              type="url"
              name="bannerImage"
              value={formData.bannerImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
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
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {isLoading ? "Posting..." : "Post Tuition"}
          </button>
        </form>
      </div>
    </main>
  );
}
