
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

const CLIENT_URL = "https://mentorlagbe-client-ebon.vercel.app";

export default function SignupPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && session) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  if (isPending || session) {
    return null;
  }

  const handleSignup = async () => {
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        phone: phone.trim(),
        callbackURL: CLIENT_URL,
      });

      if (error) {
        setError(error.message || "Signup failed. Please try again.");
        return;
      }

      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: CLIENT_URL,
      });

      if (error) {
        setError(error.message || "Google signup failed.");
      }
    } catch {
      setError("Google signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
          Create Account
        </h1>

        <p className="text-slate-500 text-center mb-6">
          Join MentorLagbe today
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Your Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-indigo-600 bg-white"
            >
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        <p className="text-center text-sm text-slate-600 mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-sm text-slate-400">OR</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full border border-slate-200 hover:bg-slate-50 py-3 rounded-lg flex items-center justify-center gap-3 font-medium text-slate-700 transition"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
