
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl bg-gray-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-8">
          Join MentorLagbe today
        </p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Account Type
            </label>
            <select
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none focus:border-blue-500"
              defaultValue="student"
            >
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
