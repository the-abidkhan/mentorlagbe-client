"use client";

import { authClient } from "@/lib/auth-client";

export default function TutorDashboard() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <p className="p-8">Loading...</p>;
  }

  if (!session?.user) {
  return <p className="p-8">Please login first.</p>;
}

if (session.user.role !== "tutor") {
  return <p className="p-8">You are not authorized to access this page.</p>;
}

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">
          Tutor Dashboard
        </h1>

        <p className="text-slate-600 mt-2">
          Welcome, {session.user.name}!
        </p>

        <div className="bg-white border border-slate-200 rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Your Dashboard
          </h2>

          <p className="text-slate-600 mt-2">
            Manage your tuition applications and find teaching opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}