
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

interface Application {
  _id: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

export default function MyApplicationsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await authClient.token();

        if (!data?.token) {
          toast.error("Please login to view your applications.");
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
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (!isPending && session?.user) {
      fetchApplications();
    } else if (!isPending && !session?.user) {
      setLoading(false);
    }
  }, [session, isPending]);

  // Student cancels a pending application
  const handleCancelApplication = async (applicationId: string) => {
    try {
      setCancellingId(applicationId);

      const { data } = await authClient.token();

      if (!data?.token) {
        toast.error("Please login again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/applications/${applicationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to cancel application.");
        return;
      }

      setApplications((previousApplications) =>
        previousApplications.filter(
          (application) => application._id !== applicationId
        )
      );

      toast.success("Application cancelled successfully.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };


  const getStatusStyle = (status: string) => {
    if (status === "accepted") {
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
        Loading your applications...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Please Login First
        </h1>

        <p className="text-slate-500 mt-2">
          Login to see your tuition applications.
        </p>

        <Link
          href="/login"
          className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-indigo-600 mb-2">
            STUDENT DASHBOARD
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            My Applications
          </h1>

          <p className="text-slate-500 mt-2">
            Track your tuition applications and check their status.
          </p>
        </div>

        {/* Application Count */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
          <p className="text-sm text-slate-500">
            Total Applications
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            {applications.length}
          </h2>
        </div>

        {/* Applications */}
        {applications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <div className="text-4xl mb-4">📚</div>

            <h2 className="text-xl font-semibold text-slate-900">
              No Applications Yet
            </h2>

            <p className="text-slate-500 mt-2">
              You haven't applied for any tuition yet.
            </p>

            <Link
              href="/tuitions"
              className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
            >
              Browse Tuitions
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {application.tuitionTitle}
                    </h2>

                    <p className="text-sm text-indigo-600 font-medium mt-1">
                      {application.subject}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">

                  <div>
                    <p className="text-slate-400">Monthly Fee</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      ৳{application.monthlyFee}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Phone Number</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {application.studentPhone}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Preferred Schedule</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {application.preferredSchedule}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Applied On</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                </div>

                {application.studentNote && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-400">
                      Your Message
                    </p>

                    <p className="text-sm text-slate-700 mt-1">
                      {application.studentNote}
                    </p>
                  </div>
                )}

                {/* Cancel Button */}
                {application.status === "pending" && (
                  <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() =>
                        handleCancelApplication(application._id)
                      }
                      disabled={cancellingId === application._id}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingId === application._id
                        ? "Cancelling..."
                        : "Cancel Application"}
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
