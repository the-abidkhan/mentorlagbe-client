
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

interface Tuition {
  _id: string;
  approvalStatus: "pending" | "approved" | "rejected";
}

interface Application {
  _id: string;
  status: "pending" | "accepted" | "rejected";
}

export default function TutorDashboard() {
  const { data: session, isPending } = authClient.useSession();

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await authClient.token();

        if (!data?.token) {
          toast.error("Please login again.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${data.token}`,
        };

        const [tuitionResponse, applicationResponse] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions/my`,
            { headers }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/applications/tutor`,
            { headers }
          ),
        ]);

        const tuitionResult = await tuitionResponse.json();
        const applicationResult = await applicationResponse.json();

        if (!tuitionResponse.ok) {
          toast.error(
            tuitionResult.message || "Failed to load your tuitions."
          );
        } else {
          setTuitions(tuitionResult);
        }

        if (!applicationResponse.ok) {
          toast.error(
            applicationResult.message || "Failed to load applications."
          );
        } else {
          setApplications(applicationResult);
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (!isPending && session?.user?.role === "tutor") {
      fetchDashboardData();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [session, isPending]);

  const pendingApplications = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const approvedTuitions = tuitions.filter(
    (tuition) => tuition.approvalStatus === "approved"
  ).length;

  const pendingTuitions = tuitions.filter(
    (tuition) => tuition.approvalStatus === "pending"
  ).length;

  if (isPending || loading) {
    return <p className="p-8">Loading dashboard...</p>;
  }

  if (!session?.user) {
    return <p className="p-8">Please login first.</p>;
  }

  if (session.user.role !== "tutor") {
    return (
      <p className="p-8">
        You are not authorized to access this page.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            TUTOR PANEL
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Tutor Dashboard
          </h1>

          <p className="text-slate-600 mt-2">
            Welcome, {session.user.name}!
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">
              Total Posted Tuitions
            </p>

            <h2 className="text-3xl font-bold text-indigo-600 mt-2">
              {tuitions.length}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              {approvedTuitions} approved · {pendingTuitions} pending
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">
              Total Applications Received
            </p>

            <h2 className="text-3xl font-bold text-emerald-600 mt-2">
              {applications.length}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              From students interested in your tuitions
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">
              Pending Applications
            </p>

            <h2 className="text-3xl font-bold text-amber-600 mt-2">
              {pendingApplications}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              Waiting for your review
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Manage Your Account
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link
              href="/my-tuitions"
              className="bg-white border border-slate-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition"
            >
              <div className="text-3xl mb-4">📚</div>

              <h3 className="text-lg font-semibold text-slate-900">
                My Tuitions
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                View your tuition posts and approval status.
              </p>

              <p className="text-sm font-semibold text-indigo-600 mt-4">
                View Tuitions →
              </p>
            </Link>

            <Link
              href="/tutor-applications"
              className="bg-white border border-slate-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition"
            >
              <div className="text-3xl mb-4">📋</div>

              <h3 className="text-lg font-semibold text-slate-900">
                Manage Applications
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Review student applications and update their status.
              </p>

              <p className="text-sm font-semibold text-indigo-600 mt-4">
                View Applications →
              </p>
            </Link>

            <Link
              href="/tuitions"
              className="bg-white border border-slate-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition"
            >
              <div className="text-3xl mb-4">🔎</div>

              <h3 className="text-lg font-semibold text-slate-900">
                Browse Tuitions
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Explore available tuition opportunities.
              </p>

              <p className="text-sm font-semibold text-indigo-600 mt-4">
                Explore →
              </p>
            </Link>
          </div>
        </div>

        {/* Recent Tuition Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">
              Your Tuition Overview
            </h2>

            <Link
              href="/my-tuitions"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View All
            </Link>
          </div>

          {tuitions.length === 0 ? (
            <p className="text-slate-500 mt-5">
              You have not posted any tuition yet.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {tuitions.slice(0, 3).map((tuition) => (
                <div
                  key={tuition._id}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      Tuition #{tuition._id.slice(-6)}
                    </p>

                    <p className="text-sm text-slate-500 capitalize mt-1">
                      {tuition.approvalStatus}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      tuition.approvalStatus === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : tuition.approvalStatus === "rejected"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {tuition.approvalStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
