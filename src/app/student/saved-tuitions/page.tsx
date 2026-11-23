
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
  mode: string;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage?: string;
}

export default function SavedTuitionsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedTuitions = async () => {
      try {
        const { data } = await authClient.token();

        if (!data?.token) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions/saved`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.message || "Failed to load saved tuitions.");
          return;
        }

        setTuitions(result);
      } catch {
        toast.error("Failed to load saved tuitions.");
      } finally {
        setLoading(false);
      }
    };

    if (!isPending && session?.user?.role === "student") {
      fetchSavedTuitions();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [session, isPending]);

  const handleRemoveBookmark = async (tuitionId: string) => {
    try {
      setRemovingId(tuitionId);

      const { data } = await authClient.token();

      if (!data?.token) {
        toast.error("Please login first.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions/${tuitionId}/bookmark`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to remove tuition.");
        return;
      }

      setTuitions((previous) =>
        previous.filter((tuition) => tuition._id !== tuitionId)
      );

      toast.success("Tuition removed from saved list.");
    } catch {
      toast.error("Failed to remove saved tuition.");
    } finally {
      setRemovingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading saved tuitions...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">
            Please login first
          </h1>
          <Link
            href="/login"
            className="inline-block mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (session.user.role !== "student") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <p className="text-slate-600">
          You are not authorized to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/student/dashboard"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Dashboard
          </Link>

          <p className="text-sm font-semibold text-indigo-600 mt-6">
            STUDENT DASHBOARD
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Saved Tuitions
          </h1>

          <p className="text-slate-500 mt-2">
            All your bookmarked tuition opportunities in one place.
          </p>
        </div>

        {/* Saved Tuition Count */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
          <p className="text-slate-500 text-sm">
            Total Saved Tuitions
          </p>

          <h2 className="text-3xl font-bold text-indigo-600 mt-2">
            {tuitions.length}
          </h2>
        </div>

        {/* Empty State */}
        {tuitions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No Saved Tuitions Yet
            </h2>

            <p className="text-slate-500 mt-2">
              You have not bookmarked any tuition opportunities.
            </p>

            <Link
              href="/tuitions"
              className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg transition"
            >
              Browse Tuitions
            </Link>
          </div>
        ) : (
          /* Tuition Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tuitions.map((tuition) => (
              <div
                key={tuition._id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              >
                {tuition.bannerImage && (
                  <img
                    src={tuition.bannerImage}
                    alt={tuition.title}
                    className="w-full h-44 object-cover"
                  />
                )}

                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    {tuition.title}
                  </h2>

                  <p className="text-indigo-600 font-medium mt-2">
                    {tuition.subject} · {tuition.classLevel}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold">Mode:</span>{" "}
                      {tuition.mode}
                    </p>

                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {tuition.location}
                    </p>

                    <p>
                      <span className="font-semibold">Monthly Fee:</span>{" "}
                      ৳{tuition.monthlyFee}
                    </p>

                    <p>
                      <span className="font-semibold">Days Per Week:</span>{" "}
                      {tuition.daysPerWeek}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <Link
                      href={`/tuitions/${tuition._id}`}
                      className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => handleRemoveBookmark(tuition._id)}
                      disabled={removingId === tuition._id}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-lg transition disabled:opacity-50"
                    >
                      {removingId === tuition._id
                        ? "Removing..."
                        : "Unbookmark"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
