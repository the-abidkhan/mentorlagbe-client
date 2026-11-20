
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();

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

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("Logout failed. Please try again.");
        return;
      }

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
          <Link href="/" className="text-slate-600 hover:text-indigo-600 transition">
            Home
          </Link>

          <Link href="/tuitions" className="text-slate-600 hover:text-indigo-600 transition">
            Find Tuition
          </Link>

          <Link href="/pricing" className="text-slate-600 hover:text-indigo-600 transition">
            Pricing &amp; Pro
          </Link>

          <Link href="/about" className="text-slate-600 hover:text-indigo-600 transition">
            About
          </Link>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          {isPending ? (
            <span className="text-slate-400">Loading...</span>
          ) : session?.user ? (
            <>
              <span className="hidden sm:block text-slate-700">
                Hi, {session.user.name || session.user.email}
              </span>

              <button
                onClick={handleLogout}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
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
