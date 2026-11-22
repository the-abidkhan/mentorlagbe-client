
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      const hasShownToast = sessionStorage.getItem(
        "mentorlagbe_login_toast"
      );

      if (!hasShownToast) {
        toast.success("Login successful!");
        sessionStorage.setItem("mentorlagbe_login_toast", "true");
      }
    } else {
      sessionStorage.removeItem("mentorlagbe_login_toast");
    }
  }, [session, isPending]);

  const getDashboardLink = () => {
    const role = session?.user?.role;

    if (role === "student") return "/student/dashboard";
    if (role === "tutor") return "/tutor/dashboard";
    if (role === "admin") return "/admin/dashboard";

    return "/dashboard";
  };

  const getRoleBadgeColor = () => {
    const role = session?.user?.role;

    if (role === "student") return "bg-blue-100 text-blue-700";
    if (role === "tutor") return "bg-emerald-100 text-emerald-700";
    if (role === "admin") return "bg-amber-100 text-amber-700";

    return "bg-slate-100 text-slate-700";
  };

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("Logout failed. Please try again.");
        return;
      }

      setIsProfileOpen(false);
      sessionStorage.removeItem("mentorlagbe_login_toast");
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-2xl font-bold text-slate-900"
        >
          Mentor<span className="text-indigo-600">Lagbe</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="text-slate-600 hover:text-indigo-600 transition"
          >
            Home
          </Link>

          <Link
            href="/tuitions"
            className="text-slate-600 hover:text-indigo-600 transition"
          >
            Find Tuition
          </Link>

          <Link
            href="/pricing"
            className="text-slate-600 hover:text-indigo-600 transition"
          >
            Pricing &amp; Pro
          </Link>

          <Link
            href="/about"
            className="text-slate-600 hover:text-indigo-600 transition"
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          {isPending ? (
            <span className="text-slate-400">Loading...</span>
          ) : session?.user ? (
            <div className="relative">
              {/* Profile Button */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 rounded-lg p-1 hover:bg-slate-50 transition"
              >
                {/* Profile Image */}
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold overflow-hidden">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    session.user.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-slate-700">
                    {session.user.name || session.user.email}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-xs capitalize ${getRoleBadgeColor()}`}
                  >
                    {session.user.role || "User"}
                  </span>
                </div>

                <span className="text-slate-500 text-xs">▼</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    Update Profile
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-700 hover:text-indigo-600 transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
