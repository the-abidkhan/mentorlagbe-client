
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
  description: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
}

export default function MyTuitionsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    if (!isPending && session?.user?.role === "tutor") {
      fetchMyTuitions();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [session, isPending]);

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

        {/* Statistics */}
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

        {/* Tuition List */}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
