
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  phone?: string;
  plan?: string;
  createdAt?: string;
};

type Tuition = {
  _id: string;
  title: string;
  subject?: string;
  classLevel?: string;
  mode?: string;
  location?: string;
  monthlyFee?: number;
  tutorName?: string;
  tutorEmail?: string;
  approvalStatus: string;
  isActive?: boolean;
};

type Payment = {
  _id: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  planName?: string;
  amount?: number;
  currency?: string;
  transactionId?: string;
  paidAt?: string;
  paymentStatus?: string;
};

type Stats = {
  totalUsers: number;
  totalTutors: number;
  totalTuitions: number;
  pendingTuitions: number;
  approvedTuitions: number;
  totalRevenue: number;
};

const emptyStats: Stats = {
  totalUsers: 0,
  totalTutors: 0,
  totalTuitions: 0,
  pendingTuitions: 0,
  approvedTuitions: 0,
  totalRevenue: 0,
};

async function getToken() {
  const result = await authClient.token();
  const token = result?.data?.token;

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  return token;
}

async function apiRequest(
  path: string,
  token: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${SERVER_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result;
}

function StatusBadge({ status }: { status?: string }) {
  const value = status || "unknown";

  let color = "bg-slate-100 text-slate-700";

  if (["approved", "paid", "active"].includes(value.toLowerCase())) {
    color = "bg-green-100 text-green-700";
  } else if (value.toLowerCase() === "pending") {
    color = "bg-yellow-100 text-yellow-700";
  } else if (["rejected", "inactive"].includes(value.toLowerCase())) {
    color = "bg-red-100 text-red-700";
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${color}`}
    >
      {value}
    </span>
  );
}

function formatDate(date?: string) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const { data: session, isPending } = authClient.useSession();

  const [activeTab, setActiveTab] = useState("overview");

  const [stats, setStats] = useState<Stats>(emptyStats);
  const [users, setUsers] = useState<User[]>([]);
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [roleChanges, setRoleChanges] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isAdmin = session?.user?.role === "admin";

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const [
        statsResult,
        usersResult,
        tuitionsResult,
        paymentsResult,
      ] = await Promise.all([
        apiRequest("/api/admin/stats", token),
        apiRequest("/api/admin/users", token),
        apiRequest("/api/admin/tuitions", token),
        apiRequest("/api/admin/transactions", token),
      ]);

      setStats({
        ...emptyStats,
        ...statsResult,
      });

      setUsers(usersResult);
      setTuitions(tuitionsResult);
      setPayments(paymentsResult);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isPending && isAdmin) {
      loadDashboard();
    }

    if (!isPending && !isAdmin) {
      setLoading(false);
    }
  }, [isPending, isAdmin]);

  async function updateUserRole(userId: string) {
    const newRole = roleChanges[userId];

    if (!newRole) return;

    const confirmed = window.confirm(
      `Are you sure you want to change this user's role to ${newRole}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(userId);
      setError("");
      setMessage("");

      const token = await getToken();

      await apiRequest(`/api/admin/users/${userId}/role`, token, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      setRoleChanges((previous) => {
        const updated = { ...previous };
        delete updated[userId];
        return updated;
      });

      setMessage("User role updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update user role."
      );
    } finally {
      setActionLoading("");
    }
  }

  async function updateTuitionApproval(
    tuitionId: string,
    approvalStatus: "approved" | "rejected"
  ) {
    try {
      setActionLoading(tuitionId);
      setError("");
      setMessage("");

      const token = await getToken();

      await apiRequest(`/api/tuitions/${tuitionId}/approval`, token, {
        method: "PATCH",
        body: JSON.stringify({ approvalStatus }),
      });

      const previousTuition = tuitions.find(
        (tuition) => tuition._id === tuitionId
      );

      setTuitions((previousTuitions) =>
        previousTuitions.map((tuition) =>
          tuition._id === tuitionId
            ? { ...tuition, approvalStatus }
            : tuition
        )
      );

      if (previousTuition?.approvalStatus === "pending") {
        setStats((previousStats) => ({
          ...previousStats,
          pendingTuitions: Math.max(
            0,
            previousStats.pendingTuitions - 1
          ),
          approvedTuitions:
            approvalStatus === "approved"
              ? previousStats.approvedTuitions + 1
              : previousStats.approvedTuitions,
        }));
      }

      setMessage(`Tuition ${approvalStatus} successfully.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update tuition."
      );
    } finally {
      setActionLoading("");
    }
  }

  function changeTab(tab: string) {
    setActiveTab(tab);
    setMessage("");
    setError("");
  }

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="mt-4 font-medium text-slate-600">
            Loading Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Access Denied
          </h1>
          <p className="mt-2 text-slate-600">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  const navigation = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "users", label: "User Management", icon: "👥" },
    { id: "tuitions", label: "Tuition Approval", icon: "📚" },
    { id: "transactions", label: "Transactions", icon: "💳" },
  ];

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Tutors",
      value: stats.totalTutors,
      icon: "👨‍🏫",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Pending Tuitions",
      value: stats.pendingTuitions,
      icon: "⏳",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Approved Tuitions",
      value: stats.approvedTuitions,
      icon: "📚",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Stripe Revenue",
      value: `$${stats.totalRevenue}`,
      icon: "💰",
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  const pendingTuitions = tuitions.filter(
    (tuition) => tuition.approvalStatus === "pending"
  );

  return (
    <div className="min-h-screen bg-slate-50 md:flex">

      {/* Sidebar */}
      <aside className="w-full shrink-0 bg-slate-900 text-white md:min-h-screen md:w-64">
        <div className="border-b border-slate-700 px-6 py-6">
          <h1 className="text-2xl font-bold">
            Mentor<span className="text-indigo-400">Lagbe</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">Admin Dashboard</p>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-4 md:block md:space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => changeTab(item.id)}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition md:w-full ${
                activeTab === item.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden border-t border-slate-700 p-5 md:block">
          <div className="flex items-center gap-3">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Admin"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold">
                {session?.user?.name?.charAt(0) || "A"}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {session?.user?.name}
              </p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

        {/* Top Bar */}
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            MentorLagbe Administration
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
            {navigation.find((item) => item.id === activeTab)?.label}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Welcome back, {session?.user?.name || "Admin"}.
            Manage your platform from here.
          </p>
        </div>

        {/* Notifications */}
        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Overview */}
        {activeTab === "overview" && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {statCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-lg text-xl ${card.color}`}
                    >
                      {card.icon}
                    </span>
                  </div>

                  <h3 className="mt-5 text-3xl font-bold text-slate-800">
                    {card.value}
                  </h3>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800">
                  Tuition Overview
                </h3>

                <div className="mt-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Total Tuitions
                    </span>
                    <strong className="text-slate-800">
                      {stats.totalTuitions}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Pending Approval
                    </span>
                    <strong className="text-yellow-600">
                      {stats.pendingTuitions}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Approved Tuitions
                    </span>
                    <strong className="text-green-600">
                      {stats.approvedTuitions}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => changeTab("tuitions")}
                  className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Review Tuitions
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800">
                  Platform Overview
                </h3>

                <div className="mt-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Registered Users
                    </span>
                    <strong className="text-slate-800">
                      {stats.totalUsers}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Registered Tutors
                    </span>
                    <strong className="text-slate-800">
                      {stats.totalTutors}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Stripe Revenue
                    </span>
                    <strong className="text-indigo-600">
                      ${stats.totalRevenue}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => changeTab("users")}
                  className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Manage Users
                </button>
              </div>
            </div>
          </>
        )}

        {/* User Management */}
        {activeTab === "users" && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-800">
                Registered Users
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Manage roles of all registered platform users.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Current Role</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Update Role</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => {
                    const selectedRole = roleChanges[user._id] || user.role;

                    const isCurrentAdmin =
                      user.email === session?.user?.email;

                    return (
                      <tr key={user._id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                                {user.name?.charAt(0) || "U"}
                              </div>
                            )}

                            <span className="font-semibold text-slate-800">
                              {user.name}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 text-slate-600">
                          {user.email}
                        </td>

                        <td className="p-4">
                          <StatusBadge status={user.role} />
                        </td>

                        <td className="p-4 capitalize text-slate-600">
                          {user.plan || "free"}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={selectedRole}
                              disabled={isCurrentAdmin}
                              onChange={(e) =>
                                setRoleChanges((previous) => ({
                                  ...previous,
                                  [user._id]: e.target.value,
                                }))
                              }
                              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
                            >
                              <option value="student">Student</option>
                              <option value="tutor">Tutor</option>
                              <option value="admin">Admin</option>
                            </select>

                            <button
                              disabled={
                                isCurrentAdmin ||
                                selectedRole === user.role ||
                                actionLoading === user._id
                              }
                              onClick={() => updateUserRole(user._id)}
                              className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                              {actionLoading === user._id
                                ? "Saving..."
                                : "Save"}
                            </button>
                          </div>

                          {isCurrentAdmin && (
                            <p className="mt-1 text-xs text-slate-400">
                              Current account
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-slate-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tuition Approval */}
        {activeTab === "tuitions" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">All Tuitions</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-800">
                  {tuitions.length}
                </h3>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Pending</p>
                <h3 className="mt-2 text-2xl font-bold text-yellow-600">
                  {pendingTuitions.length}
                </h3>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Approved</p>
                <h3 className="mt-2 text-2xl font-bold text-green-600">
                  {stats.approvedTuitions}
                </h3>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <h3 className="text-lg font-bold text-slate-800">
                  All Tuition Posts
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Review and approve or reject tuition submissions.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="p-4">Tuition Details</th>
                      <th className="p-4">Tutor</th>
                      <th className="p-4">Monthly Fee</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {tuitions.map((tuition) => (
                      <tr key={tuition._id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <p className="font-semibold text-slate-800">
                            {tuition.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {tuition.subject || "N/A"} ·{" "}
                            {tuition.classLevel || "N/A"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {tuition.mode || "N/A"} ·{" "}
                            {tuition.location || "N/A"}
                          </p>
                        </td>

                        <td className="p-4">
                          <p className="font-medium text-slate-800">
                            {tuition.tutorName || "N/A"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {tuition.tutorEmail || ""}
                          </p>
                        </td>

                        <td className="p-4 font-medium text-slate-700">
                          ৳{tuition.monthlyFee ?? 0}
                        </td>

                        <td className="p-4">
                          <StatusBadge status={tuition.approvalStatus} />
                        </td>

                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {tuition.approvalStatus !== "approved" && (
                              <button
                                disabled={actionLoading === tuition._id}
                                onClick={() =>
                                  updateTuitionApproval(
                                    tuition._id,
                                    "approved"
                                  )
                                }
                                className="rounded-md bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                              >
                                Approve
                              </button>
                            )}

                            {tuition.approvalStatus !== "rejected" && (
                              <button
                                disabled={actionLoading === tuition._id}
                                onClick={() =>
                                  updateTuitionApproval(
                                    tuition._id,
                                    "rejected"
                                  )
                                }
                                className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {tuitions.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-8 text-center text-slate-500"
                        >
                          No tuition posts available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Transactions */}
        {activeTab === "transactions" && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-800">
                Stripe Transactions
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                View subscription payment records from the platform.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Payment Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <p className="font-semibold text-slate-800">
                          {payment.userName || "N/A"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {payment.userEmail || ""}
                        </p>
                      </td>

                      <td className="p-4 capitalize text-slate-600">
                        {payment.userRole || "N/A"}
                      </td>

                      <td className="p-4">
                        <StatusBadge status={payment.planName} />
                      </td>

                      <td className="p-4 font-semibold text-slate-800">
                        {payment.currency?.toUpperCase() || "USD"}{" "}
                        {payment.amount ?? 0}
                      </td>

                      <td className="p-4 text-slate-600">
                        <span className="block max-w-[180px] truncate">
                          {payment.transactionId || "N/A"}
                        </span>
                      </td>

                      <td className="p-4 text-slate-600">
                        {formatDate(payment.paidAt)}
                      </td>
                    </tr>
                  ))}

                  {payments.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-8 text-center text-slate-500"
                      >
                        No payment records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
