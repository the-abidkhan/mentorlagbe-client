import Link from "next/link";

export default function Navbar() {
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
        </div>
      </div>
    </nav>
  );
}