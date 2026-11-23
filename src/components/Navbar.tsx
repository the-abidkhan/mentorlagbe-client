
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function Navbar() {
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const role = session?.user?.role;
  const isAdmin = role === "admin";
  const isProTutor =
    role === "tutor" && session?.user?.plan === "pro";

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

  const allNavLinks = [
    { name: "Home", href: "/" },
    { name: "Find Tuition", href: "/tuitions" },
    { name: "Pricing & Pro", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  // Admin does not need a Pro plan, so hide the pricing link
  const navLinks = isAdmin
    ? allNavLinks.filter((link) => link.href !== "/pricing")
    : allNavLinks;

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getDashboardLink = () => {
    if (role === "student") return "/student/dashboard";
    if (role === "tutor") return "/tutor/dashboard";
    if (role === "admin") return "/admin/dashboard";

    return "/dashboard";
  };

  const getRoleBadgeColor = () => {
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
      setIsMobileMenuOpen(false);
      sessionStorage.removeItem("mentorlagbe_login_toast");
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-2xl font-extrabold tracking-tight text-slate-900"
        >
          Mentor<span className="text-indigo-600">Lagbe</span>
          <span className="ml-1 text-indigo-500">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 rounded-2xl bg-slate-100/80 p-1 md:flex">
          {navLinks.map((link) => {
            const active = isActiveLink(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/70"
                    : "text-slate-600 hover:bg-white/70 hover:text-indigo-600"
                }`}
              >
                {link.name}

                {active && (
                  <span className="absolute bottom-0.5 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-indigo-600" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 text-sm font-medium">
          {isPending ? (
            <span className="text-slate-400">Loading...</span>
          ) : session?.user ? (
            <div className="relative">
              {/* Profile Button */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 sm:gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-indigo-100 font-bold text-indigo-700 ring-2 ring-indigo-100">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    session.user.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                <div className="hidden flex-col items-start sm:flex">
                  <span className="flex max-w-40 items-center gap-1 truncate text-slate-700">
                    <span className="truncate">
                      {session.user.name || session.user.email}
                    </span>

                    {isProTutor && (
                      <MdVerified
                        className="h-4 w-4 shrink-0 text-blue-600"
                        title="Verified Tutor"
                      />
                    )}
                  </span>

                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${getRoleBadgeColor()}`}
                  >
                    {role || "User"}
                  </span>

                  {isProTutor && (
                    <span className="mt-1 text-[10px] font-semibold text-blue-600">
                      Verified Tutor
                    </span>
                  )}
                </div>

                <span className="text-xs text-slate-500">▼</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-3 text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-3 text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Update Profile
                  </Link>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
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
                className="hidden text-slate-700 transition hover:text-indigo-600 sm:block"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-xl text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                  }`}
                >
                  {active && <span className="mr-2">●</span>}
                  {link.name}
                </Link>
              );
            })}

            {!session?.user && !isPending && (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
