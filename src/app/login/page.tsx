
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

const CLIENT_URL = "https://mentorlagbe-client-ebon.vercel.app";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  if (isPending || session) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: CLIENT_URL,
      });

      if (error) {
        setError(error.message || "Login failed.");
        return;
      }

      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: CLIENT_URL,
      });

      if (error) {
        setError(error.message || "Google login failed.");
      }
    } catch {
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-gray-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-8">
          Login to your MentorLagbe account
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-400 hover:text-blue-300"
          >
            Sign Up
          </Link>
        </p>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-gray-700"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="h-px flex-1 bg-gray-700"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-700 py-3 text-white font-semibold hover:bg-gray-800 transition"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
