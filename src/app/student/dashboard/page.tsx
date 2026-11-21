
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

interface Application {
  _id: string;
  status: "pending" | "accepted" | "rejected";
}

export default function StudentDashboard() {
  const { data: session, isPending } = authClient.useSession();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await authClient.token();

        if (!data?.token) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/applications/my`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.message || "Failed to load applications.");
          return;
        }

        setApplications(result);
      } catch {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (!isPending && session?.user?.role === "student") {
      fetchApplications();
    } else if (!isPending) {
      setLoading(false);
    }
  }, [session, isPending]);

  const totalApplications = applications.length;

  const pendingApplications = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const acceptedApplications = applications.filter(
    (application) => application.status === "accepted"
  ).length;

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!session?.user) {
    return <p className="p-8">Please login first.</p>;
  }

  if (session.user.role !== "student") {
    return <p className="p-8">You are not authorized to access this page.</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-indigo-600">
            STUDENT DASHBOARD
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Welcome, {session.user.name}!
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your tuition applications from here.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">
              Total Applications
            </p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {totalApplications}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">
              Pending Applications
            </p>
            <h2 className="text-3xl font-bold text-amber-600 mt-2">
              {pendingApplications}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">
              Accepted Applications
            </p>
            <h2 className="text-3xl font-bold text-emerald-600 mt-2">
              {acceptedApplications}
            </h2>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Quick Actions
          </h2>

          <p className="text-slate-500 mt-2">
            Find tuition opportunities and track your applications.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <Link
              href="/tuitions"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg transition"
            >
              Browse Tuitions
            </Link>

            <Link
              href="/my-applications"
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-lg transition"
            >
              My Applications
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
