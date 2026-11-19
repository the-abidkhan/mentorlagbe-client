
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Mentor<span className="text-blue-500">Lagbe</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-300 hover:text-blue-400 transition"
          >
            Home
          </Link>

          <Link
            href="/tuitions"
            className="text-gray-300 hover:text-blue-400 transition"
          >
            Find Tuition
          </Link>

          <Link
            href="/about"
            className="text-gray-300 hover:text-blue-400 transition"
          >
            About
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-gray-300 hover:text-white transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </nav>
  );
}
