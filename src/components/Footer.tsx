import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link
              href="/"
              className="font-heading text-2xl font-bold text-white"
            >
              Mentor<span className="text-indigo-500">Lagbe</span>
            </Link>
            <p className="mt-4 text-sm leading-7 max-w-sm">
              MentorLagbe connects students with qualified tutors and creates
              better learning opportunities for everyone.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tuitions"
                  className="hover:text-indigo-400 transition"
                >
                  Find Tuition
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-indigo-400 transition"
                >
                  Pricing &amp; Pro
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-indigo-400 transition"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-white font-semibold text-lg mb-4">
              Account
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/login"
                  className="hover:text-indigo-400 transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="hover:text-indigo-400 transition"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm">
          <p>© 2026 MentorLagbe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}