"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
}

interface TuitionFormData {
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
}

const initialFormData: TuitionFormData = {
  title: "",
  subject: "",
  classLevel: "",
  mode: "Offline",
  location: "",
  monthlyFee: 0,
  daysPerWeek: 3,
  bannerImage: "",
  description: "",
};

export default function MyTuitionsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTuition, setEditingTuition] = useState<string | null>(null);
  const [formData, setFormData] = useState<TuitionFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchMyTuitions = async () => {
    try {
      const { data } = await authClient.token();

      if (!data?.token) {
        toast.error("Please login again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions/my`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to load your tuitions.");
        return;
      }

      setTuitions(result);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending && session?.user?.role === "tutor") {
      fetchMyTuitions();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [session, isPending]);

  const handleEdit = (tuition: Tuition) => {
    setEditingTuition(tuition._id);

    setFormData({
      title: tuition.title,
      subject: tuition.subject,
      classLevel: tuition.classLevel,
      mode: tuition.mode,
      location: tuition.location,
      monthlyFee: tuition.monthlyFee,
      daysPerWeek: tuition.daysPerWeek,
      bannerImage: tuition.bannerImage || "",
      description: tuition.description,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "monthlyFee" || name === "daysPerWeek"
          ? value === ""
            ? 0
            : Number(value)
          : value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingTuition) return;

    if (formData.monthlyFee < 1) {
      toast.error("Monthly fee must be at least 1 BDT.");
      return;
    }

    if (formData.daysPerWeek < 1 || formData.daysPerWeek > 7) {
      toast.error("Days per week must be between 1 and 7.");
      return;
    }

    setSaving(true);

    try {
      const { data } = await authClient.token();

      if (!data?.token) {
        toast.error("Please login again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions/${editingTuition}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to update tuition.");
        return;
      }

      toast.success(result.message || "Tuition updated successfully.");

      setEditingTuition(null);
      setFormData(initialFormData);

      await fetchMyTuitions();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTuition(null);
    setFormData(initialFormData);
  };


const handleToggleActive = async (tuition: Tuition) => {
  try {
    setToggling(tuition._id);

    const { data } = await authClient.token();

    if (!data?.token) {
      toast.error("Please login again.");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions/${tuition._id}/active`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          isActive: !tuition.isActive,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      toast.error(result.message || "Failed to update tuition status.");
      return;
    }

    setTuitions((previousTuitions) =>
      previousTuitions.map((item) =>
        item._id === tuition._id
          ? { ...item, isActive: !item.isActive }
          : item
      )
    );

    toast.success(result.message);
  } catch {
    toast.error("Something went wrong. Please try again.");
  } finally {
    setToggling(null);
  }
};


  const handleDelete = async (tuitionId: string) => {
    setDeleting(tuitionId);

    try {
      const { data } = await authClient.token();

      if (!data?.token) {
        toast.error("Please login again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions/${tuitionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to delete tuition.");
        return;
      }

      toast.success(result.message || "Tuition deleted successfully.");

      if (editingTuition === tuitionId) {
        handleCancelEdit();
      }

      await fetchMyTuitions();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const pendingCount = tuitions.filter(
    (tuition) => tuition.approvalStatus === "pending"
  ).length;

  const approvedCount = tuitions.filter(
    (tuition) => tuition.approvalStatus === "approved"
  ).length;

  const rejectedCount = tuitions.filter(
    (tuition) => tuition.approvalStatus === "rejected"
  ).length;

  const getStatusStyle = (status: string) => {
    if (status === "approved") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading your tuitions...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Please Login First
        </h1>

        <Link
          href="/login"
          className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
        >
          Login
        </Link>
      </div>
    );
  }

  if (session.user.role !== "tutor") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">
          You are not authorized to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold text-indigo-600 mb-2">
              TUTOR DASHBOARD
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              My Tuitions
            </h1>

            <p className="text-slate-500 mt-2">
              View and track all your tuition posts.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg text-sm font-medium transition text-center"
          >
            Browse Tuitions
          </Link>
        </div>

        {editingTuition && (
          <div className="bg-white border border-indigo-200 rounded-xl p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Edit Tuition
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              Updated tuition information will be submitted for admin approval.
            </p>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tuition Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Class Level
                  </label>

                  <input
                    type="text"
                    name="classLevel"
                    value={formData.classLevel}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tuition Mode
                  </label>

                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Monthly Fee (BDT)
                  </label>

                  <input
                    type="number"
                    name="monthlyFee"
                    value={formData.monthlyFee === 0 ? "" : formData.monthlyFee}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Days Per Week
                  </label>

                  <input
                    type="number"
                    name="daysPerWeek"
                    value={formData.daysPerWeek === 0 ? "" : formData.daysPerWeek}
                    onChange={handleChange}
                    min="1"
                    max="7"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  {saving ? "Updating..." : "Update Tuition"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-sm text-slate-500">Total Tuitions</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {tuitions.length}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-sm text-slate-500">Pending</p>
            <h2 className="text-3xl font-bold text-amber-600 mt-2">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-sm text-slate-500">Approved</p>
            <h2 className="text-3xl font-bold text-emerald-600 mt-2">
              {approvedCount}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-sm text-slate-500">Rejected</p>
            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {rejectedCount}
            </h2>
          </div>
        </div>

        {tuitions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <div className="text-4xl mb-4">📚</div>

            <h2 className="text-xl font-semibold text-slate-900">
              No Tuitions Yet
            </h2>

            <p className="text-slate-500 mt-2">
              You have not posted any tuition yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tuitions.map((tuition) => (
              <div
                key={tuition._id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
              >
                {tuition.bannerImage && (
                  <img
                    src={tuition.bannerImage}
                    alt={tuition.title}
                    className="w-full h-48 object-cover rounded-lg mb-5"
                  />
                )}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {tuition.title}
                    </h2>

                    <p className="text-sm text-indigo-600 font-medium mt-1">
                      {tuition.subject} · {tuition.classLevel}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                      tuition.approvalStatus
                    )}`}
                  >
                    {tuition.approvalStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                  <div>
                    <p className="text-slate-400">Monthly Fee</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      ৳{tuition.monthlyFee.toLocaleString("en-BD")}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Days Per Week</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {tuition.daysPerWeek} days
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Mode</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {tuition.mode}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Location</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {tuition.location}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500">
                    Posted On:{" "}
                    {new Date(tuition.createdAt).toLocaleDateString()}
                  </p>

                  <p className="text-sm text-slate-500 mt-2">
                    {tuition.isActive ? "Active Tuition" : "Inactive Tuition"}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(tuition)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-3 rounded-lg font-medium transition"
                  >
                    Edit Tuition
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(tuition)}
                    disabled={toggling === tuition._id}
                    className={`px-4 py-3 rounded-lg font-medium transition disabled:opacity-50 ${tuition.isActive
                        ? "bg-amber-50 hover:bg-amber-100 text-amber-700"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                      }`}
                  >
                    {toggling === tuition._id
                      ? "Updating..."
                      : tuition.isActive
                        ? "Deactivate"
                        : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(tuition._id)}
                    disabled={deleting === tuition._id}
                    className="bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-700 px-4 py-3 rounded-lg font-medium transition"
                  >
                    {deleting === tuition._id ? "Deleting..." : "Delete Tuition"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}